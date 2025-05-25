import { useState } from 'react'
import { FaSearch, FaFilter, FaSortAmountDown, FaSortAmountUp, FaCalendarAlt } from 'react-icons/fa'
import DatePicker from 'react-datepicker'



const ExpenseList = ({ expenses, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState('date')
  const [sortDirection, setSortDirection] = useState('desc')
  const [filterCategory, setFilterCategory] = useState('')
  const [dateRange, setDateRange] = useState([null, null])
  const [startDate, endDate] = dateRange
  
  // Get unique categories from expenses
  const categories = [...new Set(expenses.map(expense => expense.category))].sort()
  
  // Filter and sort expenses
  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.note?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           expense.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory ? expense.category === filterCategory : true
    
    // Date range filter
    const expenseDate = new Date(expense.date)
    const matchesDateRange = (!startDate || expenseDate >= startDate) && 
                           (!endDate || expenseDate <= endDate)
    
    return matchesSearch && matchesCategory && matchesDateRange
  })
  
  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    if (sortField === 'amount') {
      return sortDirection === 'asc' ? a.amount - b.amount : b.amount - a.amount
    } else if (sortField === 'date') {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA
    } else if (sortField === 'category') {
      return sortDirection === 'asc'
        ? a.category.localeCompare(b.category)
        : b.category.localeCompare(a.category)
    }
    return 0
  })
  
  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date')
      }
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(date)
    } catch (error) {
      console.error('Date formatting error:', error, dateString)
      return 'Invalid date'
    }
  }
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }
  


  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    )
  }
  
  return (
    <div className="card animate-slide-up">
      <div className="flex flex-col sm:flex-row justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2 sm:mb-0">Your Expenses</h2>
        <div className="flex flex-wrap items-center gap-2">
          {/* Date Range Picker */}
          <div className="relative">
            <DatePicker
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => setDateRange(update)}
              className="py-2 pl-8 pr-4 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholderText="Select date range"
              isClearable={true}
            />
            <FaCalendarAlt className="absolute left-2.5 top-2.5 text-gray-400" />
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Search expenses..."
              className="py-2 pl-8 pr-4 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-2.5 top-2.5 text-gray-400" />
          </div>
          
          <div className="relative">
            <select
              className="py-2 pl-8 pr-4 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <FaFilter className="absolute left-2.5 top-2.5 text-gray-400" />
          </div>
        </div>
      </div>
      
      {sortedExpenses.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No expenses found. Add your first expense!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    className="flex items-center focus:outline-none" 
                    onClick={() => toggleSort('date')}
                  >
                    Date
                    {sortField === 'date' && (
                      sortDirection === 'asc' ? 
                        <FaSortAmountUp className="ml-1" /> : 
                        <FaSortAmountDown className="ml-1" />
                    )}
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    className="flex items-center focus:outline-none" 
                    onClick={() => toggleSort('category')}
                  >
                    Category
                    {sortField === 'category' && (
                      sortDirection === 'asc' ? 
                        <FaSortAmountUp className="ml-1" /> : 
                        <FaSortAmountDown className="ml-1" />
                    )}
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    className="flex items-center focus:outline-none" 
                    onClick={() => toggleSort('amount')}
                  >
                    Amount
                    {sortField === 'amount' && (
                      sortDirection === 'asc' ? 
                        <FaSortAmountUp className="ml-1" /> : 
                        <FaSortAmountDown className="ml-1" />
                    )}
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Note
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedExpenses.map((expense) => (
                <tr key={expense._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(expense.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="px-2 py-1 text-xs font-medium rounded-full" style={{ 
                      backgroundColor: getCategoryColor(expense.category, '0.1'),
                      color: getCategoryColor(expense.category, '1')
                    }}>
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(expense.amount)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {expense.note || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          

        </div>
      )}
    </div>
  )
}

// Helper function to get consistent colors for categories
function getCategoryColor(category, opacity = '1') {
  const colors = {
    'Food': `rgba(239, 68, 68, ${opacity})`, // red
    'Transportation': `rgba(16, 185, 129, ${opacity})`, // green
    'Housing': `rgba(59, 130, 246, ${opacity})`, // blue
    'Utilities': `rgba(139, 92, 246, ${opacity})`, // purple
    'Entertainment': `rgba(249, 115, 22, ${opacity})`, // orange
    'Shopping': `rgba(236, 72, 153, ${opacity})`, // pink
    'Healthcare': `rgba(14, 165, 233, ${opacity})`, // sky
    'Education': `rgba(168, 85, 247, ${opacity})`, // purple
    'Travel': `rgba(234, 179, 8, ${opacity})`, // yellow
    'Other': `rgba(107, 114, 128, ${opacity})`, // gray
  }
  
  return colors[category] || colors['Other']
}

export default ExpenseList