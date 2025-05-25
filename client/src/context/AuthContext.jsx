import { createContext, useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import api from '../services/api'
import jwtDecode from 'jwt-decode'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token')
      
      if (token) {
        try {
          // Check if token is expired
          const decodedToken = jwtDecode(token)
          const currentTime = Date.now() / 1000
          
          if (decodedToken.exp > currentTime) {
            // Set auth headers for all future requests
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`
            
            // Set user data
            setUser({
              id: localStorage.getItem('userId'),
              username: localStorage.getItem('username')
            })
            
            setIsAuthenticated(true)
          } else {
            // Token expired, clear storage
            localStorage.removeItem('token')
            localStorage.removeItem('userId')
            localStorage.removeItem('username')
          }
        } catch (error) {
          console.error('Invalid token', error)
          localStorage.removeItem('token')
          localStorage.removeItem('userId')
          localStorage.removeItem('username')
        }
      }
      
      setLoading(false)
    }
    
    checkAuth()
  }, [])

  const login = async (username, password) => {
    try {
      const response = await api.post('/login', { username, password })
      
      const { access_token, user_id, username: userName } = response.data
      
      // Save to localStorage
      localStorage.setItem('token', access_token)
      localStorage.setItem('userId', user_id)
      localStorage.setItem('username', userName)
      
      // Set auth header for future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
      
      setUser({ id: user_id, username: userName })
      setIsAuthenticated(true)
      
      toast.success('Login successful!')
      return true
    } catch (error) {
      const message = error.response?.data?.error || 'Login failed'
      toast.error(message)
      return false
    }
  }

  const register = async (username, password) => {
    try {
      await api.post('/register', { username, password })
      toast.success('Registration successful! You can now login.')
      return true
    } catch (error) {
      const message = error.response?.data?.error || 'Registration failed'
      toast.error(message)
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('username')
    
    delete api.defaults.headers.common['Authorization']
    
    setUser(null)
    setIsAuthenticated(false)
    
    toast.info('You have been logged out')
  }

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        user, 
        loading,
        login, 
        register, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

