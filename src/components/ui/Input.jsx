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
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [focused, setFocused] = useState(false)
  
  const actualType = showPasswordToggle && isPasswordVisible ? 'text' : type
  
  const handlePasswordToggle = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }
  
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i className={`${icon} text-gray-400 text-sm`}></i>
          </div>
        )}
        
        <input
          type={actualType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
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
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            tabIndex={-1}
          >
            <i 
              className={`${
                isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'
              } text-gray-400 hover:text-primary transition-colors text-sm`}
            ></i>
          </button>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-600 flex items-center">
          <i className="ri-error-warning-line mr-1"></i>
          {error}
        </p>
      )}
    </div>
  )
}

export default Input
