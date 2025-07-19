import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GlobalAlert from './/GlobalAlert';

function Upad() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [employees, setEmployees] = useState([]);
  const [alert, setAlert] = useState({
    status: false,
    message: '',
  });
  const [formData, setFormData] = useState({
    employeeId: '',
    amount: '',
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('https://attendanceserver.onrender.com/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error.message);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        date: selectedDate.toISOString().slice(0, 10),
        employeeId: formData.employeeId,
        amount: formData.amount,
      };
      // Send 'data' to the backend using Axios POST request
      await axios.post('https://attendanceserver.onrender.com/upad', data)
        .then((response) => {
          setAlert({
            status: true,
            message: response.data.message,
          });
          setFormData({
            employeeId: '',
            amount: '',
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
        });;
      // Clear form data after successful submission

    } catch (error) {
      console.error('Error submitting data:', error.message);
    }
  };

  return (
    <div className="container px-5">
      <div className="row">
        <div className="col">
          {alert.status && (
          <GlobalAlert
            type="success"
            message={alert.message}
            onClose={() => setAlert({ status: false, message: '' })}
          />
        )}
          <div className="row my-4">
            <div className="col text-center">
              <h4>Upad</h4>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col">
              <div className="date-selector ">
                <label htmlFor="date" className="form-label me-3">Date : </label>
                <input
                  type="date"
                  name='date'
                  id='date'
                  value={selectedDate.toISOString().slice(0, 10)}
                  onChange={(e) => handleDateChange(new Date(e.target.value))}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="employeeName" className="form-label">Employee Name</label>
                  <select
                    className="form-select"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Employee</option>
                    {employees.map((employee) => (
                      <option key={employee._id} value={employee._id}>
                        {employee.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="amount" className="form-label">Amount</label>
                  <input
                    type="number"
                    name="amount"
                    className="form-control"
                    value={formData.amount}
                    onChange={handleInputChange}
                    id="amount"
                    required
                    aria-describedby="amount"
                  />
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

export default Upad;
