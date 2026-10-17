import { createContext, useContext, useState } from 'react'
import api from './api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [username, setUsername] = useState(localStorage.getItem('username'))

  const saveSession = (data) => {
    localStorage.setItem('token', data.token)
    localStorage.setItem('username', data.username)
    setToken(data.token)
    setUsername(data.username)
  }

  const login = async (usernameInput, password) => {
    const { data } = await api.post('/auth/login', { username: usernameInput, password })
    saveSession(data)
  }

  const register = async (form) => {
    const { data } = await api.post('/auth/register', form)
    saveSession(data)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    setToken(null)
    setUsername(null)
  }

  return (
    <AuthContext.Provider value={{ token, username, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)