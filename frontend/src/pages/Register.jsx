import { useState } from 'react'
import api from '../api/axios'
import { Link } from 'react-router-dom'

function Register() {

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleRegister = async (e) => {

    e.preventDefault()

    try {

      const response = await api.post(
        '/register',
        {
          name,
          email,
          mobile,
          password,
          confirm_password: confirmPassword
        }
      )

      setMessage(response.data.message)

      setName('')
      setEmail('')
      setMobile('')
      setPassword('')
      setConfirmPassword('')

    } catch (error) {

      setMessage('Registration failed')
    }
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
          width: '400px',
          backgroundColor: '#1e293b',
          padding: '40px',
          borderRadius: '20px'
        }}
      >

        <h1
          style={{
            color: 'white',
            marginBottom: '20px',
            textAlign: 'center'
          }}
        >
          Register 🚀
        </h1>

        <form onSubmit={handleRegister}>

          <input
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />

          <input
            type="text"
            placeholder="Enter Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={inputStyle}
          />

          <button
            type="submit"
            style={buttonStyle}
          >
            Register
          </button>

        </form>

        {
          message && (
            <p
              style={{
                color: '#22c55e',
                marginTop: '20px',
                textAlign: 'center'
              }}
            >
              {message}
            </p>
          )
        }

        <p
          style={{
            color: 'white',
            marginTop: '20px',
            textAlign: 'center'
          }}
        >
          Already have an account?

          <Link
            to="/login"
            style={{
              color: '#3b82f6',
              marginLeft: '5px'
            }}
          >
            Login
          </Link>

        </p>

      </div>

    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '12px',
  marginBottom: '15px',
  borderRadius: '10px',
  border: 'none',
  fontSize: '16px'
}

const buttonStyle = {
  width: '100%',
  padding: '12px',
  borderRadius: '10px',
  border: 'none',
  backgroundColor: '#3b82f6',
  color: 'white',
  fontSize: '16px',
  cursor: 'pointer'
}

export default Register