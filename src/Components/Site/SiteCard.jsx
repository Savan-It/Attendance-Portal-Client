import React, { useState } from 'react';
import { currencyFormat } from '../../utils/currency';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function SiteCard({ site, refreshSites }) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [activeForm, setActiveForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [newPayment, setNewPayment] = useState({ date: '', amount: '' });

  const totalPaid = site.clientPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalExpenses = site.expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = totalPaid - totalExpenses;
  const totalManpower = site.manpower?.reduce((sum, emp) => sum + emp.total, 0) || 0;

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (editingPayment) {
      await axios.delete(`https://attendanceserver.onrender.com/site/${site._id}/payment/${editingPayment._id}`);
    }
    await axios.post(`https://attendanceserver.onrender.com/site/${site._id}/payment`, newPayment);
    setActiveForm(false);
    setEditingPayment(null);
    setNewPayment({ date: '', amount: '' });
    refreshSites();
  };

  const handleEditClick = (payment) => {
    setActiveForm(true);
    setEditingPayment(payment);
    setNewPayment({ date: payment.date.slice(0, 10), amount: payment.amount });
  };

  const handleDeletePayment = async (paymentId) => {
    await axios.delete(`https://attendanceserver.onrender.com/site/${site._id}/payment/${paymentId}`);
    refreshSites();
  };

  return (
    <div className="card shadow-sm mb-3">
      <div
        className="card-header d-flex justify-content-between align-items-center py-3"
        onClick={() => setExpanded(!expanded)}
        style={{ cursor: 'pointer' }}
      >
        <div>
          <h3 className="mb-2">{site.name}</h3>
          <div className="d-flex gap-2 flex-wrap">
            <span className="badge py-1 bg-success">Paid: {currencyFormat(totalPaid)}</span>
            <span className="badge py-1 bg-danger">Expenses: {currencyFormat(totalExpenses)}</span>
            <span className="badge py-1 bg-warning text-dark">Remaining: {currencyFormat(remaining)}</span>
            <span className="badge py-1 bg-info text-dark">Manpower: {currencyFormat(totalManpower)}</span>
          </div>
        </div>
        <div>
          {expanded ? '▲' : '▼'}
        </div>
      </div>

      {expanded && (
        <div className="card-body">
          <h6 className="mt-2">Payment History</h6>
          <ul className="list-group list-group-flush mb-3">
            {site.clientPayments.map((p) => (
              <li
                key={p._id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span>{new Date(p.date).toLocaleDateString()}</span>
                <span className="d-flex gap-2 align-items-center">
                  <strong>{currencyFormat(p.amount)}</strong>
                  <button className="btn btn-sm btn-outline-primary" onClick={() => handleEditClick(p)}>✏️</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeletePayment(p._id)}>🗑️</button>
                </span>
              </li>
            ))}
            {site.clientPayments.length === 0 && (
              <li className="list-group-item text-muted text-center">No payments yet.</li>
            )}
          </ul>

          {/* Add/Edit Payment Form */}
          {activeForm ? (
            <form onSubmit={handlePaymentSubmit} className="mb-3">
              <div className="row g-2">
                <div className="col-12 col-sm-6">
                  <input
                    type="date"
                    className="form-control"
                    value={newPayment.date}
                    onChange={(e) => setNewPayment({ ...newPayment, date: e.target.value })}
                    required
                  />
                </div>
                <div className="col-12 col-sm-6">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Amount"
                    value={newPayment.amount}
                    onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="d-flex justify-content-between mt-2 gap-2 flex-wrap">
                <button type="submit" className="btn btn-success w-100 w-sm-auto">Save</button>
                <button
                  type="button"
                  className="btn btn-secondary w-100 w-sm-auto"
                  onClick={() => {
                    setActiveForm(false);
                    setEditingPayment(null);
                    setNewPayment({ date: '', amount: '' });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button className="btn btn-outline-info btn-sm w-100 mb-3" onClick={() => setActiveForm(true)}>➕ Add Payment</button>
          )}

          {/* View Expenses Button */}
          <button
            className="btn btn-success w-100"
            onClick={() => navigate(`/site/${site._id}`)}
          >
            📄 View Detailed Expenses
          </button>
        </div>
      )}
    </div>
  );
}

export default SiteCard;
