import { useNavigate } from 'react-router-dom'
import logger from '../utils/logger'
import useLoadingState from '../hooks/useLoadingState'
import useFormValidation from '../hooks/useFormValidation'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Checkbox from '../components/ui/Checkbox'
import { ValidationError } from '../utils/validation-errors'

const createValidationRules = () => ({
  email: (value) => {
    if (!value || value.trim() === '') {
      throw new ValidationError('email', 'Email is required')
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      throw new ValidationError('email', 'Please enter a valid email address')
    }
    return true
  },
  password: (value) => {
    if (!value || value.trim() === '') {
      throw new ValidationError('password', 'Password is required')
    }
    return true
  }
})

const simulateAuthenticationRequest = async (credentials) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const validEmails = ['admin@potential.com', 'user@potential.com']
      
      if (!validEmails.includes(credentials.email)) {
        reject(new Error('Invalid email or password'))
        return
      }

      const userType = credentials.email === 'admin@potential.com' ? 'admin' : 'user'
      resolve({ userType })
    }, 2000)
  })
}

const Login = () => {
  const navigate = useNavigate()
  
  const {
    values,
    errors,
    isSubmitting,
    updateFieldValue,
    handleFormSubmit
  } = useFormValidation({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false
    },
    validationRules: createValidationRules(),
    onSubmit: async (formData) => {
      logger.info('Login attempt initiated', { 
        email: formData.email,
        action: 'login_attempt',
        userAgent: navigator.userAgent.substring(0, 50)
      })
      
      const result = await simulateAuthenticationRequest(formData)
      
      localStorage.setItem('userType', result.userType)
      
      logger.info('Login successful', { 
        email: formData.email,
        userType: result.userType,
        action: 'login_success'
      })
      
      navigate('/devices')
    }
  })

  // Keep legacy error handling for compatibility
  const {
    error: authError
  } = useLoadingState({
    operation: 'user_login',
    timeout: 10000,
    maxRetries: 2,
    autoRetry: false
  })
  
  const handleRememberMeChange = (checked) => {
    updateFieldValue('rememberMe', checked)
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

          <form className="space-y-6" onSubmit={handleFormSubmit}>
            {/* Error Messages */}
            {(errors.general || authError) && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center">
                  <i className="ri-error-warning-line text-red-600 mr-2" aria-hidden="true" />
                  <p className="text-sm text-red-700" role="alert">
                    {errors.general || authError?.message || 'An error occurred during login'}
                  </p>
                </div>
              </div>
            )}

            {/* Email Input */}
            <Input
              label="Email Address"
              type="email"
              value={values.email}
              onChange={(e) => updateFieldValue('email', e.target.value)}
              placeholder="Enter your email address"
              error={errors.email}
              icon="ri-mail-line"
              required
              ariaLabel="Email address input"
            />

            {/* Password Input */}
            <Input
              label="Password"
              type="password"
              value={values.password}
              onChange={(e) => updateFieldValue('password', e.target.value)}
              placeholder="Enter your password"
              error={errors.password}
              icon="ri-lock-line"
              showPasswordToggle
              required
              ariaLabel="Password input"
            />

            {/* Remember Me Checkbox */}
            <div className="flex items-center">
              <Checkbox
                id="remember"
                checked={values.rememberMe}
                onChange={handleRememberMeChange}
                label="Remember me"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
              className="w-full"
              ariaLabel="Sign in to platform"
            >
              {isSubmitting ? 'Signing In...' : 'Sign In to Platform'}
            </Button>
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