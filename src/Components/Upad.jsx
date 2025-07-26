import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GlobalAlert from './GlobalAlert';

function Upad() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [employees, setEmployees] = useState([]);
  const [upads, setUpads] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    employeeId: '',
    amount: '',
  });

  const [alert, setAlert] = useState({ status: false, message: '', type: 'success' });

  useEffect(() => {
    fetchEmployees();
    fetchUpads();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('https://attendanceserver.onrender.com/employees');
      setEmployees(res.data);
    } catch (err) {
      console.error('Error fetching employees:', err.message);
    }
  };

  const fetchUpads = async () => {
    try {
      const res = await axios.get('https://attendanceserver.onrender.com/upad');
      setUpads(res.data);
    } catch (err) {
      console.error('Error fetching upad list:', err.message);
    }
  };

  const handleDateChange = (e) => {
    setSelectedDate(new Date(e.target.value));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      date: selectedDate.toISOString().slice(0, 10),
      employeeId: formData.employeeId,
      amount: formData.amount,
    };

    try {
      if (editingId) {
        await axios.put(`https://attendanceserver.onrender.com/upad/${editingId}`, payload);
        setAlert({ status: true, message: 'Upad updated successfully', type: 'success' });
      } else {
        await axios.post('https://attendanceserver.onrender.com/upad', payload);
        setAlert({ status: true, message: 'Upad added successfully', type: 'success' });
      }

      setEditingId(null);
      setFormData({ employeeId: '', amount: '' });
      setShowForm(false);
      fetchUpads();

      setTimeout(() => setAlert({ status: false, message: '', type: '' }), 2500);
    } catch (err) {
      console.error('Error submitting upad:', err.message);
      setAlert({ status: true, message: 'Something went wrong', type: 'danger' });
    }
  };

  const handleEdit = (upad) => {
    const empId = typeof upad.employeeId === 'object' ? upad.employeeId._id : upad.employeeId;

    setFormData({
      employeeId: empId,
      amount: upad.amount,
    });

    setSelectedDate(new Date(upad.date));
    setEditingId(upad._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this Upad?')) {
      try {
        await axios.delete(`https://attendanceserver.onrender.com/upad/${id}`);
        fetchUpads();
        setAlert({ status: true, message: 'Deleted successfully', type: 'success' });
        setTimeout(() => setAlert({ status: false, message: '', type: '' }), 2500);
      } catch (err) {
        console.error('Error deleting upad:', err.message);
      }
    }
  };

  const handleToggleForm = () => {
    if (showForm) {
      // Reset form and go back
      setEditingId(null);
      setFormData({ employeeId: '', amount: '' });
    }
    setShowForm(!showForm);
  };

  return (
    <div className="container px-2 px-md-5">
      <div className="row my-4">
        <div className="col text-center">
          <h2 className='m-0'>Upad Management</h2>
        </div>
      </div>
      <div className="row mt-3 mb-3">
        <div className="col text-end">
          <button className="btn btn-success btn-sm" onClick={handleToggleForm}>
            {showForm ? '← Back to List' : '+ Add Upad'}
          </button>
        </div>
      </div>

      {alert.status && (
        <GlobalAlert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ status: false, message: '', type: '' })}
        />
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="row gy-2 mb-4">
          <div className="col-12 col-md-4">
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-control"
              value={selectedDate.toISOString().slice(0, 10)}
              onChange={handleDateChange}
              required
            />
          </div>

          <div className="col-12 col-md-4">
            <label className="form-label">Employee</label>
            <select
              className="form-select"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-4">
            <label className="form-label">Amount</label>
            <input
              type="number"
              name="amount"
              className="form-control"
              value={formData.amount}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="col-12 text-center">
            <button type="submit" className="btn btn-primary w-100 w-md-auto mt-2">
              {editingId ? 'Update' : 'Add'} Upad
            </button>
          </div>
        </form>
      )}

      {!showForm && (
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="table-light">
              <tr>
                <th>Date</th>
                <th>Employee</th>
                <th>Amount</th>
                <th style={{ width: '100px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {upads.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center text-muted">
                    No upad records found.
                  </td>
                </tr>
              ) : (
                upads.map((upad) => (
                  <tr key={upad._id}>
                    <td>{new Date(upad.date).toLocaleDateString()}</td>
                    <td>{upad.employeeId?.name || 'N/A'}</td>
                    <td>₹{upad.amount}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-1"
                        onClick={() => handleEdit(upad)}
                      >
                        ✏️
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(upad._id)}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Upad;
