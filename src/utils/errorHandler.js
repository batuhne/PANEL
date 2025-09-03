/**
 * Centralized Error Handler System
 */

import logger from './logger'
import {
  ApplicationError,
  ValidationError,
  AuthenticationError,
  NetworkError,
  DeviceError,
  BusinessRuleError,
  ConfigurationError
} from './errors'

/**
 * Error Handler Class
 * Centralizes all error handling logic and provides consistent error processing
 */
class ErrorHandler {
  constructor() {
    this.errorReportingService = null
    this.userNotificationCallback = null
  }

  /**
   * Initialize error handler with external services
   */
  initialize(config = {}) {
    this.errorReportingService = config.errorReportingService || null
    this.userNotificationCallback = config.userNotificationCallback || null
    
    logger.info('ErrorHandler initialized', {
      hasReporting: !!this.errorReportingService,
      hasNotification: !!this.userNotificationCallback
    })
  }

  /**
   * Main error handling method
   * Processes any error and determines appropriate response
   */
  handleError(error, context = {}) {
    const processedError = this.processError(error, context)
    
    // Log the error
    this.logError(processedError, context)
    
    // Report to external service if available
    if (this.errorReportingService) {
      this.reportError(processedError, context)
    }
    
    // Get user-friendly message
    const userMessage = this.getUserMessage(processedError)
    
    // Notify user if callback provided
    if (this.userNotificationCallback) {
      this.userNotificationCallback(userMessage, processedError.severity || 'error')
    }
    
    return {
      error: processedError,
      message: userMessage,
      shouldRetry: this.shouldRetry(processedError),
      retryDelay: this.getRetryDelay(processedError)
    }
  }

  /**
   * Process and normalize error into ApplicationError format
   */
  processError(error, context) {
    // If already an ApplicationError, return as-is
    if (error instanceof ApplicationError) {
      return error
    }

    // Handle different error types
    if (error instanceof TypeError) {
      return new ConfigurationError(
        `Type error: ${error.message}`,
        { originalError: error.message, context }
      )
    }

    if (error instanceof ReferenceError) {
      return new ConfigurationError(
        `Reference error: ${error.message}`,
        { originalError: error.message, context }
      )
    }

    // Network/HTTP errors
    if (error.name === 'NetworkError' || error.code === 'NETWORK_ERROR') {
      return new NetworkError(
        context.operation || 'unknown operation',
        error.status || null,
        error
      )
    }

    // Parse JSON errors as validation errors
    if (error instanceof SyntaxError && error.message.includes('JSON')) {
      return new ValidationError(
        'json',
        'Invalid JSON format',
        context.data
      )
    }

    // Generic error fallback
    return new ApplicationError(
      error.message || 'An unexpected error occurred',
      'UNKNOWN_ERROR',
      { originalError: error.toString(), context }
    )
  }

  /**
   * Log error with appropriate level and context
   */
  logError(error, context) {
    const logContext = {
      errorCode: error.code,
      errorType: error.name,
      context: error.context,
      timestamp: error.timestamp,
      severity: this.getErrorSeverity(error),
      ...context
    }

    switch (this.getErrorSeverity(error)) {
      case 'critical':
        logger.error(`Critical error: ${error.message}`, logContext)
        break
      case 'high':
        logger.error(`High severity error: ${error.message}`, logContext)
        break
      case 'medium':
        logger.warn(`Medium severity error: ${error.message}`, logContext)
        break
      case 'low':
        logger.info(`Low severity error: ${error.message}`, logContext)
        break
      default:
        logger.error(`Error: ${error.message}`, logContext)
    }
  }

  /**
   * Report error to external monitoring service
   */
  reportError(error, context) {
    try {
      if (this.errorReportingService) {
        this.errorReportingService.captureException(error, {
          level: this.getErrorSeverity(error),
          extra: context,
          tags: {
            errorCode: error.code,
            errorType: error.name
          }
        })
      }
    } catch (reportingError) {
      logger.error('Failed to report error to external service', {
        originalError: error.message,
        reportingError: reportingError.message
      })
    }
  }

  /**
   * Get user-friendly error message
   * Hides technical details from end users
   */
  getUserMessage(error) {
    const userMessages = {
      VALIDATION_ERROR: 'Please check your input and try again.',
      AUTH_ERROR: 'Authentication failed. Please log in again.',
      NETWORK_ERROR: 'Network connection issue. Please check your internet connection.',
      DEVICE_ERROR: 'Device connection failed. Please try again.',
      BUSINESS_RULE_ERROR: 'This action cannot be completed due to business rules.',
      CONFIG_ERROR: 'System configuration error. Please contact support.',
      UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.'
    }

    return userMessages[error.code] || userMessages.UNKNOWN_ERROR
  }

  /**
   * Determine error severity for logging and reporting
   */
  getErrorSeverity(error) {
    const severityMap = {
      VALIDATION_ERROR: 'low',
      AUTH_ERROR: 'medium',
      NETWORK_ERROR: 'medium',
      DEVICE_ERROR: 'medium',
      BUSINESS_RULE_ERROR: 'low',
      CONFIG_ERROR: 'high',
      UNKNOWN_ERROR: 'high'
    }

    return severityMap[error.code] || 'medium'
  }

  /**
   * Determine if operation should be retried
   */
  shouldRetry(error) {
    const retryableErrors = [
      'NETWORK_ERROR',
      'DEVICE_ERROR'
    ]

    return retryableErrors.includes(error.code)
  }

  /**
   * Get retry delay based on error type
   * Progressive backoff for network errors
   */
  getRetryDelay(error) {
    const delayMap = {
      NETWORK_ERROR: 1000, // 1 second
      DEVICE_ERROR: 2000,  // 2 seconds
    }

    return delayMap[error.code] || 0
  }

  /**
   * Create safe async wrapper function
   * Following Result pattern for predictable error handling
   */
  createSafeAsyncFunction(asyncFunction, context = {}) {
    return async (...args) => {
      try {
        const result = await asyncFunction(...args)
        return { success: true, data: result, error: null }
      } catch (error) {
        const handledError = this.handleError(error, { ...context, function: asyncFunction.name })
        return { 
          success: false, 
          data: null, 
          error: handledError.error,
          message: handledError.message,
          shouldRetry: handledError.shouldRetry,
          retryDelay: handledError.retryDelay
        }
      }
    }
  }

  /**
   * Create safe sync wrapper function
   * Following Result pattern for predictable error handling
   */
  createSafeSyncFunction(syncFunction, context = {}) {
    return (...args) => {
      try {
        const result = syncFunction(...args)
        return { success: true, data: result, error: null }
      } catch (error) {
        const handledError = this.handleError(error, { ...context, function: syncFunction.name })
        return { 
          success: false, 
          data: null, 
          error: handledError.error,
          message: handledError.message
        }
      }
    }
  }
}

// Create singleton instance
const errorHandler = new ErrorHandler()

// Helper functions for common error scenarios
export const handleValidationError = (field, reason, value) => {
  const error = new ValidationError(field, reason, value)
  return errorHandler.handleError(error, { source: 'validation' })
}

export const handleAuthError = (reason, attemptedAction) => {
  const error = new AuthenticationError(reason, attemptedAction)
  return errorHandler.handleError(error, { source: 'authentication' })
}

export const handleNetworkError = (operation, response) => {
  const error = new NetworkError(operation, response?.status, response)
  return errorHandler.handleError(error, { source: 'network' })
}

export const handleDeviceError = (deviceId, operation, reason) => {
  const error = new DeviceError(deviceId, operation, reason)
  return errorHandler.handleError(error, { source: 'device' })
}

// Export singleton instance and class
export { ErrorHandler }
export default errorHandler
