const Button = ({ 
  children, 
  onClick, 
  disabled = false, 
  variant = 'primary', 
  size = 'md',
  className = '',
  type = 'button',
  ...props 
}) => {
  const baseClasses = 'font-medium transition-colors duration-200 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed rounded-button'
  
  const variants = {
    primary: 'bg-primary hover:bg-green-700 text-white',
    secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
    ghost: 'text-gray-600 hover:text-primary hover:bg-primary/5'
  }
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3',
    lg: 'px-6 py-4 text-lg'
  }
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
