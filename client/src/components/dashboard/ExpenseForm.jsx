import { useState } from 'react'
import DatePicker from 'react-datepicker'
import { FaCalendarAlt, FaTags, FaDollarSign, FaFileAlt, FaSave } from 'react-icons/fa'

const CATEGORIES = [
  'Food',
  'Transportation',
  'Housing',
  'Utilities',
  'Entertainment',
  'Shopping',
  'Healthcare',
  'Education',
  'Travel',
  'Other'
]

const ExpenseForm = ({ onAddExpense }) => {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    note: '',
    date: new Date()
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleChange = (e) => {
    const { name, value } = e.target
    
    setFormData({
      ...formData,
      [name]: value
    })
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      })
    }
  }
  
  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      date
    })
    
    // Clear date error
    if (errors.date) {
      setErrors({
        ...errors,
        date: ''
      })
    }
  }
  
  const validate = () => {
    const newErrors = {}
    
    if (!formData.amount) {
      newErrors.amount = 'Amount is required'
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number'
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required'
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validate()) return
    
    setIsSubmitting(true)
    
    const expenseData = {
      ...formData,
      amount: parseFloat(formData.amount),
      date: formData.date.toISOString()
    }
    
    const success = await onAddExpense(expenseData)
    
    setIsSubmitting(false)
    
    if (success) {
      // Reset form
      setFormData({
        amount: '',
        category: '',
        note: '',
        date: new Date()
      })
    }
  }
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className="card animate-slide-up">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Add New Expense</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="amount" className="form-label flex items-center">
              <FaDollarSign className="mr-2 text-gray-500" /> Amount
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">$</span>
              </div>
              <input
                type="text"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                className={`form-input pl-8 ${errors.amount ? 'border-danger-500' : ''}`}
              />
            </div>
            {errors.amount && <p className="form-error">{errors.amount}</p>}
          </div>
          
          <div className="mb-4">
            <label htmlFor="category" className="form-label flex items-center">
              <FaTags className="mr-2 text-gray-500" /> Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`form-input ${errors.category ? 'border-danger-500' : ''}`}
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            {errors.category && <p className="form-error">{errors.category}</p>}
          </div>
          
          <div className="mb-4">
            <label htmlFor="note" className="form-label flex items-center">
              <FaFileAlt className="mr-2 text-gray-500" /> Note (Optional)
            </label>
            <textarea
              id="note"
              name="note"
              value={formData.note}
              onChange={handleChange}
              placeholder="Add details about this expense"
              className="form-input h-24"
            />
          </div>
          
          <div className="mb-6">
            <label className="form-label flex items-center">
              <FaCalendarAlt className="mr-2 text-gray-500" /> Date
            </label>
            <DatePicker
              selected={formData.date}
              onChange={handleDateChange}
              className={`form-input w-full ${errors.date ? 'border-danger-500' : ''}`}
              maxDate={new Date()}
              dateFormat="MMMM d, yyyy"
            />
            {errors.date && <p className="form-error">{errors.date}</p>}
          </div>
          
          <div>
            <button
              type="submit"
              className="btn btn-primary w-full flex justify-center items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="loading-spinner mr-2" />
              ) : (
                <FaSave className="mr-2" />
              )}
              {isSubmitting ? 'Saving...' : 'Save Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ExpenseForm