import { Component } from 'react'
import logger from '../utils/logger'
import Button from './ui/Button'

/**
 * ErrorBoundary Component
 * Catches JavaScript errors anywhere in the child component tree
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      isRetrying: false
    }
  }

  /**
   * Static method to update state when an error occurs
   * This method is called during the render phase
   */
  static getDerivedStateFromError(error) {
    return { 
      hasError: true,
      error 
    }
  }

  /**
   * Lifecycle method called when an error has been thrown
   * Used for error reporting and logging
   */
  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    })
    
    // Log error with structured context
    logger.error('React Error Boundary caught an error', {
      error: error.message,
      componentStack: errorInfo.componentStack,
      errorBoundary: this.constructor.name,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    })

    // Here you would typically report to error monitoring service
    // Example: Sentry.captureException(error, { contexts: { react: errorInfo } })
  }

  /**
   * Handles the retry action when user clicks retry button
   * Resets error state to allow re-rendering
   */
  handleRetry = () => {
    this.setState({ isRetrying: true })
    
    // Give visual feedback before retrying
    setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        isRetrying: false
      })
    }, 300)
  }

  /**
   * Handles page refresh action
   * Uses window.location.reload() for full page refresh
   */
  handleRefresh = () => {
    window.location.reload()
  }

  /**
   * Renders the error UI when an error has been caught
   * Provides user-friendly error message with recovery options
   */
  renderErrorUI() {
    const { error, errorInfo, isRetrying } = this.state
    const { fallback: CustomFallback } = this.props

    // If custom fallback provided, use it
    if (CustomFallback) {
      return <CustomFallback error={error} onRetry={this.handleRetry} />
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          {/* Error Icon */}
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i 
              className="ri-error-warning-line text-2xl text-red-600" 
              aria-hidden="true"
            />
          </div>

          {/* Error Title */}
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Something went wrong
          </h2>

          {/* Error Description */}
          <p className="text-gray-600 mb-6">
            We encountered an unexpected error. Our team has been notified and 
            is working to fix the issue. Please try refreshing the page or contact 
            support if the problem persists.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={this.handleRetry}
              disabled={isRetrying}
              className="w-full"
              variant="primary"
            >
              {isRetrying ? (
                <>
                  <i className="ri-loader-4-line animate-spin mr-2" aria-hidden="true" />
                  Retrying...
                </>
              ) : (
                'Try Again'
              )}
            </Button>

            <Button 
              onClick={this.handleRefresh}
              variant="secondary"
              className="w-full"
            >
              <i className="ri-refresh-line mr-2" aria-hidden="true" />
              Refresh Page
            </Button>
          </div>

          {/* Error Details (Development Only) */}
          {process.env.NODE_ENV === 'development' && error && (
            <details className="mt-6 text-left">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                <i className="ri-code-line mr-1" aria-hidden="true" />
                Error Details (Development Mode)
              </summary>
              <div className="mt-3 p-3 bg-gray-50 rounded border">
                <pre className="text-xs text-gray-700 whitespace-pre-wrap overflow-auto max-h-32">
                  <strong>Error:</strong> {error.toString()}
                  {errorInfo && (
                    <>
                      {'\n\n'}
                      <strong>Component Stack:</strong>
                      {errorInfo.componentStack}
                    </>
                  )}
                </pre>
              </div>
            </details>
          )}

          {/* Support Information */}
          <div className="mt-6 p-3 bg-blue-50 rounded border border-blue-200">
            <p className="text-xs text-blue-700">
              <i className="ri-information-line mr-1" aria-hidden="true" />
              If this error persists, please contact support with error code: 
              <code className="ml-1 font-mono">
                {Date.now().toString(36).toUpperCase()}
              </code>
            </p>
          </div>
        </div>
      </div>
    )
  }

  render() {
    if (this.state.hasError) {
      return this.renderErrorUI()
    }

    return this.props.children
  }
}

export default ErrorBoundary
