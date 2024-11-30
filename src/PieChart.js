import React, { useState, useContext } from "react";
import { Pie, Bar } from "react-chartjs-2";
import { ExpensesContext } from "./ExpensesContext";
import { Chart as ChartJS, ArcElement, BarElement, Tooltip, Legend, CategoryScale, LinearScale } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

// Register Chart.js components and plugins
ChartJS.register(ArcElement, BarElement, Tooltip, Legend, CategoryScale, LinearScale, ChartDataLabels);

const DropdownWithCharts = ({ theme }) => {
  // Dropdown states
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState(""); // New state for year

  // Context for expenses
  const { expenses } = useContext(ExpensesContext);

  // Extract unique categories and years from expenses
  const categories = [...new Set(expenses.map((expense) => expense.category))];
  const years = [...new Set(expenses.map((expense) => new Date(expense.date).getFullYear()))]; // Extract unique years

  // Month options
  const months = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ];

  // Filtered expenses for Bar Chart and Pie Chart based on dropdowns (category, month, year)
  const filteredExpenses = expenses.filter((expense) => {
    const expenseMonth = new Date(expense.date).toLocaleString("default", { month: "long" });
    const expenseYear = new Date(expense.date).getFullYear();
    return (
      (!selectedCategory || expense.category === selectedCategory) &&
      (!selectedMonth || expenseMonth === selectedMonth) &&
      (!selectedYear || expenseYear === parseInt(selectedYear))
    );
  });

  // Calculate data for Pie Chart (unaffected by dropdowns)
  const pieChartData = expenses.reduce((acc, expense) => {
    const amount = parseFloat(expense.amount) || 0;
    acc[expense.category] = (acc[expense.category] || 0) + amount;
    return acc;
  }, {});

  // Calculate data for Bar Chart (affected by dropdowns)
  const barChartData = filteredExpenses.reduce((acc, expense) => {
    const amount = parseFloat(expense.amount) || 0;
    acc[expense.category] = (acc[expense.category] || 0) + amount;
    return acc;
  }, {});

  // Data for Pie Chart
  const pieData = {
    labels: Object.keys(pieChartData),
    datasets: [
      {
        label: "Total Cost : ₹",
        data: Object.values(pieChartData),
        backgroundColor: theme.sliceColors,
        hoverBackgroundColor: theme.sliceColors,
      },
    ],
  };

  // Data for Bar Chart
  const barData = {
    labels: Object.keys(barChartData),
    datasets: [
      {
        label: "Total Cost : ₹",
        data: Object.values(barChartData),
        backgroundColor: theme.sliceColors,
        hoverBackgroundColor: theme.sliceColors,
      },
    ],
  };

  // Chart options for Pie Chart
  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: theme.labelColor,
        },
      },
      datalabels: {
        formatter: (value, context) => {
          const total = context.chart._metasets[0].total;
          const percentage = ((value / total) * 100).toFixed(2);
          return `${percentage}%`;
        },
        color: theme.textColor,
        font: {
          weight: "bold",
        },
      },
    },
  };

  // Chart options for Bar Chart
  const options2 = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        labels: {
          color: theme.labelColor,
        },
      },
      datalabels: {
        formatter: (value, context) => {
          return `₹ ${value}`;
        },
        color: theme.textColor,
        font: {
          weight: "bold",
        },
      },
    },
  };
  const tableStyle = {
    borderCollapse: "collapse",
    width: "90%",
    margin: "20px auto",

  };

  const cellStyle = {
    border: "1px solid black",
    padding: "10px",
    textAlign: "center",
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Dropdowns */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "20px" }}>
        <div>
          <label htmlFor="category" style={{ marginRight: "10px" }}>
            Select Category:
          </label>
          <select id="category" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="">-- All category --</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="month" style={{ marginRight: "10px" }}>
            Select Month:
          </label>
          <select id="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
            <option value="">-- All months --</option>
            {months.map((month, index) => (
              <option key={index} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="year" style={{ marginRight: "10px" }}>
            Select Year:
          </label>
          <select id="year" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
            <option value="">-- All year --</option>
            {years.map((year, index) => (
              <option key={index} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chart and Table Section */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {/* Bar Chart (Filtered) */}
        <div className="chart-container" style={{ flex: "1 1 45%" }}>
          <h3>Filtered Expenses (Bar Chart)</h3>
          {Object.keys(barChartData).length > 0 ? (
            <div className="chart-wrapper-bar">
              <Bar data={barData} options={options2} />
            </div>
          ) : (
            <div className="chart-wrapper-bar">
              <Bar
                data={{
                  labels: ["No Data"],
                  datasets: [
                    {
                      label: "Total Bar Cost : ₹ 0.00",
                      data: [0],
                      backgroundColor: "#ddd",
                      hoverBackgroundColor: "#ddd",
                    },
                  ],
                }}
                options={options2}
              />
            </div>
          )}
        </div>

        {/* Table of Filtered Expenses */}
        <div style={{ flex: "1 1 45%" }}>
          <h3>Filtered Expenses (Table)</h3>
          {filteredExpenses.length > 0 ? (
            <table style={tableStyle} className="styled-table" >
              <thead>
                <tr>
                  <th style={cellStyle}>Title</th>
                  <th style={cellStyle}>Amount</th>
                  <th style={cellStyle}>Date</th>
                  <th style={cellStyle}>Category</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((expense) => (
                  <tr key={expense.id}>
                    <td style={cellStyle}>   {expense.title}</td>
                    <td style={cellStyle}>₹{expense.amount}</td>
                    <td style={cellStyle}>{new Date(expense.date).toLocaleDateString()}</td>
                    <td style={cellStyle}>{expense.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No filtered expenses available to display.</p>
          )}
        </div>
      </div>

      {/* Pie Chart (Unfiltered) */}
      <div className="chart-container">
        <h3>Total Overall Expenses</h3>
        {Object.keys(pieChartData).length > 0 ? (
          <div className="chart-wrapper">
            <Pie data={pieData} options={options} />
          </div>
        ) : (
          <p>No transactions available to display in the pie chart.</p>
        )}
      </div>

      {/* Floating Add Transaction Button */}
      <Link to="/Add_Expence" className="floating-button" title="Add Transaction">
        <FaPlus />
      </Link>
    </div>
  );
};

export default DropdownWithCharts;
