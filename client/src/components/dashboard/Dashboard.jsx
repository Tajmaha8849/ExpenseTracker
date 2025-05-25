import { useState, useEffect, useContext } from 'react'
import api from '../../services/api'
import { toast } from 'react-toastify'
import { AuthContext } from '../../context/AuthContext'
import ExpenseForm from './ExpenseForm'
import ExpenseList from './ExpenseList'
import ExpenseCharts from './ExpenseCharts'
import { FaPlus, FaChartPie, FaList } from 'react-icons/fa'

const Dashboard = () => {
  const [expenses, setExpenses] = useState([])
  const [analytics, setAnalytics] = useState({
    category_totals: [],
    monthly_totals: []
  })
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('list') // 'list', 'add', 'charts'
  
  const { user } = useContext(AuthContext)
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        
        // Fetch expenses
        const expensesResponse = await api.get('/get-expenses')
        setExpenses(expensesResponse.data)
        
        // Fetch analytics
        const analyticsResponse = await api.get('/analytics')
        setAnalytics(analyticsResponse.data)
        
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Failed to fetch expense data')
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [])
  
  const handleAddExpense = async (expenseData) => {
    try {
      const response = await api.post('/add-expense', expenseData)
      
      if (response.status === 201) {
        // Refetch expenses and analytics to get updated data
        const expensesResponse = await api.get('/get-expenses')
        setExpenses(expensesResponse.data)
        
        const analyticsResponse = await api.get('/analytics')
        setAnalytics(analyticsResponse.data)
        
        toast.success('Expense added successfully')
        return true
      }
    } catch (error) {
      console.error('Error adding expense:', error)
      toast.error('Failed to add expense')
      return false
    }
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Financial Dashboard</h1>
        <p className="text-gray-600">
          Track, manage, and analyze your personal expenses
        </p>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8">
        <button
          onClick={() => setActiveTab('list')}
          className={`px-4 py-2 font-medium text-sm flex items-center mr-4 ${
            activeTab === 'list'
              ? 'text-primary-600 border-b-2 border-primary-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <FaList className="mr-2" /> Expense List
        </button>
        <button
          onClick={() => setActiveTab('add')}
          className={`px-4 py-2 font-medium text-sm flex items-center mr-4 ${
            activeTab === 'add'
              ? 'text-primary-600 border-b-2 border-primary-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <FaPlus className="mr-2" /> Add Expense
        </button>
        <button
          onClick={() => setActiveTab('charts')}
          className={`px-4 py-2 font-medium text-sm flex items-center ${
            activeTab === 'charts'
              ? 'text-primary-600 border-b-2 border-primary-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <FaChartPie className="mr-2" /> Analytics
        </button>
      </div>
      
      {/* Tab Content */}
      <div className="animate-fade-in">
        {activeTab === 'list' && (
          <ExpenseList expenses={expenses} isLoading={isLoading} />
        )}
        
        {activeTab === 'add' && (
          <ExpenseForm onAddExpense={handleAddExpense} />
        )}
        
        {activeTab === 'charts' && (
          <ExpenseCharts analytics={analytics} isLoading={isLoading} />
        )}
      </div>
    </div>
  )
}

export default Dashboard