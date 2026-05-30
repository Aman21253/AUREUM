import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth()

  if (loading) return null

  if (!isLoggedIn) return <Navigate to="/login" replace />

  return children
}

export const AdminRoute = ({ children }) => {
  const { isAdmin, loading } = useAuth()

  if (loading) return null

  if (!isAdmin) return <Navigate to="/" replace />

  return children
}