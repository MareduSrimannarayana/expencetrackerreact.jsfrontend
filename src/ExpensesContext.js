import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const ExpensesContext = createContext();

export const ExpensesProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://ded4-122-171-35-182.ngrok-free.app/api/items', {
        headers: { 'ngrok-skip-browser-warning': 'true' },
      });
      if (response.status === 200) {
        setExpenses(response.data);
      } else {
        setError('Unexpected API response');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <ExpensesContext.Provider value={{ expenses, loading, error, fetchExpenses }}>
      {children}
    </ExpensesContext.Provider>
  );
};
