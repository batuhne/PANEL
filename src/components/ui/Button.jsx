import { useState } from 'react'

const buildButtonVariants = () => ({
  primary: {
    base: 'bg-primary text-white border-primary',
    hover: 'hover:bg-green-700 hover:border-green-700',
    focus: 'focus:bg-green-700 focus:border-green-700',
    active: 'active:bg-green-800 active:border-green-800',
    disabled: 'disabled:bg-gray-300 disabled:border-gray-300'
  },
  secondary: {
    base: 'bg-white text-primary border-primary',
    hover: 'hover:bg-primary-10 hover:border-green-700',
    focus: 'focus:bg-primary-10 focus:border-green-700',
    active: 'active:bg-primary-50 active:border-green-800',
    disabled: 'disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-400'
  },
  danger: {
    base: 'bg-red-600 text-white border-red-600',
    hover: 'hover:bg-red-700 hover:border-red-700',
    focus: 'focus:bg-red-700 focus:border-red-700',
    active: 'active:bg-red-800 active:border-red-800',
    disabled: 'disabled:bg-red-300 disabled:border-red-300'
  },
  ghost: {
    base: 'bg-transparent text-primary border-transparent',
    hover: 'hover:bg-primary-10 hover:border-primary-10',
    focus: 'focus:bg-primary-10 focus:border-primary-10',
    active: 'active:bg-primary-50 active:border-primary-50',
    disabled: 'disabled:text-gray-400'
  }
})

const buildButtonSizes = () => ({
  sm: 'px-3 py-2 text-sm min-h-8',
  md: 'px-4 py-2.5 text-base min-h-10',
  lg: 'px-6 py-3 text-lg min-h-12'
})

const buildButtonClassName = (variant, size, loading, disabled, className) => {
  const variants = buildButtonVariants()
  const sizes = buildButtonSizes()
  
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 relative overflow-hidden disabled:cursor-not-allowed border'
  const variantClasses = Object.values(variants[variant]).join(' ')
  const sizeClasses = sizes[size]
  
  return `${baseClasses} ${variantClasses} ${sizeClasses} ${className}`
}

const Button = (buttonConfig) => {
  const {
    children,
    onClick,
    onPress,
    disabled = false,
    loading = false,
    variant = 'primary',
    size = 'md',
    className = '',
    type = 'button',
    ariaLabel,
    ariaDescribedBy,
    ...props
  } = buttonConfig

  const [isPending, setIsPending] = useState(false)
  const isDisabled = disabled || loading || isPending

  const handleButtonPress = async (event) => {
    if (isDisabled) return
    
    if (onPress && !isPending) {
      setIsPending(true)
      try {
        await onPress(event)
      } finally {
        setIsPending(false)
      }
    } else if (onClick) {
      onClick(event)
    }
  }

  const renderLoadingSpinner = () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div 
        className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
        aria-hidden="true"
      />
    </div>
  )

  const renderButtonContent = () => (
    <span className={loading || isPending ? 'opacity-0' : 'opacity-100'}>
      {children}
    </span>
  )

  return (
    <button
      type={type}
      onClick={handleButtonPress}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      className={buildButtonClassName(variant, size, loading, isDisabled, className)}
      {...props}
    >
      {(loading || isPending) && renderLoadingSpinner()}
      {renderButtonContent()}
    </button>
  )
}

export default Button
