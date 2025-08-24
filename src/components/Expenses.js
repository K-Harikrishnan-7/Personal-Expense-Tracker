import React, { useState, useEffect } from 'react';
import ExpenseService from '../services/ExpenseService';
import CategoryService from '../services/CategoryService';
import moment from 'moment';
import { Link } from 'react-router-dom';

const Expenses = () => {
  const initialExpenseState = {
    id: null,
    amount: '',
    description: '',
    date: moment().format('YYYY-MM-DD'),
    categoryId: '',
  };
  const [expenses, setExpenses] = useState([]);
  const [currentExpense, setCurrentExpense] = useState(initialExpenseState);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    retrieveExpenses();
    retrieveCategories();
  }, []);

  const retrieveExpenses = () => {
    ExpenseService.getAll()
      .then(response => {
        setExpenses(response.data);
      })
      .catch(e => {
        console.error(e);
        setMessage('Error retrieving expenses.');
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
    setCurrentExpense({ ...currentExpense, [name]: value });
  };

  const saveExpense = () => {
    if (!currentExpense.amount || isNaN(parseFloat(currentExpense.amount)) || parseFloat(currentExpense.amount) <= 0) {
      setMessage('Amount must be a positive number.');
      return;
    }
    if (!currentExpense.categoryId) {
      setMessage('Please select a category.');
      return;
    }
    if (!currentExpense.date) {
      setMessage('Please select a date.');
      return;
    }

    const data = {
      amount: parseFloat(currentExpense.amount),
      description: currentExpense.description,
      date: currentExpense.date,
      categoryId: parseInt(currentExpense.categoryId),
    };

    if (currentExpense.id) {
      ExpenseService.update(currentExpense.id, data)
        .then(response => {
          setMessage('Expense updated successfully!');
          retrieveExpenses();
          resetForm();
        })
        .catch(e => {
          console.error(e);
          setMessage(e.response?.data?.message || 'Error updating expense.');
        });
    } else {
      ExpenseService.create(data)
        .then(response => {
          setMessage('Expense created successfully!');
          retrieveExpenses();
          resetForm();
        })
        .catch(e => {
          console.error(e);
          setMessage(e.response?.data?.message || 'Error creating expense. Make sure a category is selected.');
        });
    }
  };

  const editExpense = (expense) => {
    setCurrentExpense({
      ...expense,
      amount: expense.amount.toString(),
      categoryId: expense.categoryId.toString(),
      date: moment(expense.date).format('YYYY-MM-DD')
    });
    setMessage('');
  };

  const deleteExpense = (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      ExpenseService.delete(id)
        .then(response => {
          setMessage('Expense deleted successfully!');
          retrieveExpenses();
          resetForm();
        })
        .catch(e => {
          console.error(e);
          setMessage('Error deleting expense.');
        });
    }
  };

  const resetForm = () => {
    setCurrentExpense(initialExpenseState);
    setMessage('');
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4 text-primary-color fw-bold">Expense Management</h2>
      <div className="row justify-content-center">
        <div className="col-lg-5 col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header text-center">
              {currentExpense.id ? 'Edit Expense' : 'Add New Expense'}
            </div>
            <div className="card-body">
              <div className="form-group mb-3">
                <label htmlFor="amount">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  id="amount"
                  name="amount"
                  value={currentExpense.amount}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="description">Description</label>
                <input
                  type="text"
                  className="form-control"
                  id="description"
                  name="description"
                  value={currentExpense.description}
                  onChange={handleInputChange}
                  placeholder="e.g., Dinner with friends"
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  className="form-control"
                  id="date"
                  name="date"
                  value={currentExpense.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="categoryId">Category</label>
                <select
                  className="form-control"
                  id="categoryId"
                  name="categoryId"
                  value={currentExpense.categoryId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a Category</option>
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
                <button onClick={saveExpense} className="btn btn-primary me-2">
                  {currentExpense.id ? 'Update' : 'Add'}
                </button>
                {currentExpense.id && (
                  <button onClick={resetForm} className="btn btn-secondary">
                    Cancel
                  </button>
                )}
              </div>
              {message && (
                <div className={`alert ${message.includes('Error') || message.includes('empty') || message.includes('number') || message.includes('select') ? 'alert-danger' : 'alert-success'} mt-3`} role="alert">
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-7 col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header text-center">
              My Expenses
            </div>
            <div className="card-body">
              {expenses.length === 0 ? (
                <div className="alert alert-info text-center">No expenses found. Add one on the left!</div>
              ) : (
                <div className="table-responsive"> {/* Make table responsive on small screens */}
                  <table className="table table-bordered table-hover">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th className="text-end">Amount</th>
                        <th>Category</th>
                        <th>Description</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expenses.map(expense => (
                        <tr key={expense.id}>
                          <td>{moment(expense.date).format('YYYY-MM-DD')}</td>
                          <td className="text-end">{expense.amount ? expense.amount.toFixed(2) : '0.00'}</td>
                          <td>{expense.categoryName}</td>
                          <td>{expense.description}</td>
                          <td>
                            <button onClick={() => editExpense(expense)} className="btn btn-sm btn-info me-2">
                              Edit
                            </button>
                            <button onClick={() => deleteExpense(expense.id)} className="btn btn-sm btn-danger">
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

export default Expenses;