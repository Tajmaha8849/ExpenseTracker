import { Link } from 'react-router-dom';
import { FaChartLine, FaLock, FaMobileAlt, FaChartPie } from 'react-icons/fa';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
          Take Control of Your <span className="text-primary-500">Finances</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Track your expenses, analyze spending patterns, and make smarter financial decisions with our intuitive expense tracker.
        </p>
        <div className="flex justify-center gap-4">
          {/* <Link
            to="/register"
            className="btn btn-primary text-lg px-8 py-3"
          >
            Get Started Free
          </Link> */}
          {/* <Link
            to="/login"
            className="btn bg-white text-primary-600 border border-primary-500 hover:bg-primary-50 text-lg px-8 py-3"
          >
            Sign In
          </Link> */}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card text-center p-6">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaChartLine className="text-2xl text-primary-500" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Easy Tracking</h3>
            <p className="text-gray-600">
              Record your expenses quickly and efficiently with our user-friendly interface.
            </p>
          </div>

          <div className="card text-center p-6">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaChartPie className="text-2xl text-primary-500" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Smart Analytics</h3>
            <p className="text-gray-600">
              Visualize your spending patterns with interactive charts and detailed reports.
            </p>
          </div>

          <div className="card text-center p-6">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaMobileAlt className="text-2xl text-primary-500" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Access Anywhere</h3>
            <p className="text-gray-600">
              Track your expenses on any device with our responsive web application.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Managing Your Expenses?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users who are taking control of their finances today.
          </p>
          {/* <Link
            to="/register"
            className="btn bg-white text-primary-600 hover:bg-primary-50 text-lg px-8 py-3"
          >
            Create Free Account
          </Link> */}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;