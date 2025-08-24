import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom'; // <--- IMPORT Navigate
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './index.css';

import AuthService from './services/AuthService';

import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Categories from './components/Categories';
import Expenses from './components/Expenses';
import Budgets from './components/Budgets';


const App = () => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const logOut = () => {
    AuthService.logout();
    setCurrentUser(undefined);
    navigate('/login');
    window.location.reload();
  };

  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link to={'/'} className="navbar-brand">
            <i className="fas fa-money-bill-wave me-2"></i> Expense Tracker
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link to={'/'} className="nav-link">
                  Home
                </Link>
              </li>
              {currentUser && ( // Only show these links if logged in
                <>
                  <li className="nav-item">
                    <Link to={'/dashboard'} className="nav-link">
                      Dashboard
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to={'/categories'} className="nav-link">
                      Categories
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to={'/expenses'} className="nav-link">
                      Expenses
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to={'/budgets'} className="nav-link">
                      Budgets
                    </Link>
                  </li>
                </>
              )}
            </ul>

            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              {currentUser ? (
                <li className="nav-item">
                  <a href="/login" className="nav-link" onClick={logOut}>
                    LogOut ({currentUser.username})
                  </a>
                </li>
              ) : ( // Only show these links if NOT logged in
                <>
                  <li className="nav-item">
                    <Link to={'/login'} className="nav-link">
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to={'/register'} className="nav-link">
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <div className="container main-content mt-3">
        <Routes>
          {/* Conditional Home Route: Redirect to dashboard if logged in, otherwise show Home */}
          <Route
            path="/"
            element={currentUser ? <Navigate to="/dashboard" replace /> : <Home />}
          />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes - only accessible if currentUser is set */}
          {currentUser ? (
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/budgets" element={<Budgets />} />
            </>
          ) : (
            // Fallback for unauthenticated access attempts to protected routes
            // Redirects to home if not logged in
            <>
              <Route path="/dashboard" element={<Navigate to="/" replace />} />
              <Route path="/categories" element={<Navigate to="/" replace />} />
              <Route path="/expenses" element={<Navigate to="/" replace />} />
              <Route path="/budgets" element={<Navigate to="/" replace />} />
            </>
          )}

          {/* Add a catch-all route for 404 Not Found (optional) */}
          <Route path="*" element={<Navigate to="/" replace />} /> {/* Redirects unknown paths to home */}
        </Routes>
      </div>
    </div>
  );
};

export default App;