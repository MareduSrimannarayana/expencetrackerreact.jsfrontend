import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { ExpensesContext} from './ExpensesContext'; 
function UpdateTransactionForm() {
    const { fetchExpenses } = useContext(ExpensesContext);
  const { state } = useLocation(); // Retrieve passed state (expense data)
  const navigate = useNavigate();

  // Initialize form fields with the passed expense data or empty strings
  const [title, setTitle] = useState(state?.title || '');
  const [amount, setAmount] = useState(state?.amount || '');
  const [date, setDate] = useState(state?.date || '');
  const [category, setCategory] = useState(state?.category || '');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedTransaction = { title, amount, date, category };

    try {
      // Send PUT request to update the expense
      const response = await axios.put(
        `https://ded4-122-171-35-182.ngrok-free.app/api/items/${state.id}`, // Use the id from the state
        updatedTransaction,
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.status === 200) {
        setSuccessMessage('Transaction updated successfully!');
        setErrorMessage('');
        fetchExpenses();
        navigate('/'); // Redirect to Home Page
      } else {
        setErrorMessage('Failed to update transaction. Please try again.');
        setSuccessMessage('');
      }
    } catch (error) {
      setErrorMessage('Failed to update transaction. Please try again.');
      setSuccessMessage('');
      console.error('Error updating transaction:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Update Transaction</h1>
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
          <button type="submit" className="btn btn-primary">Update</button>
        </center>
      </form>
    </div>
  );
}

export default UpdateTransactionForm;
