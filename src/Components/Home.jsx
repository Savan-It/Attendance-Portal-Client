import React, { useState, useEffect } from 'react';
import './Home.scss';
import GlobalAlert from './GlobalAlert';
import { ErrorMessage, Formik, Form, Field } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';

function Home() {
  const [employees, setEmployees] = useState([]);
  const [sites, setSites] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [alertMessage, setAlertMessage] = useState('');
  const [alert, setAlert] = useState(false);

  useEffect(() => {
    fetchEmployees();
    fetchSites();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('https://attendanceserver.onrender.com/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error.message);
    }
  };

  const fetchSites = async () => {
    try {
      const res = await axios.get('https://attendanceserver.onrender.com/site');
      setSites(res.data);
    } catch (error) {
      console.error('Error fetching sites:', error.message);
    }
  };

  const validationSchema = Yup.object().shape(
    employees.reduce((acc, employee) => {
      acc[`status-${employee._id}`] = Yup.string().required(`Select attendance for ${employee.name}`);
      acc[`site-${employee._id}`] = Yup.string();
      return acc;
    }, {})
  );

  const mapRadioToStatus = (val) => {
    if (val === 'Yes') return 'Present';
    if (val === 'No') return 'Absent';
    if (val === 'Half') return 'Half';
    return 'Absent';
  };

const handleSubmit = async (values, { resetForm }) => {
  try {
    const attendanceData = employees.map((employee) => {
      const status = mapRadioToStatus(values[`status-${employee._id}`]);
      const site = status !== 'Absent' ? values[`site-${employee._id}`] : null;

      return {
        employee: employee._id,
        status,
        ...(site && { site }), // only include site if it's not null
      };
    });

    const response = await axios.post(
      `https://attendanceserver.onrender.com/attendance/${selectedDate.toISOString().slice(0, 10)}`,
      attendanceData
    );

    setAlertMessage(response.data.message);
    setAlert(true);
    resetForm();
    setTimeout(() => setAlert(false), 2500);
  } catch (error) {
    console.error('Error submitting attendance:', error.message);
  }
};


  const handleDateChange = (date) => setSelectedDate(date);

  return (
    <>
      <div className="container px-3">
        {alert && (
          <GlobalAlert
            type="success"
            message={alertMessage}
            onClose={() => {
              setAlert(false);
              setAlertMessage('');
            }}
          />
        )}

        <div className="row my-3">
          <div className="col text-center">
            <h4>Attendance Entry</h4>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col text-center">
            <input
              type="date"
              value={selectedDate.toISOString().slice(0, 10)}
              onChange={(e) => handleDateChange(new Date(e.target.value))}
              className="form-control w-100"
            />
          </div>
        </div>

        {employees.length === 0 ? (
          <div className="text-center my-4">No employees found.</div>
        ) : (
          <Formik
            initialValues={employees.reduce((acc, employee) => {
              acc[`status-${employee._id}`] = '';
              acc[`site-${employee._id}`] = '';
              return acc;
            }, {})}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form>
                {employees.map((employee) => (
                  <div className="card p-3 mb-3 shadow-sm" key={employee._id}>
                    <strong>{employee.name}</strong>
                    <div className="d-flex justify-content-start gap-3 my-2 flex-wrap">
                      <label>
                        <Field type="radio" name={`status-${employee._id}`} value="Yes" /> Present
                      </label>
                      <label>
                        <Field type="radio" name={`status-${employee._id}`} value="No" /> Absent
                      </label>
                      <label>
                        <Field type="radio" name={`status-${employee._id}`} value="Half" /> Half
                      </label>
                    </div>
                    <Field as="select" name={`site-${employee._id}`} className="form-select mb-2">
                      <option value="">Select Site</option>
                      {sites.map((site) => (
                        <option key={site._id} value={site._id}>{site.name}</option>
                      ))}
                    </Field>
                    <ErrorMessage name={`status-${employee._id}`} component="div" className="text-danger" />
                    <ErrorMessage name={`site-${employee._id}`} component="div" className="text-danger" />
                  </div>
                ))}

                <div className="text-center my-4">
                  <button type="submit" className="btn btn-primary w-100">Submit Attendance</button>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </>
  );
}

export default Home;
