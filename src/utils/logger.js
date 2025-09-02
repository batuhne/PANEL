const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
}

class Logger {
  constructor(level = 'INFO') {
    this.level = LOG_LEVELS[level] || LOG_LEVELS.INFO
    this.isDevelopment = process.env.NODE_ENV === 'development'
    this.isProduction = process.env.NODE_ENV === 'production'
  }

  /**
   * Log debug information (development only)
   * @param {string} message - The debug message
   * @param {object} context - Additional context data
   */
  debug(message, context = {}) {
    if (this.level <= LOG_LEVELS.DEBUG && this.isDevelopment) {
      console.log(`🐛 DEBUG: ${message}`, this._formatContext(context))
    }
  }

  /**
   * Log informational messages
   * @param {string} message - The info message  
   * @param {object} context - Additional context data
   */
  info(message, context = {}) {
    if (this.level <= LOG_LEVELS.INFO) {
      console.info(`ℹ️ INFO: ${message}`, this._formatContext(context))
    }
  }

  /**
   * Log warning messages
   * @param {string} message - The warning message
   * @param {object} context - Additional context data
   */
  warn(message, context = {}) {
    if (this.level <= LOG_LEVELS.WARN) {
      console.warn(`⚠️ WARN: ${message}`, this._formatContext(context))
    }
  }

  /**
   * Log error messages (always logged)
   * @param {string} message - The error message
   * @param {object} context - Additional context data
   */
  error(message, context = {}) {
    if (this.level <= LOG_LEVELS.ERROR) {
      console.error(`🚨 ERROR: ${message}`, this._formatContext(context))
    }
  }

  /**
   * Format context object for consistent logging
   * @private
   * @param {object} context - Context data to format
   * @returns {object} Formatted context
   */
  _formatContext(context) {
    if (!context || Object.keys(context).length === 0) {
      return undefined
    }

    return {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      ...context
    }
  }
}

// Environment-based logger instance
const logger = new Logger(
  process.env.NODE_ENV === 'production' ? 'ERROR' : 'DEBUG'
)

export default logger
