import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
    return (
        <>
            <nav class="navbar navbar-expand-lg bg-body-tertiary" data-bs-theme="dark">
                <div class="container-fluid">
                    <Link className="navbar-brand" to="/">Attendance</Link>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNavDropdown">
                        <ul class="navbar-nav">
                            <li class="nav-item">
                                <Link className="nav-link" to="/salary">Salary</Link>
                            </li>
                            <li class="nav-item">
                                <Link className="nav-link" to="/upad">Upad</Link>
                            </li>
                            <li class="nav-item">
                                <Link className="nav-link" to="/employee">Employee</Link>
                            </li>
                            <li class="nav-item">
                                <Link className="nav-link" to="/attendance-details">Details</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Header;
