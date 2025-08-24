import React, { useState, useEffect } from 'react';
import AuthService from '../services/AuthService';
import ReportService from '../services/ReportService';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import moment from 'moment';
import { Link } from 'react-router-dom'; // Import Link

const CHART_COLORS = ['#4a69bd', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c', '#d0ed57', '#83a6ed', '#8dd1e1'];

const Dashboard = () => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [categorySpending, setCategorySpending] = useState([]);
  const [monthlySpending, setMonthlySpending] = useState([]);
  const [budgetStatus, setBudgetStatus] = useState([]); // NEW STATE for budget status
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      fetchReports();
    }
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch Category Spending
      const categoryRes = await ReportService.getCategorySpending();
      const formattedCategoryData = categoryRes.data.map(item => ({
        name: item.name,
        value: item.amount,
      }));
      setCategorySpending(formattedCategoryData);

      // Fetch Monthly Spending
      const monthlyRes = await ReportService.getMonthlySpending();
      const sortedMonthlyData = monthlyRes.data.sort((a, b) => moment(a.month).diff(moment(b.month)));
      setMonthlySpending(sortedMonthlyData);

      // --- NEW: Fetch Budget Status ---
      const budgetStatusRes = await ReportService.getBudgetStatus();
      setBudgetStatus(budgetStatusRes.data);

    } catch (err) {
      console.error("Error fetching reports:", err);
      setError("Failed to load reports. Please try again or ensure you have expenses/budgets.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-4 text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-muted">Loading Reports...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger text-center">
          {error}
        </div>
      </div>
    );
  }

  const hasNoData = categorySpending.length === 0 && monthlySpending.length === 0 && budgetStatus.length === 0;

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-5 text-primary-color fw-bold">Welcome to Your Expense Dashboard, {currentUser ? currentUser.username : 'User'}!</h2>

      {hasNoData ? (
        <div className="alert alert-warning text-center mt-5 py-4">
          <h4 className="alert-heading">No Data Yet!</h4>
          <p>It looks like you haven't added any expenses, categories, or budgets. Start by adding some to see your reports here.</p>
          <hr/>
          <p className="mb-0">You can add them via the <Link to="/categories" className="text-decoration-none fw-semibold">Categories</Link>, <Link to="/expenses" className="text-decoration-none fw-semibold">Expenses</Link> and <Link to="/budgets" className="text-decoration-none fw-semibold">Budgets</Link> links in the navigation bar.</p>
        </div>
      ) : (
        <>
          {/* --- Budget Status Section --- */}
          <h3 className="text-center mb-4 text-secondary-color">Budget Status Overview</h3>
          {budgetStatus.length === 0 ? (
            <div className="alert alert-info text-center">
              No budgets defined. <Link to="/budgets" className="text-decoration-none fw-semibold">Create one</Link> to start tracking!
            </div>
          ) : (
            <div className="row justify-content-center mb-5">
              {budgetStatus.map(budget => (
                <div key={budget.id} className="col-lg-4 col-md-6 mb-3">
                  <div className={`card h-100 ${budget.isExceeded ? 'border-danger' : 'border-success'}`}> {/* Highlight exceeded budgets */}
                    <div className={`card-header text-center ${budget.isExceeded ? 'bg-danger' : 'bg-success'}`}>
                      {budget.categoryName} Budget
                    </div>
                    <div className="card-body">
                      <p className="mb-1"><strong>Period:</strong> {moment(budget.startDate).format('MMM D, YYYY')} - {moment(budget.endDate).format('MMM D, YYYY')}</p>
                      <p className="mb-1"><strong>Budgeted:</strong> <span className="fw-bold">${budget.budgetAmount.toFixed(2)}</span></p>
                      <p className="mb-1"><strong>Spent:</strong> <span className="fw-bold text-primary-color">${budget.currentSpending.toFixed(2)}</span></p>
                      <hr/>
                      {budget.isExceeded ? (
                        <p className="fw-bold text-danger">Exceeded by: ${budget.exceededAmount.toFixed(2)}</p>
                      ) : (
                        <p className="fw-bold text-success">Remaining: ${budget.remainingAmount.toFixed(2)}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <h3 className="text-center mb-4 text-secondary-color mt-5">Spending Visualizations</h3>
          <div className="row justify-content-center">
            <div className="col-lg-6 col-md-10 mb-4">
              <div className="card h-100">
                <div className="card-header text-center">
                  Expense Breakdown by Category
                </div>
                <div className="card-body d-flex flex-column align-items-center justify-content-center p-3">
                  {categorySpending.length > 0 ? (
                    <ResponsiveContainer width="100%" height={320}>
                      <PieChart>
                        <Pie
                          data={categorySpending}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          innerRadius={60}
                          paddingAngle={5}
                          fill="#8884d8"
                          labelLine={false}
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        >
                          {categorySpending.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                        <Legend align="center" verticalAlign="bottom" layout="horizontal" />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center text-muted py-5">No category spending data available.</div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-10 mb-4">
              <div className="card h-100">
                <div className="card-header text-center">
                  Monthly Spending Trend
                </div>
                <div className="card-body d-flex flex-column align-items-center justify-content-center p-3">
                  {monthlySpending.length > 0 ? (
                    <ResponsiveContainer width="100%" height={320}>
                      <LineChart
                        data={monthlySpending}
                        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis
                          dataKey="month"
                          tickFormatter={(tick) => moment(tick).format('MMM YYYY')}
                          angle={-45}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis tickFormatter={(value) => `$${value.toFixed(2)}`} />
                        <Tooltip formatter={(value) => `$${value.toFixed(2)}`} labelFormatter={(label) => moment(label).format('MMMM YYYY')} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="totalAmount"
                          stroke={CHART_COLORS[0]}
                          strokeWidth={2}
                          activeDot={{ r: 6, fill: CHART_COLORS[0], stroke: '#fff', strokeWidth: 2 }}
                          name="Total Spent"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center text-muted py-5">No monthly spending data available.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;