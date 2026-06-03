import {
  Routes,
  Route,
  Navigate,
  useLocation
} from 'react-router-dom'

import Register from './pages/Register'
import Login from './pages/Login'
import AdminLogin from './pages/AdminLogin'
import ForgotPassword from './pages/ForgotPassword'
import Profile from './pages/Profile'
import Employees from './pages/Employees'
import AddEmployee from './pages/AddEmployee'
import AdminPanel from './pages/AdminPanel'
import Navbar from './components/Navbar'

function App() {
  const location = useLocation()
  const hideNavbar = ['/login', '/register', '/forgot-password', '/admin-login'].includes(location.pathname)

  return (
    <>
      {!hideNavbar && <Navbar />}
      <div className={hideNavbar ? '' : 'pt-28'}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/add-employee" element={<AddEmployee />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>
    </>
  )
}

export default App