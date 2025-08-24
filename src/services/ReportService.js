import http from './http-common';

class ReportService {
  getCategorySpending() {
    return http.get('/reports/category-spending');
  }

  getMonthlySpending() {
    return http.get('/reports/monthly-spending');
  }

  // --- NEW METHOD FOR BUDGET STATUS ---
  getBudgetStatus() {
    return http.get('/reports/budget-status');
  }
}

export default new ReportService();