import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Products from './pages/Products'
import ProductForm from './pages/ProductForm'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<ProtectedRoute><Products /></ProtectedRoute>} />
      <Route path="/products/new" element={<ProtectedRoute><ProductForm /></ProtectedRoute>} />
      <Route path="/products/:id/edit" element={<ProtectedRoute><ProductForm /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}