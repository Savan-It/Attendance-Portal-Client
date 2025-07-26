import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Employee() {
  const [employees, setEmployees] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: '', employeeType: '', dailySalary: '' });
  const [editForm, setEditForm] = useState({ name: '', employeeType: '', dailySalary: '' });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('https://attendanceserver.onrender.com/employees');
      setEmployees(res.data);
    } catch (err) {
      console.error('Error fetching employees:', err.message);
    }
  };

  const handleEditClick = (employee) => {
    setEditingId(employee._id);
    setEditForm({
      name: employee.name,
      employeeType: employee.employeeType,
      dailySalary: employee.dailySalary,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleEditSubmit = async (id) => {
    try {
      await axios.put(`https://attendanceserver.onrender.com/employees/${id}`, editForm);
      setEditingId(null);
      fetchEmployees();
    } catch (error) {
      console.error('Error updating employee:', error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await axios.delete(`https://attendanceserver.onrender.com/employees/${id}`);
        fetchEmployees();
      } catch (error) {
        console.error('Error deleting employee:', error.message);
      }
    }
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee({ ...newEmployee, [name]: value });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://attendanceserver.onrender.com/employees', newEmployee);
      setNewEmployee({ name: '', employeeType: '', dailySalary: '' });
      setShowAddForm(false);
      fetchEmployees();
    } catch (error) {
      console.error('Error adding employee:', error.message);
    }
  };

  return (
    <div className="container py-3">
      <div className="row my-4">
        <div className="col text-center">
          <h2 className='m-0'>Employees</h2>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col text-end">
        <button className="btn btn-success btn-sm" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : '+ Add'}
        </button>
        </div>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="bg-light p-3 rounded mb-3">
          <div className="mb-2">
            <input
              type="text"
              name="name"
              value={newEmployee.name}
              onChange={handleAddChange}
              className="form-control"
              placeholder="Name"
              required
            />
          </div>
          <div className="mb-2">
            <select
              className="form-select"
              name="employeeType"
              value={newEmployee.employeeType}
              onChange={handleAddChange}
              required
            >
              <option value="">Select Type</option>
              <option value="laborer">Laborer</option>
              <option value="carftsman">Craftsman</option>
            </select>
          </div>
          <div className="mb-2">
            <input
              type="number"
              name="dailySalary"
              value={newEmployee.dailySalary}
              onChange={handleAddChange}
              className="form-control"
              placeholder="Daily Salary"
              min="0"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Save Employee
          </button>
        </form>
      )}

      {/* Employee List as Cards */}
      {employees.length > 0 ? (
        <div className="employee-list">
          {employees.map((emp) => (
            <div className="card mb-2 p-2" key={emp._id}>
              {editingId === emp._id ? (
                <>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    className="form-control mb-2"
                    placeholder="Name"
                  />
                  <select
                    name="employeeType"
                    value={editForm.employeeType}
                    onChange={handleEditChange}
                    className="form-select mb-2"
                  >
                    <option value="laborer">Laborer</option>
                    <option value="carftsman">Craftsman</option>
                  </select>
                  <input
                    type="number"
                    name="dailySalary"
                    value={editForm.dailySalary}
                    onChange={handleEditChange}
                    className="form-control mb-2"
                    placeholder="Daily Salary"
                  />
                  <button className="btn btn-success btn-sm w-100" onClick={() => handleEditSubmit(emp._id)}>
                    Save
                  </button>
                </>
              ) : (
                <>
                  <h6 className="mb-1">{emp.name} ({emp.employeeType})</h6>
                  <p className="mb-2"><strong>₹</strong> {emp.dailySalary}/day</p>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-warning btn-sm flex-fill"
                      onClick={() => handleEditClick(emp)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm flex-fill"
                      onClick={() => handleDelete(emp._id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-muted">No employees found.</div>
      )}
    </div>
  );
}

export default Employee;
