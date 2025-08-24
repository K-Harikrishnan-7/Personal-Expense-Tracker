# Personal Expense Tracker - Frontend (React.js)

This is the frontend component of the Personal Expense Tracker application, built with React.js. It provides a modern, interactive user interface for interacting with the Spring Boot backend.

## 🚀 Technologies

*   **React 18+**: JavaScript library for building user interfaces.
*   **React Router DOM**: For declarative routing in the application.
*   **Axios**: Promise-based HTTP client for making API requests to the backend.
*   **Recharts**: A composable charting library built on React components for data visualization.
*   **Bootstrap**: Popular CSS framework for responsive and consistent styling.
*   **Moment.js**: For parsing, validating, manipulating, and formatting dates.
*   **Font Awesome**: For scalable vector icons.
*   **npm / Yarn**: Package managers.

## 📋 Prerequisites

Before setting up the frontend, ensure you have:

*   **Node.js (LTS version recommended)** installed.
*   **npm** (comes with Node.js) or **Yarn** installed.
*   An IDE like VS Code is highly recommended for React development.
*   **The Spring Boot Backend must be running** on `http://localhost:8080` (or the configured URL).

## 📦 Setup and Running

1.  **Navigate to the frontend directory:**
    ```bash
    cd personal-expense-tracker/expense-tracker-frontend
    ```

2.  **Install Dependencies:**
    This command will install all necessary React and UI libraries (e.g., `axios`, `react-router-dom`, `recharts`, `bootstrap`, `moment`, `@fortawesome/fontawesome-free`).
    ```bash
    npm install
    # or yarn install
    ```

3.  **Run the Application:**
    ```bash
    npm start
    # or yarn start
    ```
    This command starts the development server. The application will typically open in your browser at `http://localhost:3000`. If port 3000 is already in use, it will prompt you to run on another available port (e.g., `3001`).

## ⚙️ Configuration

*   **Backend API URL**:
    The frontend is configured to communicate with the backend running on `http://localhost:8080`. This is set in:
    *   `src/services/AuthService.js` (for authentication endpoints)
    *   `src/services/http-common.js` (for all protected API endpoints)

    If your Spring Boot backend is running on a different port or domain, you will need to update these URLs accordingly.

*   **CORS**:
    During development, a proxy is configured in `package.json` to handle CORS issues (`"proxy": "http://localhost:8080"`). In a production deployment, ensure that your backend's CORS configuration allows requests from your frontend's domain.

## 💡 Key Features

*   **Login/Register**: User authentication forms.
*   **Dashboard**:
    *   Overview of monthly spending trends (Line Chart).
    *   Breakdown of expenses by category (Pie Chart).
    *   Real-time budget tracking status, highlighting exceeded budgets.
*   **Categories**: CRUD interface for managing custom expense categories.
*   **Expenses**: CRUD interface for recording and managing individual expenses, linked to categories.
*   **Budgets**: CRUD interface for setting and managing overall or category-specific budgets.

## 📄 License

This project is licensed under the MIT License.