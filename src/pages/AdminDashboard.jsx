import AdminDashboardLayout from '../components/layout/AdminDashboardLayout'

const AdminDashboard = () => {
  return (
    <AdminDashboardLayout>
      {/* This will be the main content area for admin dashboard */}
      <div className="bg-white rounded-2xl shadow-lg p-8 min-h-96">
        <div className="text-center text-gray-500">
          <i className="ri-shield-user-line text-4xl mb-4"></i>
          <p className="text-lg">Admin Dashboard Content</p>
          <p className="text-sm mt-2 text-gray-400">
            Advanced system administration and monitoring tools
          </p>
        </div>
      </div>
    </AdminDashboardLayout>
  )
}

export default AdminDashboard
