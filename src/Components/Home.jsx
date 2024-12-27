import React, { useState, useEffect } from 'react';
import './Home.scss';
import { ErrorMessage, Formik, Form, Field } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';

function Home() {
  const [employees, setEmployees] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [alertMessage, setAlertMessage] = useState('');
  const [alert, setAlert] = useState(false);

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
  const validationSchema = Yup.object().shape(
    employees.reduce((acc, employee) => {
      acc[`status-${employee._id}`] = Yup.string().required(`Please select attendance for ${employee.name}`);
      return acc;
    }, {})
  );

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const attendanceData = employees.map((employee) => ({
        employee: employee._id,
        status: values[`status-${employee._id}`] === 'Yes' ? 'Present' : 'Absent',
      }));

      console.log('Attendance data:', attendanceData);

      const response = await axios.post(
        `https://attendanceserver.onrender.com/attendance/${selectedDate.toISOString().slice(0, 10)}`,
        attendanceData
      );
      setAlertMessage(response.data.message);
      setAlert(true);
      resetForm();
      setTimeout(() => {
        setAlert(false);
      }, 2500);

      console.log('Attendance details updated for all employees.');
    } catch (error) {
      console.error('Error submitting attendance:', error.message);
    }
  };


  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <>
      <div className="container px-5">
        {
          alert &&
          <div className="row my-4">
            <div className="col text-center">
            <div class="alert alert-success" role="alert">
              {alertMessage}
            </div>
          </div>
          </div>
        }
      <div className="row my-4">
        <div className="col text-center">
          <h4>Attendance</h4>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className="date-selector">
            <input
              type="date"
              value={selectedDate.toISOString().slice(0, 10)}
              onChange={(e) => handleDateChange(new Date(e.target.value))}
            />
          </div>
        </div>
      </div>
      <Formik
        initialValues={employees.reduce((acc, employee) => {
          acc[`status-${employee._id}`] = '';
          return acc;
        }, {})}
        validationSchema={validationSchema}

        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form>
            {employees.map((employee) => (
              <div key={employee._id}>
                <div className="row employeeBox mt-4">
                  <div className="col">
                    <p>{employee.name}</p>
                  </div>
                  <div className="col text-end">
                    <label htmlFor={`${employee._id}Yes`}>Yes</label>
                    <Field
                      type="radio"
                      name={`status-${employee._id}`}
                      value="Yes"
                      className="me-2"
                      id={`${employee._id}Yes`}
                    />
                    <label htmlFor={`${employee._id}No`}>No</label>
                    <Field
                      type="radio"
                      name={`status-${employee._id}`}
                      value="No"
                      id={`${employee._id}No`}
                    />
                  </div>
                </div>
                <ErrorMessage
                  name={`status-${employee._id}`}
                  component="div"
                  className="text-danger"
                />
              </div>
            ))}
            <div className="row my-4">
              <div className="col text-center">
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div >
    </>
  );
}

export default Home;
