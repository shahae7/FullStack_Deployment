import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../Context/AuthContext'
import { useEffect, useState } from 'react'
import api from '../api/axios'

function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [isSuperuser, setIsSuperuser] = useState(false)
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/profile')
        setIsSuperuser(response.data.is_su)
        setUserName(response.data.name || '')
        setUserEmail(response.data.email || '')
      } catch (err) {
        // ignore silently if not authenticated
      }
    }

    fetchProfile()
  }, [])

  const hiddenPaths = ['/login', '/register']
  if (hiddenPaths.includes(location.pathname)) {
    return null
  }

  const navItems = [
    { to: '/profile', label: 'Profile' },
    { to: '/employees', label: 'Employees' }
  ]

  // Only allow the specific email (shahae) or superusers to add employees
  const allowedEmails = ['shahae@yopmail.com']

  if (isSuperuser || allowedEmails.includes(userEmail)) {
    navItems.push({ to: '/add-employee', label: 'Add Employee' })
  }

  if (isSuperuser) {
    navItems.push({ to: '/admin', label: 'Admin' })
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-slate-700 bg-slate-950/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/profile" className="flex items-center gap-3 text-white hover:text-sky-300">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500 text-lg font-bold text-white">
            E
          </div>
          <div>
            <p className="text-sm text-slate-400">Employee Portal</p>
            <p className="text-base font-semibold">Dashboard</p>
          </div>
        </Link>

        <div className="hidden items-center gap-3 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                location.pathname === item.to
                  ? 'bg-slate-800 text-white shadow-lg shadow-sky-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-400"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
