import { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Dashboard from './components/dashboard/Dashboard'
import LandingPage from './components/home/LandingPage'
import { AuthContext } from './context/AuthContext'
import Layout from './components/layout/Layout'

// Private route component
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext)

  if (loading) {
    // Show a loader or null while checking auth state
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return children
}
const isLoggedIn = !!localStorage.getItem('token'); // or check cookie
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
      </Route>
    </Routes>
  )
}

export default App