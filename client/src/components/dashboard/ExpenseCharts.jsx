import { Bar, Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'
import { FaChartPie, FaChartBar } from 'react-icons/fa'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

const ExpenseCharts = ({ analytics, isLoading }) => {
  const { category_totals, monthly_totals } = analytics
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    )
  }
  
  if (!category_totals.length && !monthly_totals.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No data available for charts. Add some expenses first!</p>
      </div>
    )
  }
  
  // Colors for chart
  const chartColors = [
    'rgba(52, 152, 219, 0.8)', // blue
    'rgba(46, 204, 113, 0.8)', // green
    'rgba(231, 76, 60, 0.8)',  // red
    'rgba(155, 89, 182, 0.8)', // purple
    'rgba(241, 196, 15, 0.8)', // yellow
    'rgba(230, 126, 34, 0.8)', // orange
    'rgba(26, 188, 156, 0.8)', // turquoise
    'rgba(52, 73, 94, 0.8)',   // dark blue
    'rgba(149, 165, 166, 0.8)', // gray
    'rgba(211, 84, 0, 0.8)',    // dark orange
  ]
  
  // Format category data for pie chart
  const categoryChartData = {
    labels: category_totals.map(item => item._id),
    datasets: [
      {
        label: 'Spending by Category',
        data: category_totals.map(item => item.total),
        backgroundColor: chartColors,
        borderWidth: 1,
      },
    ],
  }
  
  // Format monthly data for bar chart
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  
  const monthlyChartData = {
    labels: monthly_totals.map(item => `${monthNames[item._id.month - 1]} ${item._id.year}`),
    datasets: [
      {
        label: 'Monthly Spending',
        data: monthly_totals.map(item => item.total),
        backgroundColor: 'rgba(52, 152, 219, 0.8)',
        borderColor: 'rgba(52, 152, 219, 1)',
        borderWidth: 1,
      },
    ],
  }
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== undefined) {
              label += new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(context.raw);
            }
            return label;
          }
        }
      }
    },
  }
  
  // Calculate total spending
  const totalSpending = category_totals.reduce((sum, item) => sum + item.total, 0)
  
  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Summary Card */}
        <div className="lg:col-span-2">
          <div className="card bg-primary-500 text-white mb-8">
            <h3 className="text-xl font-semibold mb-2">Spending Summary</h3>
            <div className="text-3xl font-bold">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(totalSpending)}
            </div>
            <p className="mt-2 text-primary-100">
              Across {category_totals.length} categories and {monthly_totals.length} months
            </p>
          </div>
        </div>
        
        {/* Category Breakdown */}
        <div className="card">
          <div className="flex items-center mb-4">
            <FaChartPie className="text-primary-500 mr-2" />
            <h3 className="text-lg font-semibold">Spending by Category</h3>
          </div>
          <div className="h-64">
            <Pie data={categoryChartData} options={chartOptions} />
          </div>
        </div>
        
        {/* Monthly Breakdown */}
        <div className="card">
          <div className="flex items-center mb-4">
            <FaChartBar className="text-primary-500 mr-2" />
            <h3 className="text-lg font-semibold">Monthly Spending</h3>
          </div>
          <div className="h-64">
            <Bar data={monthlyChartData} options={chartOptions} />
          </div>
        </div>
        
        {/* Top Expenses */}
        <div className="lg:col-span-2 card">
          <h3 className="text-lg font-semibold mb-4">Category Breakdown</h3>
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Percentage
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {category_totals.map((category, index) => (
                  <tr key={category._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: chartColors[index % chartColors.length] }}></div>
                        <div className="text-sm font-medium text-gray-900">{category._id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD'
                      }).format(category.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {(category.total / totalSpending * 100).toFixed(1)}%
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="h-full rounded-full" 
                          style={{ 
                            width: `${(category.total / totalSpending * 100)}%`,
                            backgroundColor: chartColors[index % chartColors.length]
                          }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExpenseCharts