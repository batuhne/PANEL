import { useState } from 'react'

const Checkbox = ({
  checked = false,
  onChange,
  label,
  disabled = false,
  className = '',
  ...props
}) => {
  const [isChecked, setIsChecked] = useState(checked)
  
  const handleChange = (e) => {
    const newChecked = e.target.checked
    setIsChecked(newChecked)
    if (onChange) {
      onChange(newChecked)
    }
  }
  
  return (
    <label className={`flex items-center cursor-pointer ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleChange}
          disabled={disabled}
          className="sr-only"
          {...props}
        />
        <div 
          className={`
            w-5 h-5 
            border-2 
            rounded 
            flex items-center justify-center
            transition-all duration-200
            ${isChecked 
              ? 'bg-primary border-primary' 
              : 'border-gray-300 hover:border-gray-400'
            }
            ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          {isChecked && (
            <i className="ri-check-line text-white text-xs"></i>
          )}
        </div>
      </div>
      
      {label && (
        <span className={`ml-3 text-sm ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>
          {label}
        </span>
      )}
    </label>
  )
}

export default Checkbox
