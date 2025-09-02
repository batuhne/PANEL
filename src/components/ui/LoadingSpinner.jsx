const LoadingSpinner = ({ 
  size = 'md', 
  color = 'text-primary',
  className = ''
}) => {
  const sizes = {
    sm: 'text-sm',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  }
  
  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <i 
        className={`ri-loader-4-line animate-spin ${sizes[size]} ${color}`}
        aria-hidden="true"
      ></i>
    </div>
  )
}

export default LoadingSpinner
