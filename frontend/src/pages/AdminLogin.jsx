import { useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../Context/AuthContext'
import { useNavigate } from 'react-router-dom'

function AdminLogin() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await api.post('/admin/login', { email, password })
      if (response.data.access_token) {
        login(response.data.access_token)
        navigate('/admin')
      } else {
        setMessage(response.data.message || 'Unable to log in as admin.')
      }
    } catch (err) {
      setMessage(err.response?.data?.detail || 'Invalid admin credentials')
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-slate-800/95 border border-slate-700 rounded-3xl p-8 shadow-2xl backdrop-blur-sm">
        <div className="mb-10 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-400 mb-3">Admin access</p>
          <h1 className="text-4xl text-white font-semibold mb-3">Superuser Login</h1>
          <p className="text-slate-300">Enter your superuser credentials to access the admin panel.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-slate-300 text-sm mb-2">Email address</label>
            <input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-slate-700 bg-slate-900/90 p-4 text-slate-100 outline-none transition focus:border-sky-400"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-2">Password</label>
            <input
              type={'password'}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-slate-700 bg-slate-900/90 p-4 text-slate-100 outline-none transition focus:border-sky-400"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl bg-sky-500 px-5 py-3 text-white font-semibold shadow-lg shadow-sky-500/20 transition hover:bg-sky-400"
          >
            Admin Login
          </button>
        </form>

        {message && (
          <div className={`mt-6 rounded-2xl px-4 py-3 text-sm bg-rose-500/15 text-rose-300 border border-rose-500/20`}>
            {message}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminLogin
