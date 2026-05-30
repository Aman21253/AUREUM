import { createContext, useContext, useEffect, useState } from 'react'
import { getMe } from '../api/userAPI'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token') || null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [token])

  const fetchUser = async () => {
    try {
      const res = await getMe()
      setUser(res.data)
    } catch {
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = (accessToken) => {
    localStorage.setItem('token', accessToken)
    setToken(accessToken)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  const isAdmin = user?.role === 'admin'
  const isLoggedIn = !!token

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      logout,
      isAdmin,
      isLoggedIn
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)