import { useState } from 'react'
import api from '../api/axios'
import { useAuth } from "../Context/AuthContext";
import {Link,useNavigate} from 'react-router-dom'

function Login() {

  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleLogin = async (e) => {

    e.preventDefault()

    try {

      const response = await api.post(
        '/login',
        {
          email,
          password
        }
      )

      login(
        response.data.access_token
      )

      navigate('/profile')

    } catch (error) {

      setMessage('Invalid credentials')
    }
  }

  return (

    <div className="min-h-screen bg-slate-900 flex items-center justify-center">

      <div className="bg-slate-800 p-10 rounded-2xl w-[400px] shadow-2xl">

        <h1 className="text-3xl text-white font-bold text-center mb-8">
          Login 🔐
        </h1>

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-xl outline-none"
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-xl outline-none"
          />

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 transition-all text-white p-3 rounded-xl"
          >
            Login
          </button>

        </form>

        {
          message && (
            <p className="text-red-400 text-center mt-5">
              {message}
            </p>
          )
        }

        <p className="text-white text-center mt-6">

          Don't have an account?

          <Link
            to="/register"
            className="text-blue-400 ml-2"
          >
            Register
          </Link>

        </p>

      </div>

    </div>
  )
}

export default Login