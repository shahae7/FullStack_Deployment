import { useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../Context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  const validate = () => {
    if (!email.trim()) {
      setMessage('Email is required.')
      setMessageType('error')
      return false
    }
    if (!password) {
      setMessage('Password is required.')
      setMessageType('error')
      return false
    }
    setMessage('')
    return true
  }

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!validate()) return

    try {
      const response = await api.post('/login', { email, password })

      if (response.data.access_token) {
        login(response.data.access_token)
        navigate('/profile')
      } else {
        setMessage(response.data.message || 'Unable to log in.')
        setMessageType('error')
      }
    } catch (error) {
      setMessage(error.response?.data?.detail || 'Invalid credentials')
      setMessageType('error')
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-slate-800/95 border border-slate-700 rounded-3xl p-8 shadow-2xl backdrop-blur-sm">
        <div className="mb-10 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-400 mb-3">Secure access</p>
          <h1 className="text-4xl text-white font-semibold mb-3">Welcome back</h1>
          <p className="text-slate-300">Enter your credentials to continue to your employee dashboard.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-slate-300 text-sm mb-2">Email address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-slate-700 bg-slate-900/90 p-4 text-slate-100 outline-none transition focus:border-sky-400"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-slate-300 text-sm">Password</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-slate-400 text-xs hover:text-slate-100"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
                <span className="text-slate-600">|</span>
                <Link to="/forgot-password" className="text-sky-400 text-xs hover:text-sky-300">
                  Forgot?
                </Link>
              </div>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
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
            Login
          </button>
        </form>

        {message && (
          <div className={`mt-6 rounded-2xl px-4 py-3 text-sm ${messageType === 'error' ? 'bg-rose-500/15 text-rose-300 border border-rose-500/20' : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20'}`}>
            {message}
          </div>
        )}

        <div className="mt-8 text-center text-slate-300 text-sm">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-sky-300 hover:text-sky-200 font-medium">
            Create one
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login
