import React, { useState } from 'react';
import GlobalAlert from './GlobalAlert';

function Login({ setIsLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'rajubhai' && password === 'rajubhai@123') {
      setIsLogin(true);
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="card p-4 shadow-sm" style={{ width: '400px' }}>
        <h2 className="text-center mb-4">Login</h2>
        {error && (
          <GlobalAlert
            type="success"
            message={error}
            onClose={() => setError('')}
          />
        )}        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Log In</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
