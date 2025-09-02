import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const DeviceSelection = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [loadingDevice, setLoadingDevice] = useState(null)

  // Get user type from localStorage (set during login)
  const loggedInUserType = localStorage.getItem('userType') || 'user'
  
  const devices = [
    {
      id: 'poland-1',
      name: 'Poland-1'
    },
    {
      id: 'poland-2', 
      name: 'Poland-2'
    },
    {
      id: 'turkey-1',
      name: 'Türkiye'
    }
  ]

  const handleDeviceClick = async (device) => {
    if (isLoading) return
    
    setIsLoading(true)
    setLoadingDevice(device.id)
    
    try {
      // Simulate device connection check
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Navigate based on logged in user type (not device type)
      if (loggedInUserType === 'admin') {
        navigate('/dashboard/admin')
      } else {
        navigate('/dashboard/user')
      }
    } catch (error) {
      console.error('Device connection failed:', error)
      alert('Failed to connect to device. Please try again.')
    } finally {
      setIsLoading(false)
      setLoadingDevice(null)
    }
  }

  const handleLogout = () => {
    console.log('Logging out...')
    // Clear stored user type and any auth data
    localStorage.removeItem('userType')
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-normal text-primary mb-6">POTANTIAL</h1>
          <p className="text-gray-600 text-sm">Select Device</p>
        </div>

        {/* Device Cards */}
        <div className="space-y-4">
          {devices.map((device) => (
            <div 
              key={device.id}
              className="device-card bg-white rounded-2xl shadow-lg p-6 border-2 border-transparent cursor-pointer"
              onClick={() => handleDeviceClick(device)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    {loadingDevice === device.id ? (
                      <i className="ri-loader-4-line animate-spin text-primary text-xl"></i>
                    ) : (
                      <i className="ri-wireless-charging-line text-primary text-xl"></i>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{device.name}</h3>
                  </div>
                </div>
                <i className="ri-arrow-right-line text-gray-400 text-xl arrow-icon"></i>
              </div>
            </div>
          ))}
        </div>

        {/* Logout Button */}
        <div className="mt-8 text-center">
          <button 
            onClick={handleLogout}
            className="text-gray-500 hover:text-primary text-sm font-medium transition-colors duration-200"
            disabled={isLoading}
          >
            <i className="ri-logout-circle-line mr-2"></i>Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeviceSelection
