import React, { useState, useContext } from 'react'; // Added useContext import
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import TransactionForm from './TransactionForm';
import PieChart from './PieChart';
import { ExpensesContext, ExpensesProvider } from './ExpensesContext'; // Ensure ExpensesContext and ExpensesProvider are imported
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import UpdateTransactionForm from './UpdateTransactionForm';

import { FaEdit, FaHome, FaPlus,FaTrash } from 'react-icons/fa'; // Importing FaPlus for the floating button
import { ImPieChart } from 'react-icons/im';
import axios from 'axios';

// Home Component
export function Home() {
  // Access context values
  const { expenses, loading, error, fetchExpenses, deleteExpense } = useContext(ExpensesContext);

  if (loading) return <p>Loading... Please Wait !</p>;
  if (error) return <div><p>{error}</p></div>;

  const handleDelete = (expenseId) => {
    // Call deleteExpense function passed from context
    DeleteExpense(expenseId);
  };
  // Delete expense
  const DeleteExpense = (id) => {
    axios.delete(`https://ded4-122-171-35-182.ngrok-free.app/api/items/${id}`)
      .then((response) => {
        fetchExpenses();
    
      })
      .catch((error) => console.error("Error deleting expense:", error));
  };
  const tableStyle = {
    borderCollapse: "collapse",
    width: "90%",
    margin: "20px auto",
    
  };

  const cellStyle = {
    border: "2px solid black",
    padding: "10px",
    textAlign: "center",
  };

  return (
    <div className="home-page">
      <div>
        <h1>Expense List <button onClick={fetchExpenses} disabled={loading}><h5>Refresh</h5></button> </h1>
        

        {Array.isArray(expenses) && expenses.length > 0 ? (
          
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={cellStyle}>Title</th>
                <th style={cellStyle}>Amount</th>
                <th style={cellStyle}>Date</th>
                <th style={cellStyle}>Category</th>
                <th style={cellStyle}>Actions</th> {/* Add Actions column for buttons/icons */}
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id} >
                  <td style={cellStyle}>{expense.title}</td>
                  <td style={cellStyle}>₹{expense.amount}</td>
                  <td style={cellStyle}>{expense.date}</td>
                  <td style={cellStyle}>{expense.category}</td>

                  <td style={cellStyle}>
                    {/* Edit Button: Clickable row leading to update page */}
                    <Link to="/UpdateTransaction"  state={expense} className="btn btn-warning btn-sm" title="Edit">
                      <FaEdit/> Edit
                    </Link>
                    {/* Delete Button */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row click event when clicking delete
                        handleDelete(expense.id);
                      }}
                      className="btn btn-danger btn-sm ms-2"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No expenses available.</p>
        )}
      </div>

      {/* Floating Add Transaction Button */}
      <Link to="/Add_Expence" className="floating-button" title="Add Transaction">
        <FaPlus />
      </Link>
    </div>
  );
}

// App Component
function App() {
  const lightTheme = {
    backgroundColor: '#fff',
    textColor: '#000',
    labelColor: '#000',
    sliceColors: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
  };

  const darkTheme = {
    backgroundColor: '#333',
    textColor: '#fff',
    labelColor: '#fff',
    sliceColors: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
  };

  const [theme, setTheme] = useState(lightTheme);

  const toggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme.backgroundColor === '#fff' ? darkTheme : lightTheme
    );
  };

  return (
    <ExpensesProvider> {/* Wrap the app with the provider */}
      <div
        className="App"
        style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}
      >
        <Router>
          <header className="App-header">
            {/* Navbar */}
            <nav
              className={`navbar navbar-expand-lg ${
                theme.backgroundColor === '#fff' ? 'navbar-light bg-light' : 'navbar-dark bg-dark'
              }`}
            >
              <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                  My Website
                </Link>
                <button
                  className="navbar-toggler"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarResponsive"
                  aria-controls="navbarResponsive"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarResponsive">
                  <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                      <Link className="nav-link" to="/">
                        <FaHome /> Home
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/Add_Expence">
                        <FaPlus /> Add Expense
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/PieCharts">
                        <ImPieChart /> Statistics
                      </Link>
                    </li>
                  </ul>
                  <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                      <button onClick={toggleTheme} className="theme-toggle-button">
                        Toggle Theme
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>

            {/* Routes */}
            <Routes>
              <Route path="/" element={<Home theme={theme} />} />
              <Route path="/Add_Expence" element={<TransactionForm theme={theme} />} />
              <Route path="/PieCharts" element={<PieChart theme={theme} />} />
              <Route path="/UpdateTransaction" element={<UpdateTransactionForm theme={theme} />} />
            </Routes>
          </header>
        </Router>
      </div>
    </ExpensesProvider>
  );
}

export default App;
