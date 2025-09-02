import { useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'

const DashboardLayout = ({ children }) => {
  const [currentSection, setCurrentSection] = useState('Overview')

  const handleSectionChange = (sectionName) => {
    setCurrentSection(sectionName)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentSection={currentSection} />
      
      {/* Main Layout */}
      <div className="flex pt-16">
        <Sidebar onSectionChange={handleSectionChange} />
        
        {/* Main Content Area */}
        <main className="flex-1 ml-64 p-6">
          {children || (
            <div className="bg-white rounded-2xl shadow-lg p-8 min-h-96">
              <div className="text-center text-gray-500">
                <i className="ri-dashboard-line text-4xl mb-4"></i>
                <p className="text-lg">Dashboard content will be loaded here</p>
                <p className="text-sm mt-2">Current section: <span className="font-medium">{currentSection}</span></p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
