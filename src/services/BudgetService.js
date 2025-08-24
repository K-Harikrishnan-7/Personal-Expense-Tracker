import http from './http-common';

class BudgetService {
  getAll() {
    return http.get('/budgets');
  }

  get(id) {
    return http.get(`/budgets/${id}`);
  }

  create(data) {
    return http.post('/budgets', data);
  }

  update(id, data) {
    return http.put(`/budgets/${id}`, data);
  }

  delete(id) {
    return http.delete(`/budgets/${id}`);
  }
}

export default new BudgetService();