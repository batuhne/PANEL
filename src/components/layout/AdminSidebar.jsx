import { useState } from 'react'

const AdminSidebar = ({ onSectionChange }) => {
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
      id: 'livedata',
      label: 'Live Data',
      icon: 'ri-line-chart-line',
      type: 'expandable',
      submenu: [
        { label: 'Soil Sensors', value: 'Soil Sensors' },
        { label: 'Weather Station', value: 'Weather Station' },
        { label: 'Spectral / NIR', value: 'Spectral / NIR' },
        { label: 'Channel Registry', value: 'Channel Registry' }
      ]
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
        { label: 'Backtests', value: 'Backtests' }
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
        { label: 'Policy Overrides', value: 'Policy Overrides' }
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
        { label: 'Resolved', value: 'Resolved' },
        { label: 'Silenced / Snoozed', value: 'Silenced / Snoozed' }
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
        { label: 'Usage & KPI', value: 'Usage & KPI' },
        { label: 'Exports', value: 'Exports' }
      ]
    },
    {
      id: 'modelcalibration',
      label: 'Model Calibration & Versions',
      icon: 'ri-git-branch-line',
      type: 'expandable',
      submenu: [
        { label: 'Versions', value: 'Versions' },
        { label: 'Calibration Runs', value: 'Calibration Runs' },
        { label: 'Datasets & Ground Truth', value: 'Datasets & Ground Truth' },
        { label: 'Rollback Points', value: 'Rollback Points' }
      ]
    },
    {
      id: 'modeldrift',
      label: 'Model Drift & Performance',
      icon: 'ri-line-chart-line',
      type: 'expandable',
      submenu: [
        { label: 'Feature Drift', value: 'Feature Drift' },
        { label: 'Target/Label Drift', value: 'Target/Label Drift' },
        { label: 'Performance Metrics', value: 'Performance Metrics' },
        { label: 'Monitoring Rules', value: 'Monitoring Rules' }
      ]
    },
    {
      id: 'ingestion',
      label: 'Ingestion & Data Quality',
      icon: 'ri-flow-chart',
      type: 'expandable',
      submenu: [
        { label: 'Channels', value: 'Channels' },
        { label: 'Schema & Units', value: 'Schema & Units' },
        { label: 'Data Gaps', value: 'Data Gaps' },
        { label: 'Freshness & Delay', value: 'Freshness & Delay' }
      ]
    },
    {
      id: 'pipeline',
      label: 'Pipeline',
      icon: 'ri-git-merge-line',
      type: 'expandable',
      submenu: [
        { label: 'Topology', value: 'Topology' },
        { label: 'Queues & Lag', value: 'Queues & Lag' },
        { label: 'Workers', value: 'Workers' },
        { label: 'Error Queue', value: 'Error Queue' }
      ]
    },
    {
      id: 'integrations',
      label: 'Integrations',
      icon: 'ri-plug-line',
      type: 'expandable',
      submenu: [
        { label: 'Soil Sensors Gateway', value: 'Soil Sensors Gateway' },
        { label: 'NIR Spectrometer', value: 'NIR Spectrometer' },
        { label: 'Satellite / UAV', value: 'Satellite / UAV' },
        { label: 'Phenology Camera', value: 'Phenology Camera' },
        { label: 'Webhooks', value: 'Webhooks' },
        { label: 'API Keys', value: 'API Keys' }
      ]
    },
    {
      id: 'firmware',
      label: 'Firmware & OTA / Maintenance Mode',
      icon: 'ri-download-cloud-line',
      type: 'expandable',
      submenu: [
        { label: 'Current Firmware', value: 'Current Firmware' },
        { label: 'Update History', value: 'Update History' },
        { label: 'Schedule Update', value: 'Schedule Update' },
        { label: 'Enter / Exit Maintenance', value: 'Enter / Exit Maintenance' }
      ]
    },
    {
      id: 'deviceconfig',
      label: 'Device Configuration',
      icon: 'ri-settings-3-line',
      type: 'expandable',
      submenu: [
        { label: 'Parameters', value: 'Parameters' },
        { label: 'Threshold Presets', value: 'Threshold Presets' },
        { label: 'Location & Metadata', value: 'Location & Metadata' },
        { label: 'Network', value: 'Network' }
      ]
    },
    {
      id: 'logs',
      label: 'Logs',
      icon: 'ri-file-list-line',
      type: 'expandable',
      submenu: [
        { label: 'Device / System Logs', value: 'Device / System Logs' },
        { label: 'Error Logs', value: 'Error Logs' },
        { label: 'Ingestion Logs', value: 'Ingestion Logs' }
      ]
    },
    {
      id: 'audit',
      label: 'Audit Trail',
      icon: 'ri-history-line',
      type: 'expandable',
      submenu: [
        { label: 'Security Events', value: 'Security Events' },
        { label: 'Config Changes', value: 'Config Changes' },
        { label: 'User Actions', value: 'User Actions' }
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

export default AdminSidebar
