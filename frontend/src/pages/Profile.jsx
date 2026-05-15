import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  useNavigate
} from 'react-router-dom'

function Profile() {

  const navigate = useNavigate()

  useEffect(() => {

    const token = localStorage.getItem('token')

    if (!token) {

      navigate('/login')
    }

  }, [])

  const handleLogout = () => {

    localStorage.removeItem('token')

    navigate('/login')
  }

  return (

    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0f172a'
      }}
    >

      <div
        style={{
          backgroundColor: '#1e293b',
          padding: '40px',
          borderRadius: '20px',
          textAlign: 'center'
        }}
      >

        <h1
          style={{
            color: 'white',
            marginBottom: '20px'
          }}
        >
          Welcome to Profile 🔐
        </h1>

        <button
          onClick={handleLogout}
          style={{
            padding: '12px 20px',
            border: 'none',
            borderRadius: '10px',
            backgroundColor: '#ef4444',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>

      </div>

    </div>
  )
}

export default Profile