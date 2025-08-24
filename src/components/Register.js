import React, { useState } from 'react';
import AuthService from '../services/AuthService';
import { useNavigate, Link } from 'react-router-dom'; // Import Link

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [successful, setSuccessful] = useState(false);
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    setMessage('');
    setSuccessful(false);

    AuthService.register(username, email, password)
      .then(response => {
        setMessage(response.data.message);
        setSuccessful(true);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      })
      .catch(error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setMessage(resMessage);
        setSuccessful(false);
      });
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <div className="col-md-6 col-lg-4">
        <div className="card">
          <div className="card-header text-center">
            <h3>Register</h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleRegister}>
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
              <div className="form-group mb-3">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group mb-4">
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
              <div className="d-grid">
                <button type="submit" className="btn btn-primary">Register</button>
              </div>
              {message && (
                <div className="form-group mt-3">
                  <div className={successful ? 'alert alert-success' : 'alert alert-danger'} role="alert">
                    {message}
                  </div>
                </div>
              )}
            </form>
            <p className="text-center mt-3 mb-0 text-muted">
              Already have an account? <Link to="/login" className="text-primary-color text-decoration-none fw-semibold">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;