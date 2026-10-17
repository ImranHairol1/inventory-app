import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.username, form.password)
      navigate('/')
    } catch (err) {
      const data = err.response?.data
      const fieldErrors = data?.errors ? Object.values(data.errors).join('. ') : null
      setError(fieldErrors || data?.message || 'Login failed. Is the server running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <h1>Welcome back</h1>
        <p className="muted">Log in to manage your inventory</p>

        {error && <div className="alert">{error}</div>}

        <label>Username</label>
        <input name="username" value={form.username} onChange={handleChange} autoFocus />

        <label>Password</label>
        <input name="password" type="password" value={form.password} onChange={handleChange} />

        <button className="btn" disabled={loading}>
          {loading ? 'Logging in...' : 'Log in'}
        </button>

        <p className="muted center">
          No account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  )
}