/**
 * Custom Error Classes for Domain-Specific Error Handling
 */

/**
 * Base application error class
 * All custom errors should extend this base class
 */
class ApplicationError extends Error {
  constructor(message, code = 'APP_ERROR', context = {}) {
    super(message)
    this.name = this.constructor.name
    this.code = code
    this.context = context
    this.timestamp = new Date().toISOString()
    
    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      context: this.context,
      timestamp: this.timestamp,
      stack: this.stack
    }
  }
}

/**
 * Validation errors for form inputs and user data
 * Used when user input doesn't meet business rules
 */
class ValidationError extends ApplicationError {
  constructor(field, reason, value = null) {
    const message = `Validation failed for ${field}: ${reason}`
    super(message, 'VALIDATION_ERROR', { field, reason, value })
  }
}

/**
 * Authentication and authorization errors
 * Used for login failures, permission issues, etc.
 */
class AuthenticationError extends ApplicationError {
  constructor(reason, attemptedAction = null) {
    const message = `Authentication failed: ${reason}`
    super(message, 'AUTH_ERROR', { reason, attemptedAction })
  }
}

/**
 * Network and API communication errors
 * Used for HTTP failures, timeout, connectivity issues
 */
class NetworkError extends ApplicationError {
  constructor(operation, statusCode = null, originalError = null) {
    const message = `Network operation failed: ${operation}`
    super(message, 'NETWORK_ERROR', { 
      operation, 
      statusCode, 
      originalError: originalError?.message 
    })
  }
}

/**
 * Device connection and hardware errors
 * Used for device selection, connection failures
 */
class DeviceError extends ApplicationError {
  constructor(deviceId, operation, reason) {
    const message = `Device operation failed for ${deviceId}: ${operation}`
    super(message, 'DEVICE_ERROR', { deviceId, operation, reason })
  }
}

/**
 * Business logic and domain rule violations
 * Used when business rules are violated
 */
class BusinessRuleError extends ApplicationError {
  constructor(rule, context = {}) {
    const message = `Business rule violation: ${rule}`
    super(message, 'BUSINESS_RULE_ERROR', { rule, ...context })
  }
}

/**
 * Configuration and system errors
 * Used for missing config, environment issues
 */
class ConfigurationError extends ApplicationError {
  constructor(setting, expectedValue = null) {
    const message = `Configuration error: ${setting}`
    super(message, 'CONFIG_ERROR', { setting, expectedValue })
  }
}

export {
  ApplicationError,
  ValidationError,
  AuthenticationError,
  NetworkError,
  DeviceError,
  BusinessRuleError,
  ConfigurationError
}
