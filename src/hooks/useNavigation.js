import { useNavigate } from 'react-router-dom'

const useNavigation = () => {
  const navigate = useNavigate()
  
  const goToLogin = () => navigate('/')
  const goToDevices = () => navigate('/devices')  
  const goToUserDashboard = () => navigate('/dashboard/user')
  const goToAdminDashboard = () => navigate('/dashboard/admin')
  
  return { 
    goToLogin, 
    goToDevices, 
    goToUserDashboard, 
    goToAdminDashboard,
    navigate 
  }
}

export default useNavigation
