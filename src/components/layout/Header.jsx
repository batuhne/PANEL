import { useState, useEffect } from 'react'
import logger from '../../utils/logger'

const Header = ({ currentSection = 'Overview', isAdmin = false }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  const handleProfileMenuToggle = () => {
    setShowProfileMenu(!showProfileMenu)
  }

  const handleSignOut = () => {
    // Clear any stored user data (if any exists in localStorage/sessionStorage)
    localStorage.clear()
    sessionStorage.clear()
    
    // Navigate to login page
    window.location.href = '/login'
    
    logger.info('User signed out successfully', { 
      userType: isAdmin ? 'admin' : 'user',
      action: 'sign_out'
    })
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.relative')) {
        setShowProfileMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 fixed top-0 left-0 right-0 z-50">
      {/* Left side - Logo and current section */}
      <div className="flex items-center space-x-6">
        <h1 className="text-xl font-normal text-primary">POTENTIAL</h1>
        <div className="text-gray-400">|</div>
        <span className="text-gray-700 font-medium">{currentSection}</span>
      </div>
      
      {/* Right side - Notifications and Profile */}
      <div className="flex items-center space-x-4">
        {/* Notifications - Non-functional */}
        <div className="relative">
          <div className="relative p-2 text-primary transition-colors duration-200">
            <i className="ri-notification-line text-xl"></i>
          </div>
        </div>
        
        {/* Profile */}
        <div className="relative">
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">
                {isAdmin ? 'Admin Name' : 'User Name'}
              </div>
              {isAdmin && (
                <div className="text-xs text-gray-500">System Administrator</div>
              )}
            </div>
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <i className="ri-user-line text-primary"></i>
            </div>
            <button 
              onClick={handleProfileMenuToggle}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <i className="ri-more-2-line"></i>
            </button>
          </div>
          
          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                <i className="ri-user-line mr-2"></i>
                Profile Settings
              </a>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                <i className="ri-settings-line mr-2"></i>
                Preferences
              </a>
              <div className="border-t border-gray-100 my-1"></div>
              <button 
                onClick={handleSignOut}
                className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <i className="ri-logout-circle-line mr-2"></i>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header