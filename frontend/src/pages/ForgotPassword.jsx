import { useState } from 'react'
import api from '../api/axios'
import { Link, useNavigate } from 'react-router-dom'

function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1: email, 2: otp, 3: password
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRequestReset = async (e) => {
    e.preventDefault()
    setMessage('')

    if (!email.trim()) {
      setMessage('Email is required.')
      setMessageType('error')
      return
    }

    try {
      setLoading(true)
      const response = await api.post('/forgot-password', { email })
      setMessage(response.data.message)
      setMessageType('success')
      setStep(2)
    } catch (err) {
      setMessage(err.response?.data?.detail || 'Unable to process password reset request.')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setMessage('')

    if (!otp.trim()) {
      setMessage('OTP is required.')
      setMessageType('error')
      return
    }

    if (otp.length !== 6) {
      setMessage('OTP must be 6 digits.')
      setMessageType('error')
      return
    }

    try {
      setLoading(true)
      await api.post('/verify-otp', { email, otp })
      setMessage('OTP verified successfully. Now enter your new password.')
      setMessageType('success')
      setStep(3)
    } catch (err) {
      setMessage(err.response?.data?.detail || 'Invalid OTP.')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setMessage('')

    if (!newPassword.trim()) {
      setMessage('New password is required.')
      setMessageType('error')
      return
    }
    if (!confirmPassword.trim()) {
      setMessage('Please confirm your password.')
      setMessageType('error')
      return
    }
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.')
      setMessageType('error')
      return
    }
    if (newPassword.length < 6) {
      setMessage('Password must be at least 6 characters.')
      setMessageType('error')
      return
    }

    try {
      setLoading(true)
      const response = await api.post('/reset-password', {
        email,
        otp,
        new_password: newPassword,
        confirm_password: confirmPassword
      })
      setMessage(response.data.message || 'Password reset successfully!')
      setMessageType('success')
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setMessage(err.response?.data?.detail || 'Unable to reset password.')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-slate-800/95 border border-slate-700 rounded-3xl p-8 shadow-2xl backdrop-blur-sm">
        <div className="mb-10 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-400 mb-3">Reset access</p>
          <h1 className="text-4xl text-white font-semibold mb-3">
            {step === 1 ? 'Recover password' : step === 2 ? 'Verify OTP' : 'Set new password'}
          </h1>
          <p className="text-slate-300">
            {step === 1
              ? 'Enter your email to verify your account.'
              : step === 2
              ? 'Enter the OTP sent to your email.'
              : 'Create a new secure password.'}
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleRequestReset} className="space-y-5">
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

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-sky-500 px-5 py-3 text-white font-semibold shadow-lg shadow-sky-500/20 transition hover:bg-sky-400 disabled:opacity-50"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : step === 2 ? (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div>
              <label className="block text-slate-300 text-sm mb-2">Email</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full rounded-2xl border border-slate-700 bg-slate-900/90 p-4 text-slate-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm mb-2">Enter OTP</label>
              <input
                type="text"
                placeholder="6-digit code"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full rounded-2xl border border-slate-700 bg-slate-900/90 p-4 text-slate-100 outline-none transition focus:border-sky-400 text-center text-lg tracking-widest"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-sky-500 px-5 py-3 text-white font-semibold shadow-lg shadow-sky-500/20 transition hover:bg-sky-400 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(1)
                setOtp('')
                setMessage('')
              }}
              className="w-full text-slate-300 text-sm hover:text-slate-100"
            >
              Back to email verification
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div>
              <label className="block text-slate-300 text-sm mb-2">Email</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full rounded-2xl border border-slate-700 bg-slate-900/90 p-4 text-slate-500 outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-slate-300 text-sm">New password</label>
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-slate-400 text-xs hover:text-slate-100"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-2xl border border-slate-700 bg-slate-900/90 p-4 text-slate-100 outline-none transition focus:border-sky-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm mb-2">Confirm password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-2xl border border-slate-700 bg-slate-900/90 p-4 text-slate-100 outline-none transition focus:border-sky-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-sky-500 px-5 py-3 text-white font-semibold shadow-lg shadow-sky-500/20 transition hover:bg-sky-400 disabled:opacity-50"
            >
              {loading ? 'Resetting...' : 'Reset password'}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(2)
                setMessage('')
              }}
              className="w-full text-slate-300 text-sm hover:text-slate-100"
            >
              Back to OTP verification
            </button>
          </form>
        )}

        {message && (
          <div className={`mt-6 rounded-2xl px-4 py-3 text-sm ${messageType === 'error' ? 'bg-rose-500/15 text-rose-300 border border-rose-500/20' : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20'}`}>
            {message}
          </div>
        )}

        <div className="mt-8 text-center text-slate-300 text-sm">
          Remember your password?{' '}
          <Link to="/login" className="text-sky-300 hover:text-sky-200 font-medium">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
