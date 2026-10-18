import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export default function Layout() {
  const { username, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(window.innerWidth > 800)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="layout">
      <aside className={`sidebar ${open ? '' : 'sidebar-hidden'}`}>
        <div className="sidebar-brand">📦 Inventory</div>
        <nav>
          <NavLink to="/" end className="nav-link">Inventory</NavLink>
          <NavLink to="/logs" className="nav-link">Change log</NavLink>
        </nav>
        <div className="sidebar-footer">
          <span className="muted">Signed in as <strong>{username}</strong></span>
          <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      <div className="main">
        <button className="menu-toggle" onClick={() => setOpen(!open)}>
          {open ? '✕ Hide menu' : '☰ Show menu'}
        </button>
        <Outlet />
      </div>
    </div>
  )
}