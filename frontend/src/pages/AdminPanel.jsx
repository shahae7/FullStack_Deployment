import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

function AdminPanel() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }
    fetchUsers()
  }, [navigate])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await api.get('/admin/users')
      setUsers(response.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to load admin data.')
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('token')
        navigate('/login')
      }
    } finally {
      setLoading(false)
    }
  }

  const toggleSuperuser = async (userId) => {
    try {
      setMessage('')
      const response = await api.post(`/admin/users/${userId}/toggle-superuser`)
      setMessage(response.data.message)
      fetchUsers()
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to update user role.')
    }
  }

  const viewUser = async (userId) => {
    try {
      setError('')
      const response = await api.get(`/admin/users/${userId}`)
      setSelectedUser(response.data)
      setShowModal(true)
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to load user details.')
    }
  }

  return (
    <>
    <div className="min-h-screen bg-slate-950 pt-28 px-4 pb-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-3xl bg-slate-900/95 p-8 shadow-xl shadow-slate-950/40 border border-slate-700">
          <h1 className="text-3xl font-semibold text-white mb-2">Admin panel</h1>
          <p className="text-slate-400">Manage users and assign superuser permissions.</p>
        </div>

        {message && (
          <div className="mb-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-200">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-5 py-4 text-sm text-rose-200">
            {error}
          </div>
        )}

        <div className="overflow-x-auto rounded-3xl border border-slate-700 bg-slate-900/95 p-4">
          {loading ? (
            <p className="text-slate-300">Loading admin users...</p>
          ) : (
            <table className="min-w-full divide-y divide-slate-700 text-sm text-left text-slate-200">
              <thead className="border-b border-slate-700/80 text-slate-400">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Mobile</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Admin</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-800/60">
                    <td className="px-4 py-4">{user.id}</td>
                    <td className="px-4 py-4">{user.name}</td>
                    <td className="px-4 py-4">{user.email}</td>
                    <td className="px-4 py-4">{user.mobile || '-'}</td>
                    <td className="px-4 py-4">{user.status}</td>
                    <td className="px-4 py-4">{user.is_su ? 'Yes' : 'No'}</td>
                    <td className="px-4 py-4 flex gap-2">
                      <button
                        onClick={() => viewUser(user.id)}
                        className="rounded-full bg-slate-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-600"
                      >
                        View
                      </button>
                      <button
                        onClick={() => toggleSuperuser(user.id)}
                        className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-400"
                      >
                        {user.is_su ? 'Revoke' : 'Grant'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
    {showModal && selectedUser && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="max-w-lg w-full rounded-2xl bg-slate-900 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">User details</h3>
            <button onClick={() => setShowModal(false)} className="text-slate-400">Close</button>
          </div>
          <div className="space-y-2 text-slate-200">
            <p><strong>ID:</strong> {selectedUser.id}</p>
            <p><strong>Name:</strong> {selectedUser.name}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Mobile:</strong> {selectedUser.mobile || '-'}</p>
            <p><strong>Status:</strong> {selectedUser.status}</p>
            <p><strong>Admin:</strong> {selectedUser.is_su ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </div>
    )}
    </>
  )
}

export default AdminPanel
