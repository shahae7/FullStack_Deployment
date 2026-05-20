import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

function Profile() {

  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await api.get('/profile')
      setUser(response.data)
    } catch (error) {
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

  if (loading) {
    return (
      <div style={containerStyle}>
        <p style={{ color: 'white' }}>Loading...</p>
      </div>
    )
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>

        {/* Avatar Circle */}
        <div style={avatarStyle}>
          {user?.name?.charAt(0).toUpperCase()}
        </div>

        <h1 style={{ color: 'white', fontSize: '24px', marginBottom: '5px' }}>
          Welcome, {user?.name}! 👋
        </h1>

        <p style={{ color: '#94a3b8', marginBottom: '30px' }}>
          Your profile details
        </p>

        {/* Info Cards */}
        <div style={infoBoxStyle}>
          <span style={labelStyle}>👤 Name</span>
          <span style={valueStyle}>{user?.name}</span>
        </div>

        <div style={infoBoxStyle}>
          <span style={labelStyle}>📧 Email</span>
          <span style={valueStyle}>{user?.email}</span>
        </div>

        <div style={infoBoxStyle}>
          <span style={labelStyle}>📱 Mobile</span>
          <span style={valueStyle}>{user?.mobile}</span>
        </div>

        <div style={infoBoxStyle}>
          <span style={labelStyle}>🆔 User ID</span>
          <span style={valueStyle}>#{user?.id}</span>
        </div>

        <button onClick={handleLogout} style={buttonStyle}>
          🚪 Logout
        </button>

      </div>
    </div>
  )
}

const containerStyle = {
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#0f172a'
}

const cardStyle = {
  backgroundColor: '#1e293b',
  padding: '40px',
  borderRadius: '20px',
  textAlign: 'center',
  width: '420px',
  boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
}

const avatarStyle = {
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  backgroundColor: '#3b82f6',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '36px',
  fontWeight: 'bold',
  color: 'white',
  margin: '0 auto 20px auto'
}

const infoBoxStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#0f172a',
  padding: '12px 16px',
  borderRadius: '10px',
  marginBottom: '12px'
}

const labelStyle = {
  color: '#94a3b8',
  fontSize: '14px'
}

const valueStyle = {
  color: 'white',
  fontSize: '14px',
  fontWeight: '500'
}

const buttonStyle = {
  width: '100%',
  padding: '12px',
  marginTop: '10px',
  borderRadius: '10px',
  border: 'none',
  backgroundColor: '#ef4444',
  color: 'white',
  fontSize: '16px',
  cursor: 'pointer',
  fontWeight: 'bold'
}

export default Profile