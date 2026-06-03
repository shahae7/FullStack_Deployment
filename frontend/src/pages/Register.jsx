import { useState } from 'react'
import api from '../api/axios'
import { Link } from 'react-router-dom'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  const [errors, setErrors] = useState({})

  const validate = () => {
    const nextErrors = {}

    if (!name.trim()) nextErrors.name = 'Name is required.'
    if (!email.trim()) nextErrors.email = 'Email is required.'
    else if (!/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = 'Enter a valid email.'
    if (!mobile.trim()) nextErrors.mobile = 'Mobile number is required.'
    else if (!/^\d{10}$/.test(mobile)) nextErrors.mobile = 'Enter a 10-digit mobile number.'
    if (!password) nextErrors.password = 'Password is required.'
    else if (password.length < 6) nextErrors.password = 'Password must be at least 6 characters.'
    if (!confirmPassword) nextErrors.confirmPassword = 'Please confirm your password.'
    else if (password !== confirmPassword) nextErrors.confirmPassword = 'Passwords do not match.'

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleRegister = async (e) => {
    e.preventDefault()

    if (!validate()) {
      setMessage('Please fix the highlighted fields.')
      setMessageType('error')
      return
    }

    try {
      const response = await api.post('/register', {
        name,
        email,
        mobile,
        password,
        confirm_password: confirmPassword
      })

      setMessage(response.data.message || 'Registration succeeded.')
      setMessageType('success')
      setName('')
      setEmail('')
      setMobile('')
      setPassword('')
      setConfirmPassword('')
      setErrors({})
    } catch (error) {
      setMessage(error.response?.data?.detail || 'Registration failed. Try again.')
      setMessageType('error')
    }
  }

  const isPasswordStrong = password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password)

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={headingRowStyle}>
          <p style={eyebrowStyle}>Create your account</p>
          <h1 style={titleStyle}>Sign up for employee management</h1>
          <p style={subtitleStyle}>Fill in your details below to unlock your profile dashboard and employee tools.</p>
        </div>

        <form onSubmit={handleRegister} style={formStyle}>
          <InputField
            label="Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter full name"
            error={errors.name}
          />

          <InputField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            error={errors.email}
          />

          <InputField
            label="Mobile"
            type="text"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="10-digit mobile number"
            error={errors.mobile}
          />

          <InputField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            error={errors.password}
            helperText="At least 6 characters. Stronger with uppercase and numbers."
          />

          <InputField
            label="Confirm Password"
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat your password"
            error={errors.confirmPassword}
          />

          <div style={toggleRowStyle}>
            <label style={toggleLabelStyle}>
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword((prev) => !prev)}
                style={checkboxStyle}
              />
              Show password
            </label>
            <span style={strengthStyle(isPasswordStrong)}>
              {isPasswordStrong ? 'Strong password' : 'Weak password'}
            </span>
          </div>

          <button type="submit" style={buttonStyle}>
            Register
          </button>
        </form>

        {message && (
          <p style={messageType === 'success' ? successMessageStyle : errorMessageStyle}>
            {message}
          </p>
        )}

        <p style={footerTextStyle}>
          Already have an account?
          <Link to="/login" style={footerLinkStyle}>Login</Link>
        </p>
      </div>
    </div>
  )
}

function InputField({ label, type, value, onChange, placeholder, error, helperText }) {
  return (
    <div style={fieldStyle}>
      <div style={fieldLabelRowStyle}>
        <label style={fieldLabelStyle}>{label}</label>
        {helperText && <span style={fieldHelperStyle}>{helperText}</span>}
      </div>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{ ...inputStyle, borderColor: error ? '#f87171' : '#334155' }}
      />
      {error && <p style={fieldErrorStyle}>{error}</p>}
    </div>
  )
}

const pageStyle = {
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'linear-gradient(180deg, #020617 0%, #0f172a 100%)',
  padding: '20px'
}

const cardStyle = {
  width: '430px',
  backgroundColor: '#111827',
  padding: '36px',
  borderRadius: '28px',
  boxShadow: '0 30px 80px rgba(15, 23, 42, 0.45)',
  border: '1px solid rgba(148, 163, 184, 0.12)'
}

const headingRowStyle = {
  marginBottom: '28px'
}

const eyebrowStyle = {
  color: '#60a5fa',
  fontSize: '14px',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  marginBottom: '10px'
}

const titleStyle = {
  color: 'white',
  fontSize: '28px',
  lineHeight: '1.2',
  marginBottom: '10px'
}

const subtitleStyle = {
  color: '#94a3b8',
  fontSize: '15px',
  lineHeight: '1.6'
}

const formStyle = {
  display: 'flex',
  flexDirection: 'column'
}

const fieldStyle = {
  marginBottom: '18px'
}

const fieldLabelRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '8px'
}

const fieldLabelStyle = {
  color: '#e2e8f0',
  fontSize: '14px',
  fontWeight: '600'
}

const fieldHelperStyle = {
  color: '#94a3b8',
  fontSize: '12px'
}

const inputStyle = {
  width: '100%',
  padding: '14px 16px',
  borderRadius: '14px',
  border: '1px solid #334155',
  backgroundColor: '#0f172a',
  color: 'white',
  fontSize: '15px',
  outline: 'none',
  transition: 'border-color 0.2s ease'
}

const fieldErrorStyle = {
  marginTop: '8px',
  color: '#fca5a5',
  fontSize: '13px'
}

const toggleRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '24px',
  color: '#94a3b8',
  fontSize: '14px'
}

const toggleLabelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer'
}

const checkboxStyle = {
  width: '16px',
  height: '16px',
  accentColor: '#60a5fa'
}

const strengthStyle = (strong) => ({
  color: strong ? '#86efac' : '#facc15',
  fontWeight: '600'
})

const buttonStyle = {
  width: '100%',
  padding: '14px 20px',
  borderRadius: '14px',
  border: 'none',
  backgroundColor: '#2563eb',
  color: 'white',
  fontSize: '16px',
  cursor: 'pointer',
  fontWeight: '700'
}

const messageBaseStyle = {
  marginTop: '20px',
  textAlign: 'center',
  fontSize: '14px'
}

const successMessageStyle = {
  ...messageBaseStyle,
  color: '#4ade80'
}

const errorMessageStyle = {
  ...messageBaseStyle,
  color: '#f87171'
}

const footerTextStyle = {
  color: '#cbd5e1',
  marginTop: '26px',
  textAlign: 'center',
  fontSize: '14px'
}

const footerLinkStyle = {
  marginLeft: '6px',
  color: '#60a5fa',
  textDecoration: 'none',
  fontWeight: '600'
}

export default Register
