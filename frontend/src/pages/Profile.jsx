import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'

function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [status, setStatus] = useState('Active')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }
    fetchProfile()
  }, [navigate])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await api.get('/profile')
      setUser(response.data)
      setName(response.data.name || '')
      setEmail(response.data.email || '')
      setMobile(response.data.mobile || '')
      setStatus(response.data.status || 'Active')
    } catch (err) {
      localStorage.removeItem('token')
      navigate('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')

    if (!name.trim()) {
      setError('Name cannot be empty.')
      return
    }

    try {
      setSaving(true)
      const response = await api.put('/profile', {
        name,
        mobile,
        status
      })
      setUser(response.data)
      setStatus(response.data.status || status)
      setMessage('Profile updated successfully.')
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to save profile.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={loaderCardStyle}>
          <p style={loaderTextStyle}>Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div style={containerStyle}>
        <div style={loaderCardStyle}>
          <p style={loaderTextStyle}>Unable to load profile. Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={containerStyle}>
      <div style={pageCardStyle}>
        <div style={heroStyle}>
          <div style={avatarStyle}>{user?.name?.charAt(0).toUpperCase()}</div>
          <div>
            <p style={welcomeLabelStyle}>Welcome back</p>
            <h1 style={welcomeNameStyle}>Hello, {user?.name}</h1>
            <p style={welcomeSubtitleStyle}>Your profile is live. Manage account settings, explore employees, and stay secure.</p>
          </div>
        </div>

        <div style={profileLayoutStyle}>
          <form onSubmit={handleSave} style={cardPanelStyle}>
            <div style={sectionHeaderStyle}>
              <h2 style={sectionTitleStyle}>Profile summary</h2>
              <p style={sectionSubtitleStyle}>Quick details from your account.</p>
            </div>

            <div style={infoBoxStyle}>
              <span style={infoLabelStyle}>User ID</span>
              <span style={infoValueStyle}>#{user?.id}</span>
            </div>
            <div style={infoBoxStyle}>
              <span style={infoLabelStyle}>Email</span>
              <span style={infoValueStyle}>{user?.email}</span>
            </div>
            <div style={infoBoxStyle}>
              <span style={infoLabelStyle}>Superuser</span>
              <span style={infoValueStyle}>{user?.is_su ? 'Yes' : 'No'}</span>
            </div>
            <div style={fieldBoxStyle}>
              <label style={fieldLabelStyle}>Name</label>
              <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div style={fieldBoxStyle}>
              <label style={fieldLabelStyle}>Mobile</label>
              <input style={inputStyle} value={mobile} onChange={(e) => setMobile(e.target.value)} />
            </div>
            <div style={fieldBoxStyle}>
              <label style={fieldLabelStyle}>Account status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} style={inputStyle}>
                <option value="Active">Active</option>
                <option value="Inactive">Not active</option>
              </select>
            </div>

            <div style={statsGridStyle}>
              <StatCard label="Employees" value="12" />
              <StatCard label="Projects" value="3" />
              <StatCard label="Team" value="5" />
            </div>

            {message && <div style={successMessageStyle}>{message}</div>}
            {error && <div style={errorStyle}>{error}</div>}
            <button type="submit" style={saveButtonStyle} disabled={saving}>
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </form>

          <div style={actionPanelStyle}>
            <div style={sectionHeaderStyle}>
              <h2 style={sectionTitleStyle}>Quick actions</h2>
              <p style={sectionSubtitleStyle}>Navigate around the app faster.</p>
            </div>

            <ActionCard label="View employees" description="See all employee records and manage them." to="/employees" />
            {user?.is_su && (
              <ActionCard label="Admin panel" description="Manage users and superuser access." to="/admin" />
            )}
            <ActionCard label="Logout" description="Sign out of your account securely." onClick={handleLogout} isDanger />
          </div>
        </div>

        {error && <p style={errorStyle}>{error}</p>}
      </div>
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <div style={statCardStyle}>
      <p style={statValueStyle}>{value}</p>
      <p style={statLabelStyle}>{label}</p>
    </div>
  )
}

function ActionCard({ label, description, to, onClick, isDanger }) {
  const cardStyle = {
    ...actionCardStyle,
    borderColor: isDanger ? 'rgba(248, 113, 113, 0.25)' : 'rgba(56, 189, 248, 0.25)',
    backgroundColor: isDanger ? 'rgba(248, 113, 113, 0.08)' : 'rgba(56, 189, 248, 0.08)'
  }

  if (to) {
    return (
      <Link to={to} style={cardStyle}>
        <div>
          <p style={actionTitleStyle}>{label}</p>
          <p style={actionDescriptionStyle}>{description}</p>
        </div>
        <span style={actionArrowStyle}>→</span>
      </Link>
    )
  }

  return (
    <button onClick={onClick} style={cardStyle}>
      <div>
        <p style={actionTitleStyle}>{label}</p>
        <p style={actionDescriptionStyle}>{description}</p>
      </div>
      <span style={actionArrowStyle}>→</span>
    </button>
  )
}

const containerStyle = {
  minHeight: '100vh',
  padding: '30px 20px',
  background: 'linear-gradient(180deg, #020617 0%, #0f172a 100%)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}

const pageCardStyle = {
  width: '100%',
  maxWidth: '1120px',
  backgroundColor: '#111827',
  borderRadius: '32px',
  padding: '32px',
  boxShadow: '0 30px 90px rgba(15, 23, 42, 0.4)',
  border: '1px solid rgba(148, 163, 184, 0.12)'
}

const heroStyle = {
  display: 'flex',
  gap: '24px',
  alignItems: 'center',
  marginBottom: '32px'
}

const avatarStyle = {
  width: '96px',
  height: '96px',
  borderRadius: '24px',
  display: 'grid',
  placeItems: 'center',
  backgroundColor: '#2563eb',
  color: 'white',
  fontSize: '36px',
  fontWeight: '700'
}

const welcomeLabelStyle = {
  color: '#60a5fa',
  textTransform: 'uppercase',
  letterSpacing: '0.16em',
  fontSize: '12px',
  marginBottom: '10px'
}

const welcomeNameStyle = {
  color: 'white',
  fontSize: '36px',
  margin: 0,
  lineHeight: '1.05'
}

const welcomeSubtitleStyle = {
  color: '#cbd5e1',
  fontSize: '16px',
  marginTop: '10px',
  maxWidth: '640px'
}

const profileLayoutStyle = {
  display: 'grid',
  gridTemplateColumns: '1.4fr 1fr',
  gap: '28px'
}

const cardPanelStyle = {
  backgroundColor: '#0f172a',
  borderRadius: '28px',
  padding: '28px',
  border: '1px solid rgba(148, 163, 184, 0.10)'
}

const actionPanelStyle = {
  backgroundColor: '#0f172a',
  borderRadius: '28px',
  padding: '28px',
  border: '1px solid rgba(148, 163, 184, 0.10)'
}

const sectionHeaderStyle = {
  marginBottom: '20px'
}

const sectionTitleStyle = {
  color: 'white',
  fontSize: '22px',
  margin: 0
}

const sectionSubtitleStyle = {
  color: '#94a3b8',
  fontSize: '14px',
  marginTop: '8px'
}

const infoBoxStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '18px 20px',
  borderRadius: '18px',
  backgroundColor: '#111827',
  marginBottom: '12px',
  border: '1px solid rgba(148, 163, 184, 0.08)'
}

const infoLabelStyle = {
  color: '#94a3b8',
  fontSize: '14px'
}

const infoValueStyle = {
  color: 'white',
  fontSize: '15px',
  fontWeight: '600'
}

const fieldBoxStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  padding: '18px 20px',
  borderRadius: '18px',
  backgroundColor: '#111827',
  marginBottom: '12px',
  border: '1px solid rgba(148, 163, 184, 0.08)'
}

const fieldLabelStyle = {
  color: '#94a3b8',
  fontSize: '14px'
}

const inputStyle = {
  width: '100%',
  padding: '14px 16px',
  borderRadius: '14px',
  border: '1px solid rgba(148, 163, 184, 0.12)',
  backgroundColor: '#020617',
  color: 'white',
  fontSize: '15px',
  outline: 'none'
}

const saveButtonStyle = {
  width: '100%',
  marginTop: '20px',
  padding: '14px 18px',
  borderRadius: '16px',
  border: 'none',
  backgroundColor: '#2563eb',
  color: 'white',
  fontSize: '15px',
  fontWeight: '700',
  cursor: 'pointer'
}

const successMessageStyle = {
  marginTop: '20px',
  padding: '14px 16px',
  borderRadius: '16px',
  backgroundColor: 'rgba(34, 197, 94, 0.12)',
  color: '#86efac',
  border: '1px solid rgba(34, 197, 94, 0.25)',
  textAlign: 'center'
}

const statusBadgeStyle = {
  color: '#34d399',
  fontWeight: '700'
}

const statsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: '16px',
  marginTop: '22px'
}

const statCardStyle = {
  padding: '18px',
  borderRadius: '18px',
  backgroundColor: '#111827',
  border: '1px solid rgba(148, 163, 184, 0.08)',
  textAlign: 'center'
}

const statValueStyle = {
  color: 'white',
  fontSize: '24px',
  fontWeight: '700',
  margin: 0
}

const statLabelStyle = {
  color: '#94a3b8',
  fontSize: '13px',
  marginTop: '8px'
}

const actionCardStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  textAlign: 'left',
  padding: '20px',
  borderRadius: '22px',
  border: '1px solid rgba(56, 189, 248, 0.25)',
  backgroundColor: 'rgba(56, 189, 248, 0.08)',
  color: 'white',
  cursor: 'pointer',
  textDecoration: 'none',
  marginBottom: '16px'
}

const actionTitleStyle = {
  margin: 0,
  fontSize: '17px',
  fontWeight: '600'
}

const actionDescriptionStyle = {
  color: '#94a3b8',
  fontSize: '14px',
  marginTop: '6px'
}

const actionArrowStyle = {
  color: '#60a5fa',
  fontSize: '22px',
  fontWeight: '700'
}

const errorStyle = {
  marginTop: '24px',
  color: '#f87171',
  textAlign: 'center'
}

const loaderCardStyle = {
  backgroundColor: '#111827',
  padding: '28px',
  borderRadius: '26px',
  border: '1px solid rgba(148, 163, 184, 0.10)',
  boxShadow: '0 20px 50px rgba(15, 23, 42, 0.35)'
}

const loaderTextStyle = {
  color: 'white',
  fontSize: '16px'
}

export default Profile
