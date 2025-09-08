import config from '../config/environment'
import logger from '../utils/logger'
import { 
  NetworkError, 
  AuthenticationError, 
  ValidationError, 
  DeviceError 
} from '../utils/errors'

class ApiService {
  constructor() {
    this.baseURL = config.API_BASE_URL
    this.timeout = config.API_TIMEOUT
    this.maxRetries = config.MAX_RETRY_ATTEMPTS
  }

  // Generic request handler with error processing
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const controller = new AbortController()
    
    // Set timeout
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      signal: controller.signal,
      ...options
    }

    try {
      logger.debug('API Request', { url, method: options.method || 'GET' })
      
      const response = await fetch(url, defaultOptions)
      clearTimeout(timeoutId)

      if (!response.ok) {
        await this.handleErrorResponse(response)
      }

      const data = await response.json()
      logger.debug('API Response', { url, status: response.status })
      
      return data
    } catch (error) {
      clearTimeout(timeoutId)
      
      if (error.name === 'AbortError') {
        throw new NetworkError('Request timeout', { endpoint, timeout: this.timeout })
      }

      if (error instanceof TypeError) {
        throw new NetworkError('Network connection failed', { endpoint, originalError: error.message })
      }
      
      throw error
    }
  }

  // Handle error responses
  async handleErrorResponse(response) {
    const errorData = await response.json().catch(() => ({}))
    const { error } = errorData

    switch (response.status) {
        case 400:
          throw new ValidationError(
            error?.field || 'validation',
            error?.message || 'Validation failed',
            { code: error?.code, details: errorData }
          )
        case 401:
          throw new AuthenticationError(
            error?.message || 'Authentication failed',
            { code: error?.code, shouldRedirect: true }
          )
        case 403:
          throw new AuthenticationError(
            error?.message || 'Access forbidden',
            { code: error?.code, shouldRedirect: false }
          )
        case 404:
          throw new NetworkError(
            error?.message || 'Resource not found',
            { status: 404, endpoint: response.url }
          )
        case 422:
          throw new DeviceError(
            error?.message || 'Device operation failed',
            { code: error?.code, deviceId: error?.deviceId }
          )
          default:
            throw new NetworkError(
              error?.message || 'Unknown server error',
              { status: response.status, details: errorData }
            )
        }
      }

      // Add authorization header
  addAuthHeader(token) {
    return {
      'Authorization': `Bearer ${token}`
    }
  }

  // Authentication endpoints
  async login(credentials) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    })
    
    logger.info('User login successful', { 
      userId: data.data?.user?.id,
      userType: data.data?.user?.userType 
    })
    
    return data
  }

  async logout() {
    try {
      const token = await this.getStoredToken()
      if (token) {
        await this.request('/auth/logout', {
          method: 'POST',
          headers: this.addAuthHeader(token)
        })
      }
    } catch (error) {
      logger.warn('Logout request failed, continuing with local cleanup', { error: error.message })
    }
    
    // Always clear local storage even if server request fails
    this.clearStoredAuth()
    logger.info('User logout completed')
  }

  async refreshToken(refreshToken) {
    const data = await this.request('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken })
    })
    
    return data
  }

  // Device management endpoints
  async getDevices() {
    const token = await this.getStoredToken()
    const data = await this.request('/devices', {
      headers: this.addAuthHeader(token)
    })
    
    logger.debug('Devices fetched', { count: data.data?.devices?.length })
    return data
  }

  async selectDevice(deviceId) {
    const token = await this.getStoredToken()
    const data = await this.request(`/devices/${deviceId}/select`, {
      method: 'POST',
      headers: this.addAuthHeader(token)
    })
    
    logger.info('Device selected', { deviceId })
    return data
  }

  // Dashboard data endpoints
  async getDashboardData(deviceId, userType) {
    const token = await this.getStoredToken()
    const queryParams = new URLSearchParams({ 
      deviceId: deviceId || '', 
      userType: userType || 'user' 
    })
    
    const data = await this.request(`/dashboard/data?${queryParams}`, {
      headers: this.addAuthHeader(token)
    })
    
    logger.debug('Dashboard data fetched', { deviceId, userType })
    return data
  }

  // WebSocket connection for real-time data
  connectToLiveData(deviceId, onMessage, onError, onClose) {
    if (!config.ENABLE_WEBSOCKET) {
      logger.warn('WebSocket disabled in configuration')
      return null
    }

    const wsUrl = `${config.WS_URL}/live-data/${deviceId}`
    
    try {
      const ws = new WebSocket(wsUrl)
      
      ws.onopen = () => {
        logger.info('WebSocket connected', { deviceId })
      }
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          logger.debug('WebSocket message received', { type: data.type })
          onMessage(data)
        } catch (error) {
          logger.error('WebSocket message parsing failed', { error: error.message })
        }
      }

      ws.onerror = (error) => {
        logger.error('WebSocket error', { error })
        if (onError) onError(error)
      }
      
      ws.onclose = () => {
        logger.info('WebSocket disconnected', { deviceId })
        if (onClose) onClose()
      }
      
      return ws
    } catch (error) {
      logger.error('WebSocket connection failed', { error: error.message, deviceId })
      throw new NetworkError('WebSocket connection failed', { deviceId, originalError: error.message })
    }
  }

  // Token management helpers
  async getStoredToken() {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      throw new AuthenticationError('No authentication token found', { shouldRedirect: true })
    }
    return token
  }

  storeAuthData(tokens, user) {
    localStorage.setItem('auth_token', tokens.accessToken)
    localStorage.setItem('refresh_token', tokens.refreshToken)
    localStorage.setItem('user_data', JSON.stringify(user))
    localStorage.setItem('token_expires', Date.now() + (tokens.expiresIn * 1000))
  }

  clearStoredAuth() {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user_data')
    localStorage.removeItem('token_expires')
  }

  isTokenExpired() {
    const expiry = localStorage.getItem('token_expires')
    return expiry ? Date.now() > parseInt(expiry) : true
  }

  // Health check endpoint
  async healthCheck() {
    const data = await this.request('/test/health')
    logger.debug('Health check completed', { status: data.status })
    return data
  }
}

// Export singleton instance
export const apiService = new ApiService()
export default apiService