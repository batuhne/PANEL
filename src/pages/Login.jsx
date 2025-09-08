import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logger from '../utils/logger'
import { handleValidationError } from '../utils/errorHandler'
import useLoadingState from '../hooks/useLoadingState'

const Login = () => {
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [validationError, setValidationError] = useState(null)
  
  // loading state management
  const {
    isLoading,
    error: authError,
    execute: executeLogin
  } = useLoadingState({
    operation: 'user_login',
    timeout: 10000, // 10 second timeout
    maxRetries: 2,
    autoRetry: false // Manual retry for login
  })
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Clear previous errors
    setValidationError(null)
    
    // Validate form inputs
    if (!formData.email || !formData.password) {
      const validationResult = handleValidationError(
        'email_password', 
        'Email and password are required',
        { email: formData.email, password: !!formData.password }
      )
      setValidationError(validationResult.error)
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      const validationResult = handleValidationError(
        'email',
        'Please enter a valid email address',
        formData.email
      )
      setValidationError(validationResult.error)
      return
    }
    
    try {
      await executeLogin(async () => {
        logger.info('Login attempt initiated', { 
          email: formData.email,
          action: 'login_attempt',
          userAgent: navigator.userAgent.substring(0, 50)
        })
        
        // Simulate API call with user type detection
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            // Simulate authentication logic
            const validEmails = ['admin@potential.com', 'user@potential.com']
            
            if (!validEmails.includes(formData.email)) {
              reject(new Error('Invalid email or password'))
              return
            }

            // Determine user type based on login credentials
            const userType = formData.email === 'admin@potential.com' ? 'admin' : 'user'
            
            // Store user type in localStorage for DeviceSelection to use
            localStorage.setItem('userType', userType)
            
            logger.info('Login successful', { 
              email: formData.email,
              userType,
              action: 'login_success'
            })
            
            resolve({ userType })
          }, 2000)
        })
      }, {
        email: formData.email,
        rememberMe,
        loginAttempt: true
      })
      
      // Navigate to device selection on successful login
      navigate('/devices')
      
    } catch (error) {
      // Error is already handled by useLoadingState and errorHandler
      logger.warn('Login failed', {
        email: formData.email,
        errorType: error.name,
        action: 'login_failed'
      })
    }
  }
  
  const handlePasswordToggle = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-normal text-primary mb-2">
              POTANTIAL
            </h1>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Error Messages */}
            {(validationError || authError) && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center">
                  <i className="ri-error-warning-line text-red-600 mr-2" aria-hidden="true" />
                  <p className="text-sm text-red-700" role="alert">
                    {validationError?.message || authError?.message || 'An error occurred during login'}
                  </p>
                </div>
              </div>
            )}

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <i className="ri-mail-line text-gray-400 text-sm"></i>
                  </div>
                </div>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  placeholder="Enter your email address"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm input-focus transition-all duration-200"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <i className="ri-lock-line text-gray-400 text-sm"></i>
                  </div>
                </div>
                <input 
                  type={isPasswordVisible ? "text" : "password"}
                  id="password" 
                  name="password" 
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg text-sm input-focus transition-all duration-200"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button 
                    type="button"
                    aria-label={`${isPasswordVisible ? 'Hide' : 'Show'} password`}
                    aria-pressed={isPasswordVisible}
                    className="w-5 h-5 flex items-center justify-center password-toggle focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-md" 
                    onClick={handlePasswordToggle}
                  >
                    <i className={`${isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'} text-gray-400 text-sm`} aria-hidden="true"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="remember" 
                name="remember" 
                className="checkbox-custom"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember" className="ml-3 text-sm text-gray-700 cursor-pointer">
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="w-full bg-primary hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="ri-loader-4-line animate-spin mr-2"></i>
                  Signing In...
                </>
              ) : (
                'Sign In to Platform'
              )}
            </button>
          </form>
          
          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700 font-medium mb-2">Demo Credentials:</p>
            <div className="space-y-1 text-xs text-blue-600">
              <div><strong>Admin:</strong> admin@potential.com / admin123</div>
              <div><strong>User:</strong> user@potential.com / user123</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login