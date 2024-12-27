// Salary.js (React Component)
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Salary() {
  const [selectedMonth, setSelectedMonth] = useState(getInitialMonth());
  const [salaryReport, setSalaryReport] = useState([]); // [[employee, salary

  useEffect(() => {
    setSelectedMonth(getInitialMonth());
  }, []);

  function getInitialMonth() {
    const currentDate = new Date();
    const yearMonth = currentDate.toISOString().split('-').slice(0, 2).join('-');
    return yearMonth;
  }

  const generateSalary = async () => {

    try {
      const response = await axios.post('https://attendanceserver.onrender.com/generateSalary', {
        month: selectedMonth
      });
      setSalaryReport(response.data.salaryReport);
    } catch (error) {
      console.error('Error generating salary:', error.message);
    }
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  return (
    <div className='container py-5'>
      <div className="row text-center">
        <div className="col">
          <div className="row">
            <div className="col">
              <input
                type="month"
                name="month"
                id="month"
                value={selectedMonth}
                onChange={handleMonthChange}
              />
            </div>
            <div className="col">
              <button className="btn btn-primary" onClick={generateSalary}>
                Generate Salary
              </button>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-10">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Days</th>
                    <th>Upad</th>
                    <th>upad-date</th>
                    <th>Salary</th>
                  </tr>
                </thead>
                <tbody>
                  {salaryReport.map((data, index) => (
                    <tr key={index}>
                      <td>{data.employeeName}</td>
                      <td>{data.presentDay}</td>
                      <td>{data.totalUpadAmount}</td>
                      <td>
                        {data.upadDates.map((date, idx) => (
                          <div key={idx}>{new Date(date).toLocaleDateString()}</div>
                        ))}
                      </td>
                      <td>
                        {data.totalUpadAmount !== 0 ? (data.totalSalary - data.totalUpadAmount) : data.totalSalary}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Salary;
