// EmployeeForm.jsx

import React, { useState } from 'react';
import axios from 'axios';

function AddEmployee() {
  const [alert, setAlert] = useState({
    status: false,
    message: '',
  });
  const [formData, setFormData] = useState({
    name: '',
    employeeType: '',
    // other fields
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://attendanceserver.onrender.com/employees', formData)
      .then((response) => {
        setAlert({
          status: true,
          message: response.data.message,
        });
        setFormData({
          name: '',
          employeeType: '',
          // reset other fields
        });
        setTimeout(() => {
          setAlert({
            status: false,
            message: '',
          });
        }, 2500);
      })
      .catch((error) => {
        console.error('Error adding employee:', error.message);
      });
      // Reset form data after successful submission

     
    } catch (error) {
      console.error('Error adding employee:', error.message);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col">
        {
          alert.status &&
          <div className="row my-4">
            <div className="col text-center">
            <div class="alert alert-success" role="alert">
              {alert.message}
            </div>
          </div>
          </div>
        }
          <div className="row my-4 text-center">
            <div className="col">
              <h3>Add Employee</h3>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Employee Name</label>
                  <input type="text" name='name' autoComplete='off' className="form-control" value={formData.name} onChange={handleInputChange} id="name" aria-describedby="name" />
                </div>
                <div className="mb-3">
                  <label htmlFor="employeeType" className="form-label">Employee Type</label>
                  {/* <input type="text" name='employeeType' value={formData.employeeType} onChange={handleInputChange} className="form-control" id="employeeType" /> */}
                  <select className="form-select" name='employeeType' value={formData.employeeType} onChange={handleInputChange}>
                    <option selected>select Type</option>
                    <option value="laborer">Laborer</option>
                    <option value="carftsman">Carftsman</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddEmployee;
