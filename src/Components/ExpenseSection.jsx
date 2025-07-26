import React, { useState } from 'react';
import axios from 'axios';

function ExpenseSection({ current, setCurrent }) {
  const [expense, setExpense] = useState({ date: '', type: '', amount: '' });

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`https://attendanceserver.onrender.com/site/${current._id}/expense`, expense);
    const res = await axios.get(`https://attendanceserver.onrender.com/site/${current._id}`);
    setCurrent(res.data);
    setExpense({ date: '', type: '', amount: '' });
  };

  const deleteExpense = async (expId) => {
    await axios.delete(`https://attendanceserver.onrender.com/site/${current._id}/expense/${expId}`);
    const res = await axios.get(`https://attendanceserver.onrender.com/site/${current._id}`);
    setCurrent(res.data);
  };

  const currencyFormat = (num) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(num);

  return (
    <div>
      <h6>Add Expense</h6>
      <form onSubmit={handleExpenseSubmit} className="row g-2 mb-3">
        <div className="col-12 col-sm-4">
          <input
            type="date"
            className="form-control"
            value={expense.date}
            onChange={(e) => setExpense({ ...expense, date: e.target.value })}
            required
          />
        </div>
        <div className="col-12 col-sm-4">
          <input
            type="text"
            className="form-control"
            placeholder="Type of expense"
            value={expense.type}
            onChange={(e) => setExpense({ ...expense, type: e.target.value })}
            required
          />
        </div>
        <div className="col-8 col-sm-3">
          <input
            type="number"
            className="form-control"
            placeholder="Amount"
            value={expense.amount}
            onChange={(e) => setExpense({ ...expense, amount: e.target.value })}
            required
          />
        </div>
        <div className="col-4 col-sm-1">
          <button className="btn btn-success w-100">Add</button>
        </div>
      </form>

      <div className="table-responsive">
        <table className="table table-sm table-bordered">
          <thead className="table-light">
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {current.expenses.map((exp) => (
              <tr key={exp._id}>
                <td>{new Date(exp.date).toLocaleDateString()}</td>
                <td>{exp.type}</td>
                <td>{currencyFormat(exp.amount)}</td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => deleteExpense(exp._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {current.expenses.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center text-muted">
                  No expenses yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ExpenseSection;
