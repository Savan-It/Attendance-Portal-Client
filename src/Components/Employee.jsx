import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Employee() {
  const [employees, setEmployees] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', employeeType: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: '', employeeType: '' });

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('http://localhost:8000/employees');
      setEmployees(res.data);
    } catch (err) {
      console.error('Error fetching employees:', err.message);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleEditClick = (employee) => {
    setEditingId(employee._id);
    setEditForm({ name: employee.name, employeeType: employee.employeeType });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleEditSubmit = async (id) => {
    try {
      await axios.put(`http://localhost:8000/employees/${id}`, editForm);
      setEditingId(null);
      fetchEmployees();
    } catch (error) {
      console.error('Error updating employee:', error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await axios.delete(`http://localhost:8000/employees/${id}`);
        fetchEmployees(); // refresh list
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
      await axios.post('http://localhost:8000/employees', newEmployee);
      setNewEmployee({ name: '', employeeType: '' });
      setShowAddForm(false);
      fetchEmployees();
    } catch (error) {
      console.error('Error adding employee:', error.message);
    }
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center my-4">
        <h3>Employees</h3>
        <button className="btn btn-success" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : '+ Add Employee'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="mb-4">
          <div className="row g-2">
            <div className="col-md-4">
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
            <div className="col-md-4">
              <select
                className="form-select"
                name="employeeType"
                value={newEmployee.employeeType}
                onChange={handleAddChange}
                required
              >
                <option value="">Select Type</option>
                <option value="laborer">Laborer</option>
                <option value="carftsman">Carftsman</option>
              </select>
            </div>
            <div className="col-md-4">
              <button type="submit" className="btn btn-primary w-100">
                Save
              </button>
            </div>
          </div>
        </form>
      )}

      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th width="120">Action</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp._id}>
              <td>
                {editingId === emp._id ? (
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    className="form-control"
                  />
                ) : (
                  emp.name
                )}
              </td>
              <td>
                {editingId === emp._id ? (
                  <select
                    name="employeeType"
                    value={editForm.employeeType}
                    onChange={handleEditChange}
                    className="form-select"
                  >
                    <option value="laborer">Laborer</option>
                    <option value="carftsman">Carftsman</option>
                  </select>
                ) : (
                  emp.employeeType
                )}
              </td>
              <td>
                {editingId === emp._id ? (
                  <button className="btn btn-sm btn-success" onClick={() => handleEditSubmit(emp._id)}>
                    Save
                  </button>
                ) : (
                  <>
                     <button className="btn btn-sm btn-warning me-1" onClick={() => handleEditClick(emp)} title="Edit">
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(emp._id)} title="Delete">
                        <i className="bi bi-trash"></i>
                      </button>
                  </>
                )}
              </td>
            </tr>
          ))}
          {employees.length === 0 && (
            <tr>
              <td colSpan="3" className="text-center text-muted">
                No employees found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Employee;
