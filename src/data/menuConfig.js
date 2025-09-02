/**
 * Menu Configuration for Sidebar Components
 */

// Base menu items shared by both user and admin dashboards
const baseMenuItems = [
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
      { label: 'Spectral / NIR', value: 'Spectral / NIR' }
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
    id: 'maps',
    label: 'Maps & Zones',
    icon: 'ri-map-pin-line',
    type: 'expandable',
    submenu: [
      { label: 'Field Maps', value: 'Field Maps' },
      { label: 'Zone Management', value: 'Zone Management' },
      { label: 'Boundary Setting', value: 'Boundary Setting' },
      { label: 'Overlay Data', value: 'Overlay Data' }
    ]
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: 'ri-file-text-line',
    type: 'expandable',
    submenu: [
      { label: 'Summary Reports', value: 'Summary Reports' },
      { label: 'Detailed Analytics', value: 'Detailed Analytics' },
      { label: 'Export Data', value: 'Export Data' },
      { label: 'Scheduled Reports', value: 'Scheduled Reports' }
    ]
  }
]

// Admin-specific menu items (extends base functionality)
const adminSpecificMenuItems = [
  {
    id: 'users',
    label: 'User Management',
    icon: 'ri-user-settings-line',
    type: 'expandable',
    submenu: [
      { label: 'User Accounts', value: 'User Accounts' },
      { label: 'Roles & Permissions', value: 'Roles & Permissions' },
      { label: 'Access Control', value: 'Access Control' },
      { label: 'Activity Logs', value: 'Activity Logs' }
    ]
  },
  {
    id: 'devices',
    label: 'Device Management',
    icon: 'ri-cpu-line',
    type: 'expandable',
    submenu: [
      { label: 'Device Registry', value: 'Device Registry' },
      { label: 'Connectivity Status', value: 'Connectivity Status' },
      { label: 'Firmware Updates', value: 'Firmware Updates' },
      { label: 'Diagnostics', value: 'Diagnostics' }
    ]
  },
  {
    id: 'farms',
    label: 'Farm Management',
    icon: 'ri-plant-line',
    type: 'expandable',
    submenu: [
      { label: 'Farm Registry', value: 'Farm Registry' },
      { label: 'Field Assignments', value: 'Field Assignments' },
      { label: 'Crop Planning', value: 'Crop Planning' },
      { label: 'Operations Schedule', value: 'Operations Schedule' }
    ]
  },
  {
    id: 'system',
    label: 'System Settings',
    icon: 'ri-settings-3-line',
    type: 'expandable',
    submenu: [
      { label: 'Global Configuration', value: 'Global Configuration' },
      { label: 'API Management', value: 'API Management' },
      { label: 'Backup & Recovery', value: 'Backup & Recovery' },
      { label: 'System Health', value: 'System Health' }
    ]
  },
  {
    id: 'analytics',
    label: 'Advanced Analytics',
    icon: 'ri-bar-chart-box-line',
    type: 'expandable',
    submenu: [
      { label: 'Performance Metrics', value: 'Performance Metrics' },
      { label: 'Usage Statistics', value: 'Usage Statistics' },
      { label: 'Trend Analysis', value: 'Trend Analysis' },
      { label: 'Custom Dashboards', value: 'Custom Dashboards' }
    ]
  },
  {
    id: 'integrations',
    label: 'Integrations',
    icon: 'ri-links-line',
    type: 'expandable',
    submenu: [
      { label: 'Third-party APIs', value: 'Third-party APIs' },
      { label: 'Data Connectors', value: 'Data Connectors' },
      { label: 'Webhook Management', value: 'Webhook Management' },
      { label: 'Integration Logs', value: 'Integration Logs' }
    ]
  },
  {
    id: 'security',
    label: 'Security & Compliance',
    icon: 'ri-shield-check-line',
    type: 'expandable',
    submenu: [
      { label: 'Security Policies', value: 'Security Policies' },
      { label: 'Audit Trails', value: 'Audit Trails' },
      { label: 'Compliance Reports', value: 'Compliance Reports' },
      { label: 'Threat Detection', value: 'Threat Detection' }
    ]
  },
  {
    id: 'support',
    label: 'Support & Maintenance',
    icon: 'ri-customer-service-line',
    type: 'expandable',
    submenu: [
      { label: 'Support Tickets', value: 'Support Tickets' },
      { label: 'Knowledge Base', value: 'Knowledge Base' },
      { label: 'System Maintenance', value: 'System Maintenance' },
      { label: 'Documentation', value: 'Documentation' }
    ]
  },
  {
    id: 'billing',
    label: 'Billing & Subscriptions',
    icon: 'ri-bill-line',
    type: 'expandable',
    submenu: [
      { label: 'Subscription Management', value: 'Subscription Management' },
      { label: 'Usage Billing', value: 'Usage Billing' },
      { label: 'Payment History', value: 'Payment History' },
      { label: 'Invoicing', value: 'Invoicing' }
    ]
  }
]

// User-specific enhancements to base menu (minimal differences)
const userSpecificEnhancements = {
  livedata: {
    submenu: [
      ...baseMenuItems.find(item => item.id === 'livedata').submenu,
      { label: 'Compare', value: 'Compare' }
    ]
  },
  predictions: {
    submenu: [
      ...baseMenuItems.find(item => item.id === 'predictions').submenu.filter(item => 
        item.value !== 'Assumptions & Confidence'
      ),
      { label: 'Backtests', value: 'Backtests' }
    ]
  },
  recommendations: {
    submenu: [
      ...baseMenuItems.find(item => item.id === 'recommendations').submenu.filter(item =>
        item.value !== 'Task Checklist'
      ),
      { label: 'Policy Overrides', value: 'Policy Overrides' }
    ]
  },
  alerts: {
    submenu: [
      ...baseMenuItems.find(item => item.id === 'alerts').submenu,
      { label: 'Silenced / Snoozed', value: 'Silenced / Snoozed' }
    ]
  }
}

/**
 * Generate user dashboard menu items
 * @returns {Array} Menu items for regular users
 */
export const createUserMenuItems = () => {
  return baseMenuItems.map(item => {
    const enhancement = userSpecificEnhancements[item.id]
    if (enhancement) {
      return { ...item, ...enhancement }
    }
    return item
  })
}

/**
 * Generate admin dashboard menu items
 * @returns {Array} Menu items for admin users
 */
export const createAdminMenuItems = () => {
  // Admin gets enhanced base items first
  const enhancedBaseItems = baseMenuItems.map(item => {
    const enhancement = userSpecificEnhancements[item.id]
    if (enhancement) {
      return { ...item, ...enhancement }
    }
    return item
  })
  
  // Then add admin-specific items
  return [...enhancedBaseItems, ...adminSpecificMenuItems]
}

export default {
  createUserMenuItems,
  createAdminMenuItems
}
