import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import authApi from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('mm_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })
  const [token, setToken] = useState(() => localStorage.getItem('mm_token'))
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    const currentToken = localStorage.getItem('mm_token')
    if (!currentToken) {
      setUser(null)
      setIsLoading(false)
      return
    }

    try {
      const res = await authApi.getMe()
      if (res.success && res.data) {
        setUser(res.data)
        localStorage.setItem('mm_user', JSON.stringify(res.data))
      }
    } catch (err) {
      console.warn('Failed to verify session token:', err.message)
      localStorage.removeItem('mm_token')
      localStorage.removeItem('mm_user')
      setToken(null)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshUser()

    const handleUnauthorized = () => {
      setToken(null)
      setUser(null)
    }

    window.addEventListener('auth:unauthorized', handleUnauthorized)
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized)
    }
  }, [refreshUser])

  const login = async (username, password) => {
    const response = await authApi.login({ username, password })
    if (response.success && response.data?.token) {
      const { token: receivedToken, user: receivedUser } = response.data
      localStorage.setItem('mm_token', receivedToken)
      localStorage.setItem('mm_user', JSON.stringify(receivedUser))
      setToken(receivedToken)
      setUser(receivedUser)
      return response
    }
    throw new Error(response.message || 'Login gagal')
  }

  const logout = useCallback(() => {
    localStorage.removeItem('mm_token')
    localStorage.removeItem('mm_user')
    setToken(null)
    setUser(null)
  }, [])

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: Boolean(token && user),
    login,
    logout,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
