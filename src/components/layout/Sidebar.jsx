import { useState } from 'react'

const Sidebar = ({ onSectionChange }) => {
  const [activeSection, setActiveSection] = useState('Overview')
  const [expandedMenus, setExpandedMenus] = useState({})

  const menuItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: 'ri-dashboard-line',
      type: 'single'
    },
    {
      id: 'predictions',
      label: 'Predictions',
      icon: 'ri-bar-chart-line',
      type: 'expandable',
      submenu: [
        { label: 'Yield Forecast', value: 'Yield Forecast' },
        { label: 'Quality (DM/Starch)', value: 'Quality (DM/Starch)' },
        { label: 'Harvest Window', value: 'Harvest Window' },
        { label: 'Assumptions & Confidence', value: 'Assumptions & Confidence' }
      ]
    },
    {
      id: 'recommendations',
      label: 'Recommendations',
      icon: 'ri-lightbulb-line',
      type: 'expandable',
      submenu: [
        { label: 'Irrigation Plan', value: 'Irrigation Plan' },
        { label: 'Fertilization Plan', value: 'Fertilization Plan' },
        { label: 'Harvest Plan', value: 'Harvest Plan' },
        { label: 'Task Checklist', value: 'Task Checklist' }
      ]
    },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: 'ri-alarm-warning-line',
      type: 'expandable',
      submenu: [
        { label: 'Active', value: 'Active' },
        { label: 'Acknowledged', value: 'Acknowledged' },
        { label: 'Resolved', value: 'Resolved' }
      ]
    },
    {
      id: 'livedata',
      label: 'Live Data',
      icon: 'ri-line-chart-line',
      type: 'expandable',
      submenu: [
        { label: 'Soil Sensors', value: 'Soil Sensors' },
        { label: 'Weather Station', value: 'Weather Station' },
        { label: 'Spectral / NIR', value: 'Spectral / NIR' },
        { label: 'Compare', value: 'Compare' }
      ]
    },
    {
      id: 'maps',
      label: 'Maps & Zones',
      icon: 'ri-map-line',
      type: 'expandable',
      submenu: [
        { label: 'Layers', value: 'Layers' },
        { label: 'Zones', value: 'Zones' },
        { label: 'Compare', value: 'Compare' }
      ]
    },
    {
      id: 'camera',
      label: 'Camera',
      icon: 'ri-camera-line',
      type: 'expandable',
      submenu: [
        { label: 'Live', value: 'Live' },
        { label: 'Timeline', value: 'Timeline' },
        { label: 'Gallery', value: 'Gallery' }
      ]
    },
    {
      id: 'history',
      label: 'History & Reports',
      icon: 'ri-file-chart-line',
      type: 'expandable',
      submenu: [
        { label: 'Season Summary', value: 'Season Summary' },
        { label: 'Activity Log', value: 'Activity Log' },
        { label: 'Exports', value: 'Exports' }
      ]
    }
  ]

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

  const toggleSubmenu = (menuId, e) => {
    e.stopPropagation()
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }))
  }

  const handleSubmenuClick = (sectionName) => {
    setActiveSection(sectionName)
    onSectionChange?.(sectionName)
  }

  const isActiveSection = (sectionName) => {
    return activeSection === sectionName
  }

  const isActiveParent = (menuItem) => {
    if (menuItem.type === 'single') {
      return activeSection === menuItem.label
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
                  toggleSubmenu(menuItem.id, { stopPropagation: () => {} })
                }
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <i className={`${menuItem.icon} text-lg sidebar-icon text-gray-600`}></i>
                  <span className="sidebar-text text-gray-700">{menuItem.label}</span>
                </div>
                {menuItem.type === 'expandable' && (
                  <i 
                    className={`ri-arrow-right-s-line sidebar-arrow ${
                      expandedMenus[menuItem.id] ? 'expanded' : ''
                    }`}
                    onClick={(e) => toggleSubmenu(menuItem.id, e)}
                  ></i>
                )}
              </div>
            </div>

            {/* Submenu */}
            {menuItem.type === 'expandable' && (
              <div 
                className={`sidebar-submenu ${
                  expandedMenus[menuItem.id] ? 'expanded' : ''
                }`}
              >
                {menuItem.submenu?.map((subItem) => (
                  <div
                    key={subItem.value}
                    className={`sidebar-subitem ${
                      isActiveSection(subItem.value) ? 'active' : ''
                    }`}
                    onClick={() => handleSubmenuClick(subItem.value)}
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