import { useState } from 'react'
import { createUserMenuItems } from '../../data/menuConfig'

const Sidebar = ({ onSectionChange }) => {
  const [activeSection, setActiveSection] = useState('Overview')
  const [expandedMenus, setExpandedMenus] = useState({})

  const menuItems = createUserMenuItems()

  const handleSectionClick = (sectionName, menuId = null) => {
    setActiveSection(sectionName)
    onSectionChange?.(sectionName)
    
    // If it's a single item, don't expand
    if (menuId) {
      const menuItem = menuItems.find(item => item.id === menuId)
      if (menuItem?.type === 'single') {
        return
      }
    }
  }

  const handleSubmenuToggle = (menuId, e) => {
    e.stopPropagation()
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }))
  }

  const isActiveParent = (menuItem) => {
    if (activeSection === menuItem.label) {
      return true
    }
    return menuItem.submenu?.some(sub => activeSection === sub.value)
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-200 fixed left-0 top-16 bottom-0 overflow-y-auto">
      <nav className="p-4 space-y-1">
        {menuItems.map((menuItem) => (
          <div key={menuItem.id}>
            {/* Main Menu Item */}
            <div 
              className={`sidebar-item p-3 cursor-pointer ${
                isActiveParent(menuItem) ? 'active' : ''
              } ${menuItem.type === 'expandable' ? 'expandable' : ''}`}
              onClick={() => {
                if (menuItem.type === 'single') {
                  handleSectionClick(menuItem.label, menuItem.id)
                } else {
                  handleSubmenuToggle(menuItem.id, { stopPropagation: () => {} })
                }
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <i className={`${menuItem.icon} text-lg sidebar-icon text-gray-600`}></i>
                  <span className="sidebar-text text-gray-700">{menuItem.label}</span>
                </div>
                {menuItem.type === 'expandable' && (
                  <i className={`ri-arrow-right-s-line sidebar-arrow ${
                    expandedMenus[menuItem.id] ? 'expanded' : ''
                  }`}></i>
                )}
              </div>
            </div>

            {/* Submenu */}
            {menuItem.type === 'expandable' && (
              <div className={`sidebar-submenu ${expandedMenus[menuItem.id] ? 'expanded' : ''}`}>
                {menuItem.submenu.map((subItem) => (
                  <div
                    key={subItem.value}
                    className={`sidebar-subitem ${
                      activeSection === subItem.value ? 'active' : ''
                    }`}
                    onClick={() => handleSectionClick(subItem.value)}
                  >
                    {subItem.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar