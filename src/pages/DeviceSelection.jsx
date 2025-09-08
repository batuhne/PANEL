import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logger from '../utils/logger'
// DeviceSelection component - removing unused handleDeviceError import
import useLoadingState from '../hooks/useLoadingState'

const DeviceSelection = () => {
  const navigate = useNavigate()
  const [loadingDevice, setLoadingDevice] = useState(null)
  
  // loading state management  
  const {
    isLoading,
    error: deviceError,
    execute: executeDeviceConnection,
    reset: resetError
  } = useLoadingState({
    operation: 'device_connection',
    timeout: 5000, // 5 second timeout for device connection
    maxRetries: 3,
    autoRetry: true // Auto-retry for device connections
  })

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
    
    setLoadingDevice(device.id)
    resetError() // Clear any previous errors
    
    try {
      await executeDeviceConnection(async () => {
        logger.info('Device connection attempt initiated', {
          deviceId: device.id,
          deviceName: device.name,
          userType: loggedInUserType,
          action: 'device_connection_attempt'
        })
        
        // Simulate device connection check
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            // Simulate occasional connection failures for demonstration
            const connectionSuccess = Math.random() > 0.2 // 80% success rate
            
            if (!connectionSuccess) {
              reject(new Error(`Connection to ${device.name} failed - device may be offline`))
              return
            }

            logger.info('Device connection successful', {
              deviceId: device.id,
              deviceName: device.name,
              userType: loggedInUserType,
              action: 'device_connection_success'
            })
            
            resolve({ deviceId: device.id, deviceName: device.name })
          }, 1500)
        })
      }, {
        deviceId: device.id,
        deviceName: device.name,
        userType: loggedInUserType
      })
      
      // Navigate based on logged in user type (not device type)
      if (loggedInUserType === 'admin') {
        navigate('/dashboard/admin')
      } else {
        navigate('/dashboard/user')
      }
      
    } catch (error) {
      // Error is already handled by useLoadingState and errorHandler
      logger.warn('Device connection failed', {
        deviceId: device.id,
        deviceName: device.name,
        errorType: error.name,
        action: 'device_connection_failed'
      })
    } finally {
      setLoadingDevice(null)
    }
  }

  const handleLogout = () => {
    logger.info('User logout initiated', { 
      action: 'logout_request',
      currentPage: 'device_selection'
    })
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

        {/* Error Message */}
        {deviceError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <i className="ri-error-warning-line text-red-600 mr-3 mt-0.5" aria-hidden="true" />
              <div className="flex-1">
                <p className="text-sm text-red-700 mb-2" role="alert">
                  {deviceError.message || 'Device connection failed'}
                </p>
                <button
                  onClick={resetError}
                  className="text-xs text-red-600 hover:text-red-800 underline"
                  type="button"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Device Cards */}
        <div className="space-y-4">
          {devices.map((device) => (
            <div 
              key={device.id}
              role="button"
              tabIndex={0}
              aria-label={`Select ${device.name} device (${device.signal} signal)`}
              className="device-card bg-white rounded-2xl shadow-lg p-6 border-2 border-transparent cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
              onClick={() => handleDeviceClick(device)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleDeviceClick(device)
                }
              }}
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
