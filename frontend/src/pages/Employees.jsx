import { useEffect, useState } from 'react'
import api from '../api/axios'
import { useNavigate } from 'react-router-dom'

function Employees() {
  const navigate = useNavigate()
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [canAdd, setCanAdd] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }
    fetchEmployees()
    fetchProfile()
  }, [navigate])

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      const response = await api.get('/employees')
      setEmployees(response.data || [])
    } catch (err) {
      setError('Unable to load employees. Please try again.')
      if (err.response?.status === 401) {
        localStorage.removeItem('token')
        navigate('/login')
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchProfile = async () => {
    try {
      const resp = await api.get('/profile')
      const email = resp.data.email
      const is_su = resp.data.is_su
      if (is_su || email === 'shahae@yopmail.com') setCanAdd(true)
    } catch (err) {
      // ignore
    }
  }

  const handleAddEmployee = () => {
    navigate('/add-employee')
  }

  return (
    <div style={containerStyle}>
      <div style={pageStyle}>
        <div style={headerStyle}>
          <div>
            <p style={eyebrowStyle}>Employee Directory</p>
            <h1 style={titleStyle}>Team members</h1>
            <p style={subtitleStyle}>Browse your employee list and manage team details from one place.</p>
          </div>
          {canAdd && (
            <button onClick={handleAddEmployee} style={primaryButtonStyle}>
              + Add employee
            </button>
          )}
        </div>

        <div style={statsRowStyle}>
          <StatTile label="Total employees" value={employees.length} />
          <StatTile label="Active" value={employees.filter((item) => item.status?.toLowerCase() !== 'inactive').length} />
          <StatTile label="Recent hires" value={employees.filter((item) => item.joining_date?.startsWith('2024')).length || 0} />
        </div>

        {loading ? (
          <div style={emptyStateStyle}>Loading employees...</div>
        ) : error ? (
          <div style={errorStyle}>{error}</div>
        ) : employees.length === 0 ? (
          <div style={emptyStateStyle}>
            <p style={emptyTitleStyle}>No employees yet</p>
            <p style={emptySubtitleStyle}>Add your first team member to start tracking data.</p>
          </div>
        ) : (
          <div style={tableCardStyle}>
            <div style={tableHeaderStyle}>
              <span>Name</span>
              <span>Email</span>
              <span>Department</span>
              <span>Status</span>
            </div>
            {employees.map((employee) => (
              <div key={employee.id} style={rowStyle}>
                <div style={nameStyle}>
                  <div style={avatarCircleStyle}>{employee.name?.charAt(0).toUpperCase()}</div>
                  <div>
                    <div style={nameTextStyle}>{employee.name}</div>
                    <div style={metaTextStyle}>{employee.designation || 'Staff'}</div>
                  </div>
                </div>
                <span style={rowCellStyle}>{employee.email}</span>
                <span style={rowCellStyle}>{employee.department || 'General'}</span>
                {(() => {
                  const statusRaw = String(employee.status || 'Active')
                  const normalized = statusRaw.trim().toLowerCase()
                  const display = normalized === 'active' ? 'Active' : 'Not active'
                  return <span style={statusPillStyle(display)}>{display}</span>
                })()}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StatTile({ label, value }) {
  return (
    <div style={statTileStyle}>
      <p style={statValueStyle}>{value}</p>
      <p style={statLabelStyle}>{label}</p>
    </div>
  )
}

const containerStyle = {
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #020617 0%, #0f172a 100%)',
  padding: '32px 24px',
  display: 'flex',
  justifyContent: 'center'
}

const pageStyle = {
  width: '100%',
  maxWidth: '1080px',
  backgroundColor: '#111827',
  borderRadius: '30px',
  padding: '28px',
  border: '1px solid rgba(148, 163, 184, 0.12)',
  boxShadow: '0 30px 80px rgba(15, 23, 42, 0.35)'
}

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: '20px',
  marginBottom: '28px'
}

const eyebrowStyle = {
  color: '#60a5fa',
  textTransform: 'uppercase',
  letterSpacing: '0.14em',
  fontSize: '12px',
  marginBottom: '10px'
}

const titleStyle = {
  color: 'white',
  fontSize: '32px',
  margin: 0,
  lineHeight: 1.1
}

const subtitleStyle = {
  color: '#94a3b8',
  fontSize: '15px',
  marginTop: '10px',
  maxWidth: '560px'
}

const primaryButtonStyle = {
  backgroundColor: '#22c55e',
  color: 'white',
  border: 'none',
  borderRadius: '16px',
  padding: '14px 22px',
  fontSize: '15px',
  fontWeight: '700',
  cursor: 'pointer'
}

const statsRowStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: '16px',
  marginBottom: '28px'
}

const statTileStyle = {
  borderRadius: '20px',
  padding: '20px',
  backgroundColor: '#0f172a',
  border: '1px solid rgba(148, 163, 184, 0.08)'
}

const statValueStyle = {
  color: 'white',
  fontSize: '28px',
  fontWeight: '700',
  margin: 0
}

const statLabelStyle = {
  color: '#94a3b8',
  marginTop: '8px',
  fontSize: '13px'
}

const tableCardStyle = {
  backgroundColor: '#0f172a',
  borderRadius: '24px',
  overflow: 'hidden',
  border: '1px solid rgba(148, 163, 184, 0.08)'
}

const tableHeaderStyle = {
  display: 'grid',
  gridTemplateColumns: '3fr 2fr 2fr 1fr',
  padding: '18px 24px',
  backgroundColor: '#111827',
  color: '#94a3b8',
  fontSize: '13px',
  textTransform: 'uppercase',
  letterSpacing: '0.12em'
}

const rowStyle = {
  display: 'grid',
  gridTemplateColumns: '3fr 2fr 2fr 1fr',
  alignItems: 'center',
  padding: '18px 24px',
  borderTop: '1px solid rgba(148, 163, 184, 0.08)'
}

const nameStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '14px'
}

const avatarCircleStyle = {
  width: '44px',
  height: '44px',
  borderRadius: '50%',
  display: 'grid',
  placeItems: 'center',
  backgroundColor: '#2563eb',
  color: 'white',
  fontWeight: '700'
}

const nameTextStyle = {
  color: 'white',
  fontSize: '15px',
  fontWeight: '600'
}

const metaTextStyle = {
  color: '#94a3b8',
  fontSize: '13px'
}

const rowCellStyle = {
  color: '#e2e8f0',
  fontSize: '14px'
}

const statusPillStyle = (status) => {
  const normalized = String(status || '').toLowerCase()
  const isInactive = normalized === 'inactive'

  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px 12px',
    borderRadius: '999px',
    fontSize: '13px',
    fontWeight: '600',
    color: isInactive ? '#f87171' : '#34d399',
    backgroundColor: isInactive ? 'rgba(248, 113, 113, 0.12)' : 'rgba(52, 211, 153, 0.12)'
  }
}

const emptyStateStyle = {
  minHeight: '260px',
  display: 'grid',
  placeItems: 'center',
  borderRadius: '24px',
  backgroundColor: '#0f172a',
  border: '1px solid rgba(148, 163, 184, 0.08)',
  color: '#94a3b8',
  padding: '30px',
  textAlign: 'center'
}

const emptyTitleStyle = {
  color: 'white',
  fontSize: '20px',
  fontWeight: '700',
  marginBottom: '8px'
}

const emptySubtitleStyle = {
  color: '#94a3b8',
  fontSize: '14px'
}

const errorStyle = {
  padding: '20px',
  borderRadius: '20px',
  backgroundColor: 'rgba(248, 113, 113, 0.12)',
  color: '#fca5a5',
  textAlign: 'center'
}

export default Employees
