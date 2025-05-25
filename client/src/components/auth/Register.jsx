import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { FaUser, FaLock, FaUserPlus } from 'react-icons/fa'

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  
  const { register } = useContext(AuthContext)
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
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validate()) return
    
    setIsLoading(true)
    
    const success = await register(formData.username, formData.password)
    
    setIsLoading(false)
    
    if (success) {
      navigate('/login')
    }
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-primary-500 hover:text-primary-600">
              sign in to existing account
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
                placeholder="Choose a username"
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
                autoComplete="new-password"
                className={`form-input ${errors.password ? 'border-danger-500' : ''}`}
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <p className="form-error">{errors.password}</p>}
            </div>
            
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="form-label flex items-center">
                <FaLock className="mr-2 text-gray-500" /> Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                className={`form-input ${errors.confirmPassword ? 'border-danger-500' : ''}`}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
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
                <FaUserPlus className="mr-2" />
              )}
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register