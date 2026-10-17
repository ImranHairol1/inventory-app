import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
})

// Add the saved token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// If the server rejects the token, log the user out
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const isAuthCall = error.config?.url?.startsWith('/auth')
    if ((status === 401 || status === 403) && !isAuthCall) {
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api