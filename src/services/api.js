// API service for backend communication
// This will be implemented when backend is ready

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.potential.com'

export const apiService = {
  // Authentication services
  login: async (_credentials) => {
    // TODO: Implement AWS Cognito authentication
    // const response = await fetch(`${API_BASE_URL}/auth/login`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(credentials)
    // })
    // return response.json()
    throw new Error('Backend not implemented yet')
  },

  logout: async () => {
    // TODO: Implement logout logic
    // Clear tokens, invalidate session, etc.
    throw new Error('Backend not implemented yet')
  },

  // Device management
  getDevices: async () => {
    // TODO: Fetch user devices from DynamoDB
    throw new Error('Backend not implemented yet')
  },

  selectDevice: async (_deviceId) => {
    // TODO: Set active device context
    throw new Error('Backend not implemented yet')
  },

  // Dashboard data
  getDashboardData: async (_userType, _deviceId) => {
    // TODO: Fetch dashboard data based on user type and device
    throw new Error('Backend not implemented yet')
  },

  // Real-time data via WebSocket
  connectToLiveData: (_deviceId, _onMessage) => {
    // TODO: Implement WebSocket connection to AWS IoT Core
    // const ws = new WebSocket(`${WS_URL}/live-data/${deviceId}`)
    // ws.onmessage = onMessage
    // return ws
    throw new Error('Backend not implemented yet')
  }
}

export default apiService
