import React, { useState, useEffect } from 'react';
import CategoryService from '../services/CategoryService';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [message, setMessage] = useState('');
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    retrieveCategories();
  }, []);

  const retrieveCategories = () => {
    CategoryService.getAll()
      .then(response => {
        setCategories(response.data);
      })
      .catch(e => {
        console.error(e);
        setMessage('Error retrieving categories.');
      });
  };

  const handleInputChange = (e) => {
    setCategoryName(e.target.value);
  };

  const saveCategory = () => {
    const data = {
      name: categoryName,
    };

    if (!categoryName.trim()) {
      setMessage('Category name cannot be empty.');
      return;
    }

    if (currentCategory) {
      CategoryService.update(currentCategory.id, data)
        .then(response => {
          setMessage('Category updated successfully!');
          retrieveCategories();
          resetForm();
        })
        .catch(e => {
          console.error(e);
          setMessage(e.response?.data?.message || 'Error updating category.');
        });
    } else {
      CategoryService.create(data)
        .then(response => {
          setMessage('Category created successfully!');
          retrieveCategories();
          resetForm();
        })
        .catch(e => {
          console.error(e);
          setMessage(e.response?.data?.message || 'Error creating category.');
        });
    }
  };

  const editCategory = (category) => {
    setCurrentCategory(category);
    setCategoryName(category.name);
    setMessage('');
  };

  const deleteCategory = (id) => {
    if (window.confirm('Are you sure you want to delete this category? All associated expenses will also be affected.')) {
      CategoryService.delete(id)
        .then(response => {
          setMessage('Category deleted successfully!');
          retrieveCategories();
          resetForm();
        })
        .catch(e => {
          console.error(e);
          setMessage('Error deleting category. It might be in use.');
        });
    }
  };

  const resetForm = () => {
    setCurrentCategory(null);
    setCategoryName('');
    setMessage('');
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4 text-primary-color fw-bold">Category Management</h2>
      <div className="row justify-content-center">
        <div className="col-lg-5 col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header text-center">
              {currentCategory ? 'Edit Category' : 'Add New Category'}
            </div>
            <div className="card-body">
              <div className="form-group mb-3">
                <label htmlFor="categoryName">Category Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="categoryName"
                  value={categoryName}
                  onChange={handleInputChange}
                  placeholder="e.g., Groceries, Transport"
                  required
                />
              </div>
              <div className="d-flex justify-content-end mt-4">
                <button onClick={saveCategory} className="btn btn-primary me-2">
                  {currentCategory ? 'Update' : 'Add'}
                </button>
                {currentCategory && (
                  <button onClick={resetForm} className="btn btn-secondary">
                    Cancel
                  </button>
                )}
              </div>
              {message && (
                <div className={`alert ${message.includes('Error') || message.includes('empty') ? 'alert-danger' : 'alert-success'} mt-3`} role="alert">
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-7 col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header text-center">
              My Categories
            </div>
            <div className="card-body">
              {categories.length === 0 ? (
                <div className="alert alert-info text-center">No categories found. Add one on the left!</div>
              ) : (
                <ul className="list-group">
                  {categories.map(category => (
                    <li key={category.id} className="list-group-item d-flex justify-content-between align-items-center">
                      <span className="fw-semibold">{category.name}</span>
                      <div>
                        <button onClick={() => editCategory(category)} className="btn btn-sm btn-info me-2">
                          Edit
                        </button>
                        <button onClick={() => deleteCategory(category.id)} className="btn btn-sm btn-danger">
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;