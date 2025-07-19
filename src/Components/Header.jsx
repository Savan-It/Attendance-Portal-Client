import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header({ setIsLogin }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLogin(false); // Update state to false
    localStorage.setItem('isLogin', 'false'); // Clear login status in localStorage
    navigate('/'); // Redirect to home or login page
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary" data-bs-theme="dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">Attendance</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/salary">Salary</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/upad">Upad</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/employee">Employee</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/attendance-details">Details</Link>
              </li>
            </ul>
            <button className="btn btn-outline-light" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Header;
