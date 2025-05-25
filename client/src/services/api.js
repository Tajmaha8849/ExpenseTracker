import axios from 'axios'

// Set base URL for all requests
const api = axios.create({
  //baseURL: 'http://localhost:5000', // Change in production
  baseURL: 'https://expensetracker-1-bwda.onrender.com', // Change in production
  headers: {
    'Content-Type': 'application/json'
  }
})

// Set auth token for requests if available
const token = localStorage.getItem('token')
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

// Handle expired token errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      localStorage.removeItem('username')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
