import { useState, useId } from 'react'

const createInputId = (providedId) => {
  return providedId || `input-${crypto.randomUUID().substring(0, 8)}`
}

const determineInputType = (baseType, showPasswordToggle, isPasswordVisible) => {
  if (showPasswordToggle && isPasswordVisible) return 'text'
  return baseType
}

const Input = (inputConfig) => {
  const {
    label,
    type = 'text',
    value,
    onChange,
    placeholder,
    error,
    helperText,
    icon,
    showPasswordToggle = false,
    className = '',
    required = false,
    disabled = false,
    id,
    ariaLabel,
    ...props
  } = inputConfig

  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  
  const fallbackId = useId()
  const inputId = createInputId(id || fallbackId)
  const errorId = error ? `${inputId}-error` : undefined
  const helperId = helperText ? `${inputId}-helper` : undefined
  
  const actualType = determineInputType(type, showPasswordToggle, isPasswordVisible)
  
  const handlePasswordVisibilityToggle = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }

  const handleInputFocus = () => {
    setIsFocused(true)
  }

  const handleInputBlur = () => {
    setIsFocused(false)
  }
  
  const buildAriaDescribedBy = () => {
    const describedBy = [errorId, helperId].filter(Boolean)
    return describedBy.length > 0 ? describedBy.join(' ') : undefined
  }

  const buildInputClassName = () => {
    const baseClasses = 'w-full py-3 border rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2'
    const paddingClasses = `${icon ? 'pl-10' : 'pl-4'} ${showPasswordToggle ? 'pr-12' : 'pr-4'}`
    const stateClasses = isFocused || value 
      ? 'border-primary ring-primary/20' 
      : 'border-gray-300 hover:border-gray-400'
    const errorClasses = error 
      ? 'border-red-500 ring-red-500/20 focus:border-red-500 focus:ring-red-500/20' 
      : 'focus:border-primary focus:ring-primary/20'
    const disabledClasses = 'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed'
    
    return `${baseClasses} ${paddingClasses} ${stateClasses} ${errorClasses} ${disabledClasses}`
  }

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-label="required">*</span>
          )}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i className={`${icon} text-gray-400 text-sm`} aria-hidden="true"></i>
          </div>
        )}
        
        <input
          id={inputId}
          type={actualType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          aria-label={ariaLabel}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={buildAriaDescribedBy()}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          className={buildInputClassName()}
          {...props}
        />
        
        {showPasswordToggle && (
          <button
            type="button"
            onClick={handlePasswordVisibilityToggle}
            aria-label={`${isPasswordVisible ? 'Hide' : 'Show'} password`}
            aria-pressed={isPasswordVisible}
            disabled={disabled}
            className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-md disabled:cursor-not-allowed disabled:opacity-50"
            tabIndex={disabled ? -1 : 0}
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
        <div id={errorId} role="alert" className="text-sm text-red-600 flex items-center">
          <i className="ri-error-warning-line mr-1" aria-hidden="true"></i>
          {error}
        </div>
      )}
      
      {helperText && !error && (
        <div id={helperId} className="text-sm text-gray-600">
          {helperText}
        </div>
      )}
    </div>
  )
}

export default Input
