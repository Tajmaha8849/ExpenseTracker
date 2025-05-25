import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa'

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    
    // Clear error when user types
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      })
    }
  }
  
  const validate = () => {
    const newErrors = {}
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validate()) return
    
    setIsLoading(true)
    
    const success = await login(formData.username, formData.password)
    
    setIsLoading(false)
    
    if (success) {
      navigate('/dashboard')
    }
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/register" className="font-medium text-primary-500 hover:text-primary-600">
              create a new account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label htmlFor="username" className="form-label flex items-center">
                <FaUser className="mr-2 text-gray-500" /> Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                className={`form-input ${errors.username ? 'border-danger-500' : ''}`}
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
              />
              {errors.username && <p className="form-error">{errors.username}</p>}
            </div>
            
            <div className="mb-4">
              <label htmlFor="password" className="form-label flex items-center">
                <FaLock className="mr-2 text-gray-500" /> Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                className={`form-input ${errors.password ? 'border-danger-500' : ''}`}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <p className="form-error">{errors.password}</p>}
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              className="btn btn-primary w-full flex justify-center items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading-spinner mr-2" />
              ) : (
                <FaSignInAlt className="mr-2" />
              )}
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login