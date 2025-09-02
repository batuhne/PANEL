import { useState } from 'react'
import Header from './Header'
import AdminSidebar from './AdminSidebar'

const AdminDashboardLayout = ({ children }) => {
  const [currentSection, setCurrentSection] = useState('Overview')

  const handleSectionChange = (sectionName) => {
    setCurrentSection(sectionName)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentSection={currentSection} isAdmin={true} />
      <div className="flex pt-16">
        <AdminSidebar onSectionChange={handleSectionChange} />
        <main className="flex-1 ml-64 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminDashboardLayout
