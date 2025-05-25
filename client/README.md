# Personal Expense Tracker

A full-stack web application for tracking personal expenses, built with React, Flask, and MongoDB.

## Features

- User authentication with JWT
- Add and manage expenses
- Categorize expenses
- View expense history with filtering and sorting
- Visualize spending with interactive charts
- Responsive design for all devices

## Tech Stack

### Frontend
- React
- React Router for navigation
- Chart.js for data visualization
- Tailwind CSS for styling
- Axios for API requests

### Backend
- Flask
- Flask-JWT-Extended for authentication
- Flask-CORS for cross-origin requests
- PyMongo for MongoDB integration
- bcrypt for password hashing

### Database
- MongoDB

## Project Structure

```
/client (React frontend)
  /public
  /src
    /components
      /auth
        Login.jsx
        Register.jsx
      /dashboard
        Dashboard.jsx
        ExpenseForm.jsx
        ExpenseList.jsx
        ExpenseCharts.jsx
      /layout
        Layout.jsx
    /context
      AuthContext.jsx
    /services
      api.js
    App.jsx
    main.jsx
    ...

/server (Flask backend)
  app.py (main file)
  requirements.txt
```

## Setup Instructions

### Prerequisites
- Node.js
- Python 3.8+
- MongoDB

### Frontend Setup
1. Navigate to the project root directory
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```

### Backend Setup
1. Navigate to the server directory
2. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
4. Start the Flask server:
   ```
   python app.py
   ```

## API Endpoints

- `POST /register` — Register new user
- `POST /login` — Login with JWT token
- `POST /add-expense` — Add expense (JWT required)
- `GET /get-expenses` — Get all expenses of logged-in user
- `GET /analytics` — Return total spending per category/month for charts

## Deployment

### Frontend
- Build the React app:
  ```
  npm run build
  ```
- Deploy the `/dist` directory to Vercel or Netlify

### Backend
- Deploy the Flask app to Render

## License
MIT