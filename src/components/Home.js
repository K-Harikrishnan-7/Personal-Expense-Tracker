import React from 'react';

const Home = () => {
  return (
    <div className="container text-center py-5"> {/* Added Bootstrap classes */}
      <h1 className="display-4 fw-bold mb-3">Welcome to Your Personal Expense Tracker</h1>
      <p className="lead text-muted mb-4">Manage your expenses, categories, and budgets efficiently.</p>
      <p className="fs-5">Please <a href="/login" className="text-primary-color text-decoration-none fw-semibold">log in</a> or <a href="/register" className="text-primary-color text-decoration-none fw-semibold">register</a> to get started!</p>
    </div>
  );
};

export default Home;