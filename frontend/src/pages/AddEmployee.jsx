import { useState } from 'react'
import api from '../api/axios'
import { useNavigate } from 'react-router-dom'

function AddEmployee() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [department, setDepartment] = useState('')
  const [designation, setDesignation] = useState('')
  const [salary, setSalary] = useState('')
  const [joiningDate, setJoiningDate] = useState('')
  const [status, setStatus] = useState('Active')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  const validate = () => {
    if (!name.trim()) return 'Employee name is required.'
    if (!email.trim()) return 'Employee email is required.'
    if (!mobile.trim()) return 'Employee mobile is required.'
    if (!department.trim()) return 'Department is required.'
    if (!designation.trim()) return 'Designation is required.'
    if (!salary || Number(salary) <= 0) return 'Salary must be a positive number.'
    if (!joiningDate.trim()) return 'Joining date is required.'
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationError = validate()
    if (validationError) {
      setMessage(validationError)
      setMessageType('error')
      return
    }

    try {
      await api.post('/employees', {
        name,
        email,
        mobile,
        department,
        designation,
        salary: Number(salary),
        joining_date: joiningDate
      })
      setMessage('Employee added successfully.')
      setMessageType('success')
      setName('')
      setEmail('')
      setMobile('')
      setDepartment('')
      setDesignation('')
      setSalary('')
      setJoiningDate('')
      setStatus('Active')
      setTimeout(() => navigate('/employees'), 900)
    } catch (err) {
      setMessage(err.response?.data?.detail || 'Unable to add employee.')
      setMessageType('error')
    }
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <div>
            <p style={eyebrowStyle}>New employee</p>
            <h1 style={titleStyle}>Add team member</h1>
            <p style={subtitleStyle}>Create a new employee record to keep your directory up to date.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={formStyle}>
            <InputField label="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Employee full name" />
          <InputField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Employee email" type="email" />
          <InputField label="Mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="Employee mobile" type="tel" />
          <InputField label="Department" value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="Department" />
          <InputField label="Designation" value={designation} onChange={(e) => setDesignation(e.target.value)} placeholder="Designation / role" />
          <InputField label="Salary" value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="Salary" type="number" />
          <InputField label="Joining Date" value={joiningDate} onChange={(e) => setJoiningDate(e.target.value)} placeholder="YYYY-MM-DD" type="date" />

          <div style={{ marginBottom: '18px' }}>
            <label style={labelStyle}>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} style={selectStyle}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <button type="submit" style={buttonStyle}>Save employee</button>
        </form>

        {message && (
          <div style={messageType === 'success' ? successMessageStyle : errorMessageStyle}>
            {message}
          </div>
        )}
      </div>
    </div>
  )
}

function InputField({ label, type = 'text', value, onChange, placeholder }) {
  return (
    <div style={{ marginBottom: '18px' }}>
      <label style={labelStyle}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={inputStyle}
      />
    </div>
  )
}

const pageStyle = {
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'linear-gradient(180deg, #020617 0%, #0f172a 100%)',
  padding: '30px'
}

const cardStyle = {
  width: '100%',
  maxWidth: '520px',
  backgroundColor: '#111827',
  borderRadius: '30px',
  padding: '34px',
  border: '1px solid rgba(148, 163, 184, 0.12)',
  boxShadow: '0 30px 80px rgba(15, 23, 42, 0.35)'
}

const headerStyle = {
  marginBottom: '28px'
}

const eyebrowStyle = {
  color: '#60a5fa',
  textTransform: 'uppercase',
  letterSpacing: '0.16em',
  fontSize: '12px',
  marginBottom: '10px'
}

const titleStyle = {
  color: 'white',
  fontSize: '30px',
  margin: 0
}

const subtitleStyle = {
  color: '#94a3b8',
  marginTop: '10px',
  fontSize: '15px',
  lineHeight: 1.7
}

const formStyle = {
  display: 'flex',
  flexDirection: 'column'
}

const labelStyle = {
  display: 'block',
  color: '#cbd5e1',
  marginBottom: '10px',
  fontSize: '14px'
}

const inputStyle = {
  width: '100%',
  padding: '14px 16px',
  borderRadius: '16px',
  border: '1px solid rgba(148, 163, 184, 0.12)',
  backgroundColor: '#0f172a',
  color: 'white',
  fontSize: '15px',
  outline: 'none'
}

const selectStyle = {
  width: '100%',
  padding: '14px 16px',
  borderRadius: '16px',
  border: '1px solid rgba(148, 163, 184, 0.12)',
  backgroundColor: '#0f172a',
  color: 'white',
  fontSize: '15px',
  outline: 'none'
}

const buttonStyle = {
  width: '100%',
  padding: '14px 18px',
  borderRadius: '16px',
  border: 'none',
  backgroundColor: '#22c55e',
  color: 'white',
  fontSize: '16px',
  fontWeight: '700',
  cursor: 'pointer'
}

const messageBaseStyle = {
  marginTop: '22px',
  borderRadius: '16px',
  padding: '14px 16px',
  fontSize: '14px'
}

const successMessageStyle = {
  ...messageBaseStyle,
  backgroundColor: 'rgba(34, 197, 94, 0.12)',
  color: '#86efac',
  border: '1px solid rgba(34, 197, 94, 0.25)'
}

const errorMessageStyle = {
  ...messageBaseStyle,
  backgroundColor: 'rgba(248, 113, 113, 0.12)',
  color: '#fca5a5',
  border: '1px solid rgba(248, 113, 113, 0.25)'
}

export default AddEmployee
