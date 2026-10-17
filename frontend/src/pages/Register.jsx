import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      await register({ username: form.username, email: form.email, password: form.password })
      navigate('/')
    } catch (err) {
      const data = err.response?.data
      const fieldErrors = data?.errors ? Object.values(data.errors).join('. ') : null
      setError(fieldErrors || data?.message || 'Registration failed. Is the server running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <h1>Create account</h1>
        <p className="muted">Start tracking your inventory</p>

        {error && <div className="alert">{error}</div>}

        <label>Username</label>
        <input name="username" value={form.username} onChange={handleChange} autoFocus />

        <label>Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} />

        <label>Password</label>
        <input name="password" type="password" value={form.password} onChange={handleChange} />

        <label>Confirm password</label>
        <input name="confirm" type="password" value={form.confirm} onChange={handleChange} />

        <button className="btn" disabled={loading}>
          {loading ? 'Creating account...' : 'Register'}
        </button>

        <p className="muted center">
          Already registered? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  )
}