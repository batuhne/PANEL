import DashboardLayout from '../components/layout/DashboardLayout'

const UserDashboard = () => {
  return (
    <DashboardLayout>
      {/* This will be the main content area for user dashboard */}
      <div className="bg-white rounded-2xl shadow-lg p-8 min-h-96">
        <div className="text-center text-gray-500">
          <i className="ri-dashboard-line text-4xl mb-4"></i>
          <p className="text-lg">User Dashboard Content</p>
          <p className="text-sm mt-2 text-gray-400">
            Navigation through sidebar to explore different sections
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default UserDashboard
