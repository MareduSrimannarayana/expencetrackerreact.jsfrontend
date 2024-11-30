import React, { useState,useContext } from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { ExpensesContext} from './ExpensesContext'; 

function TransactionForm() {
  const { fetchExpenses } = useContext(ExpensesContext);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate(); // Initialize navigate hook

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newTransaction = { title, amount, date, category };
  

    try {
      // Sending POST request with form data to the backend API
      const response = await axios.post('https://ded4-122-171-35-182.ngrok-free.app/api/items', newTransaction, {
        headers: {
          'Content-Type': 'application/json', // Ensure the data is sent as JSON
        },
      });

      if (response.status === 201) {
        setSuccessMessage('Transaction added successfully!');
        setErrorMessage('');
        // Reset the form fields after successful submission
        setTitle('');
        setAmount('');
        setDate('');
        setCategory('');
        fetchExpenses();
    // Navigate back to the home page
    navigate('/');

      } else if (response.status === 204) {
        setSuccessMessage('Transaction added, but no content returned.');
        setErrorMessage('');
        
    // Navigate back to the home page
    navigate('/');
      }
    } catch (error) {
      setErrorMessage('Failed to add transaction. Please try again.');
      setSuccessMessage('');
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Add Transaction</h1>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      
      <form onSubmit={handleSubmit}>
        {/* Title Field */}
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Amount Field */}
        <div className="mb-3">
          <label htmlFor="amount" className="form-label">Amount</label>
          <input
            type="number"
            className="form-control"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        {/* Date Picker */}
        <div className="mb-3">
          <label htmlFor="date" className="form-label">Date</label>
          <input
            type="date"
            className="form-control"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        {/* Category Dropdown */}
        <div className="mb-3">
          <label htmlFor="category" className="form-label">Category</label>
          <select
            className="form-select"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            <option value="Groceries">Groceries</option>
            <option value="Transport">Transport</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Utilities">Utilities</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Submit Button */}
        <center>
        <button type="submit" className="btn btn-primary">Submit</button>
        </center>
      </form>
    </div>
  );
}

export default TransactionForm;
