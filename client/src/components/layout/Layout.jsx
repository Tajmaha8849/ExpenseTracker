import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { FaSignOutAlt, FaChartLine, FaUserPlus, FaSignInAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const Layout = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()
  
  const handleLogout = () => {
    logout()
    navigate('/login')
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <FaChartLine className="text-primary-500 text-2xl mr-2" />
            <h1 className="text-xl font-semibold text-gray-900">Expense Tracker</h1>
          </Link>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-600">
                  Welcome, <span className="font-medium text-gray-900">{user?.username}</span>
                </span>
                <Link to="/dashboard" className="btn btn-primary flex items-center text-sm">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn btn-danger flex items-center text-sm"
                >
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </button>
              </>
            ) : location.pathname !== '/login' && location.pathname !== '/register' ? (
              <>
                <Link to="/login" className="btn btn-primary flex items-center text-sm">
                  <FaSignInAlt className="mr-2" />
                  Sign In
                </Link>
                <Link to="/register" className="btn bg-white text-primary-600 border border-primary-500 hover:bg-primary-50 flex items-center text-sm">
                  <FaUserPlus className="mr-2" />
                  Register
                </Link>
              </>
            ) : null}
          </div>
        </div>
      </header>
      
      <main className="flex-grow">
        <Outlet />
      </main>
      
      <footer className="bg-white py-4 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Personal Expense Tracker. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Layout