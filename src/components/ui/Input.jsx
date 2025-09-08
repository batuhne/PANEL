import { useState } from 'react'

const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  icon,
  showPasswordToggle = false,
  className = '',
  required = false,
  id,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [focused, setFocused] = useState(false)
  
  // Generate unique IDs for accessibility
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
  const errorId = error ? `${inputId}-error` : undefined
  
  const actualType = showPasswordToggle && isPasswordVisible ? 'text' : type
  
  const handlePasswordToggle = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }
  
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i className={`${icon} text-gray-400 text-sm`}></i>
          </div>
        )}
        
        <input
          id={inputId}
          type={actualType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={errorId}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`
            w-full
            ${icon ? 'pl-10' : 'pl-4'}
            ${showPasswordToggle ? 'pr-12' : 'pr-4'}
            py-3
            border border-gray-300
            rounded-lg
            text-sm
            transition-all duration-200
            ${focused || value ? 'border-primary ring-2 ring-primary/20' : 'hover:border-gray-400'}
            ${error ? 'border-red-500 ring-2 ring-red-500/20' : ''}
            focus:outline-none
            focus:border-primary
            focus:ring-2
            focus:ring-primary/20
            disabled:bg-gray-50
            disabled:text-gray-500
            disabled:cursor-not-allowed
          `}
          {...props}
        />
        
        {showPasswordToggle && (
          <button
            type="button"
            onClick={handlePasswordToggle}
            aria-label={`${isPasswordVisible ? 'Hide' : 'Show'} password`}
            aria-pressed={isPasswordVisible}
            className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-md"
            tabIndex={0}
          >
            <i 
              className={`${
                isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'
              } text-gray-400 hover:text-primary transition-colors text-sm`}
              aria-hidden="true"
            ></i>
          </button>
        )}
      </div>
      
      {error && (
        <p id={errorId} role="alert" className="text-sm text-red-600 flex items-center">
          <i className="ri-error-warning-line mr-1" aria-hidden="true"></i>
          {error}
        </p>
      )}
    </div>
  )
}

export default Input
