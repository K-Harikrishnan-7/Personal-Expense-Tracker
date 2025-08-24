import React, { useState } from 'react';
import AuthService from '../services/AuthService';
import { useNavigate, Link } from 'react-router-dom'; // Import Link

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setMessage('');

    AuthService.login(username, password)
      .then(() => {
        navigate('/dashboard');
        window.location.reload();
      })
      .catch(error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setMessage(resMessage);
      });
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <div className="col-md-6 col-lg-4"> {/* Responsive column width */}
        <div className="card">
          <div className="card-header text-center">
            <h3>Login</h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleLogin}>
              <div className="form-group mb-3">
                <label htmlFor="username">Username:</label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="form-group mb-4"> {/* Increased margin for password field */}
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="d-grid"> {/* Use d-grid for full-width button */}
                <button type="submit" className="btn btn-primary">Login</button>
              </div>
              {message && (
                <div className="form-group mt-3">
                  <div className="alert alert-danger" role="alert">
                    {message}
                  </div>
                </div>
              )}
            </form>
            <p className="text-center mt-3 mb-0 text-muted">
              Don't have an account? <Link to="/register" className="text-primary-color text-decoration-none fw-semibold">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;