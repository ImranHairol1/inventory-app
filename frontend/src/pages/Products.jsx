import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export default function Products() {
  const { username, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="container">
      <header className="topbar">
        <h1>Inventory</h1>
        <div className="topbar-right">
          <span className="muted">Hi, {username}</span>
          <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
        </div>
      </header>
      <p className="muted">Product list coming next.</p>
    </div>
  )
}