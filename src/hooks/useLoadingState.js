/**
 * Loading State Management Hook
 * Provides consistent loading state management with error recovery
 */

import { useState, useCallback, useRef, useEffect } from 'react'
import errorHandler from '../utils/errorHandler'
import logger from '../utils/logger'

/**
 * Custom hook for managing loading states with error handling
 * 
 * @param {Object} options - Configuration options
 * @param {string} options.operation - Name of the operation for logging
 * @param {number} options.timeout - Timeout in milliseconds (default: 30000)
 * @param {number} options.maxRetries - Maximum retry attempts (default: 3)
 * @param {boolean} options.autoRetry - Whether to auto-retry on retryable errors (default: false)
 * @returns {Object} Loading state and control functions
 */
const useLoadingState = (options = {}) => {
  const {
    operation = 'unknown',
    timeout = 30000,
    maxRetries = 3,
    autoRetry = false
  } = options

  // State management
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)
  const [isRetrying, setIsRetrying] = useState(false)

  // Refs for cleanup and timeout management
  const timeoutRef = useRef(null)
  const retryTimeoutRef = useRef(null)
  const mountedRef = useRef(true)

  /**
   * Execute async operation with loading state management
   */
  const execute = useCallback(async (asyncOperation, context = {}) => {
    // Early return if component unmounted
    if (!mountedRef.current) return null

    // Clear any existing error
    setError(null)
    setIsLoading(true)

    // Set timeout for operation
    if (timeout > 0) {
      timeoutRef.current = setTimeout(() => {
        if (mountedRef.current) {
          const timeoutError = errorHandler.handleError(
            new Error(`Operation timed out after ${timeout}ms`),
            { operation, timeout, context }
          )
          setError(timeoutError.error)
          setIsLoading(false)
        }
      }, timeout)
    }

    try {
      logger.info(`Starting operation: ${operation}`, { context, retryCount })

      // Execute the operation
      const result = await asyncOperation()

      // Clear timeout on success
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }

      // Only update state if component is still mounted
      if (mountedRef.current) {
        setIsLoading(false)
        setRetryCount(0) // Reset retry count on success
        
        logger.info(`Operation completed successfully: ${operation}`, { 
          context, 
          duration: performance.now() 
        })
      }

      return result
    } catch (error) {
      // Clear timeout on error
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }

      // Only update state if component is still mounted
      if (!mountedRef.current) return null

      // Handle the error through our centralized handler
      const handledError = errorHandler.handleError(error, {
        operation,
        context,
        retryCount,
        maxRetries
      })

      setError(handledError.error)
      setIsLoading(false)

      // Auto-retry logic for retryable errors
      if (
        autoRetry && 
        handledError.shouldRetry && 
        retryCount < maxRetries
      ) {
        const delay = handledError.retryDelay || 1000
        
        logger.info(`Auto-retrying operation: ${operation}`, {
          retryCount: retryCount + 1,
          delay,
          error: handledError.error.message
        })

        setIsRetrying(true)
        
        retryTimeoutRef.current = setTimeout(() => {
          if (mountedRef.current) {
            setRetryCount(prev => prev + 1)
            setIsRetrying(false)
            // Recursive call for retry
            execute(asyncOperation, context)
          }
        }, delay)
      }

      // Re-throw error for caller to handle if needed
      throw handledError.error
    }
  }, [operation, timeout, maxRetries, autoRetry, retryCount])

  /**
   * Manual retry function
   */
  const retry = useCallback((asyncOperation, context = {}) => {
    if (retryCount >= maxRetries) {
      logger.warn(`Maximum retry attempts reached for operation: ${operation}`, {
        retryCount,
        maxRetries
      })
      return Promise.reject(new Error('Maximum retry attempts reached'))
    }

    setRetryCount(prev => prev + 1)
    setError(null)
    
    return execute(asyncOperation, context)
  }, [execute, retryCount, maxRetries, operation])

  /**
   * Reset loading state
   */
  const reset = useCallback(() => {
    setIsLoading(false)
    setError(null)
    setRetryCount(0)
    setIsRetrying(false)

    // Clear any pending timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current)
      retryTimeoutRef.current = null
    }
  }, [])

  /**
   * Cleanup function for component unmount
   */
  const cleanup = useCallback(() => {
    mountedRef.current = false
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current)
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return cleanup
  }, [cleanup])

  return {
    // State
    isLoading,
    error,
    isRetrying,
    retryCount,
    
    // Computed state
    canRetry: retryCount < maxRetries && error && errorHandler.shouldRetry(error),
    hasMaxRetries: retryCount >= maxRetries,
    
    // Actions
    execute,
    retry,
    reset,
    cleanup,
    
    // Helpers
    getErrorMessage: () => error ? errorHandler.getUserMessage(error) : null,
    getRetryDelay: () => error ? errorHandler.getRetryDelay(error) : 0
  }
}

export default useLoadingState
