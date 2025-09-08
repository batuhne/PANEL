// Layout component - removing unused useState import
import Header from './Header'
import Sidebar from './Sidebar'
import useToggle from '../../hooks/useToggle'

const Layout = ({ 
  children, 
  title,
  showSidebar = true,
  showProfileMenu = true,
  menuItems = [],
  activeSection = '',
  onSectionChange = () => {}
}) => {
  const { value: sidebarOpen, toggle: toggleSidebar, setFalse: closeSidebar } = useToggle(false)
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header 
        title={title}
        showProfileMenu={showProfileMenu}
      />
      
      <div className="flex pt-16">
        {/* Sidebar */}
        {showSidebar && (
          <>
            {/* Mobile menu button */}
            <button 
              className="md:hidden fixed top-20 left-4 z-30 p-2 bg-white rounded-lg shadow-md border border-gray-200"
              onClick={toggleSidebar}
              aria-label="Toggle menu"
            >
              <i className="ri-menu-line text-xl text-gray-600"></i>
            </button>
            
            <Sidebar
              menuItems={menuItems}
              activeSection={activeSection}
              onSectionChange={onSectionChange}
              isOpen={sidebarOpen}
              onClose={closeSidebar}
            />
          </>
        )}
        
        {/* Main Content */}
        <main className={`
          flex-1 
          ${showSidebar ? 'md:ml-64' : ''}
          transition-all duration-300
        `}>
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout
