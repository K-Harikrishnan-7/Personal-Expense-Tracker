import React, { useState, useEffect } from 'react';
import BudgetService from '../services/BudgetService';
import CategoryService from '../services/CategoryService';
import moment from 'moment';
import { Link } from 'react-router-dom';

const Budgets = () => {
  const initialBudgetState = {
    id: null,
    amount: '',
    startDate: moment().startOf('month').format('YYYY-MM-DD'),
    endDate: moment().endOf('month').format('YYYY-MM-DD'),
    categoryId: '',
  };
  const [budgets, setBudgets] = useState([]);
  const [currentBudget, setCurrentBudget] = useState(initialBudgetState);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    retrieveBudgets();
    retrieveCategories();
  }, []);

  const retrieveBudgets = () => {
    BudgetService.getAll()
      .then(response => {
        setBudgets(response.data);
      })
      .catch(e => {
        console.error(e);
        setMessage('Error retrieving budgets.');
      });
  };

  const retrieveCategories = () => {
    CategoryService.getAll()
      .then(response => {
        setCategories(response.data);
      })
      .catch(e => {
        console.error(e);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentBudget({ ...currentBudget, [name]: value });
  };

  const saveBudget = () => {
    if (!currentBudget.amount || isNaN(parseFloat(currentBudget.amount)) || parseFloat(currentBudget.amount) <= 0) {
      setMessage('Amount must be a positive number.');
      return;
    }
    if (!currentBudget.startDate || !currentBudget.endDate) {
      setMessage('Start and End dates are required.');
      return;
    }
    if (moment(currentBudget.startDate).isAfter(moment(currentBudget.endDate))) {
      setMessage('Start Date cannot be after End Date.');
      return;
    }

    const data = {
      amount: parseFloat(currentBudget.amount),
      startDate: currentBudget.startDate,
      endDate: currentBudget.endDate,
      categoryId: currentBudget.categoryId ? parseInt(currentBudget.categoryId) : null,
    };

    if (currentBudget.id) {
      BudgetService.update(currentBudget.id, data)
        .then(response => {
          setMessage('Budget updated successfully!');
          retrieveBudgets();
          resetForm();
        })
        .catch(e => {
          console.error(e);
          setMessage(e.response?.data?.message || 'Error updating budget.');
        });
    } else {
      BudgetService.create(data)
        .then(response => {
          setMessage('Budget created successfully!');
          retrieveBudgets();
          resetForm();
        })
        .catch(e => {
          console.error(e);
          setMessage(e.response?.data?.message || 'Error creating budget.');
        });
    }
  };

  const editBudget = (budget) => {
    setCurrentBudget({
      ...budget,
      amount: budget.amount.toString(),
      categoryId: budget.categoryId ? budget.categoryId.toString() : '',
      startDate: moment(budget.startDate).format('YYYY-MM-DD'),
      endDate: moment(budget.endDate).format('YYYY-MM-DD'),
    });
    setMessage('');
  };

  const deleteBudget = (id) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      BudgetService.delete(id)
        .then(response => {
          setMessage('Budget deleted successfully!');
          retrieveBudgets();
          resetForm();
        })
        .catch(e => {
          console.error(e);
          setMessage('Error deleting budget.');
        });
    }
  };

  const resetForm = () => {
    setCurrentBudget(initialBudgetState);
    setMessage('');
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4 text-primary-color fw-bold">Budget Management</h2>
      <div className="row justify-content-center">
        <div className="col-lg-5 col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header text-center">
              {currentBudget.id ? 'Edit Budget' : 'Add New Budget'}
            </div>
            <div className="card-body">
              <div className="form-group mb-3">
                <label htmlFor="amount">Budget Amount</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  id="amount"
                  name="amount"
                  value={currentBudget.amount}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="startDate">Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  id="startDate"
                  name="startDate"
                  value={currentBudget.startDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="endDate">End Date</label>
                <input
                  type="date"
                  className="form-control"
                  id="endDate"
                  name="endDate"
                  value={currentBudget.endDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="categoryId">Category (Optional)</label>
                <select
                  className="form-control"
                  id="categoryId"
                  name="categoryId"
                  value={currentBudget.categoryId}
                  onChange={handleInputChange}
                >
                  <option value="">Overall Budget</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {categories.length === 0 && (
                  <small className="form-text text-muted mt-2 d-block">No categories available. Please add some <Link to="/categories">here</Link>.</small>
                )}
              </div>
              <div className="d-flex justify-content-end mt-4">
                <button onClick={saveBudget} className="btn btn-primary me-2">
                  {currentBudget.id ? 'Update' : 'Add'}
                </button>
                {currentBudget.id && (
                  <button onClick={resetForm} className="btn btn-secondary">
                    Cancel
                  </button>
                )}
              </div>
              {message && (
                <div className={`alert ${message.includes('Error') || message.includes('empty') || message.includes('number') || message.includes('Date') ? 'alert-danger' : 'alert-success'} mt-3`} role="alert">
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-7 col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header text-center">
              My Budgets
            </div>
            <div className="card-body">
              {budgets.length === 0 ? (
                <div className="alert alert-info text-center">No budgets found. Add one on the left!</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-bordered table-hover">
                    <thead>
                      <tr>
                        <th className="text-end">Amount</th>
                        <th>Period</th>
                        <th>Category</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {budgets.map(budget => (
                        <tr key={budget.id}>
                          <td className="text-end">{budget.amount ? budget.amount.toFixed(2) : '0.00'}</td>
                          <td>{moment(budget.startDate).format('YYYY-MM-DD')} to {moment(budget.endDate).format('YYYY-MM-DD')}</td>
                          <td>{budget.categoryName || 'Overall'}</td>
                          <td>
                            <button onClick={() => editBudget(budget)} className="btn btn-sm btn-info me-2">
                              Edit
                            </button>
                            <button onClick={() => deleteBudget(budget.id)} className="btn btn-sm btn-danger">
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Budgets;