import { useState } from 'react'

const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue)
  
  const handleToggle = () => setValue(prev => !prev)
  const handleSetTrue = () => setValue(true)
  const handleSetFalse = () => setValue(false)
  
  return { 
    value, 
    toggle: handleToggle, // Keep backward compatibility
    handleToggle,
    setTrue: handleSetTrue, // Keep backward compatibility  
    handleSetTrue,
    setFalse: handleSetFalse, // Keep backward compatibility
    handleSetFalse
  }
}

export default useToggle
