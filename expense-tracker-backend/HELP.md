# Personal Expense Tracker - Backend (Spring Boot)

This is the backend component of the Personal Expense Tracker application, built using Spring Boot. It provides RESTful APIs for user authentication, expense, category, and budget management, and generates financial reports.

## 🚀 Technologies

*   **Java 17+**: The core language for the backend.
*   **Spring Boot 3.x**: Framework for rapid application development.
*   **Spring Data JPA**: For easy interaction with the MySQL database.
*   **Spring Security**: Handles authentication and authorization using JWT.
*   **JSON Web Tokens (JWT)**: For secure, stateless authentication.
*   **MySQL Database**: The relational database used to store application data.
*   **Lombok**: Reduces boilerplate code (getters, setters, constructors).
*   **Maven**: Build automation tool.

## 📋 Prerequisites

Before setting up the backend, ensure you have:

*   **Java Development Kit (JDK) 17 or higher** installed.
*   **Maven 3.6+** installed.
*   A running **MySQL Server** instance.
*   An IDE like IntelliJ IDEA or VS Code (with Java extensions) is recommended.

## 📦 Setup and Running

1.  **Navigate to the backend directory:**
    ```bash
    cd personal-expense-tracker/expense-tracker-backend
    ```

2.  **Database Configuration:**
    *   Create a new MySQL database named `expense_tracker`.
        ```sql
        CREATE DATABASE expense_tracker;
        ```
    *   Open `src/main/resources/application.properties`.
    *   Update the `spring.datasource.username` and `spring.datasource.password` properties with your MySQL root (or another user's) credentials.
        ```properties
        spring.datasource.url=jdbc:mysql://localhost:3306/expense_tracker?useSSL=false&serverTimezone=UTC
        spring.datasource.username=root 
        spring.datasource.password=your_password 
        spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

        spring.jpa.hibernate.ddl-auto=update # Creates/updates table schema automatically (good for dev)
        spring.jpa.show-sql=true 
        spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
        ```
    *   **JWT Secret Configuration**: Generate a strong, random secret key (at least 64 characters long) and update the `expense.tracker.jwtSecret` property. **DO NOT use the default key in production.**
        ```properties
        expense.tracker.jwtSecret=YOUR_SUPER_SECRET_JWT_KEY_HERE_MIN_64_CHARS_LONG_AND_RANDOMIZED
        expense.tracker.jwtExpirationMs=86400000 # 24 hours
        ```
    *   **CORS Configuration**: The `WebSecurityConfig.java` is already configured to allow requests from `http://localhost:3000`. If your frontend runs on a different port, adjust `setAllowedOrigins` in `WebSecurityConfig.java`.

3.  **Build the Project:**
    ```bash
    mvn clean install
    ```
    This command compiles the project, runs tests, and packages the application into a JAR file.

4.  **Run the Application:**
    You can run the Spring Boot application using Maven:
    ```bash
    mvn spring-boot:run
    ```
    Alternatively, if you're using an IDE, you can run the `ExpenseTrackerBackendApplication` class directly.

    The backend will start and listen for requests on `http://localhost:8080`.

## ⚙️ API Endpoints (Overview)

All API endpoints are prefixed with `/api`.

*   **Authentication (`/api/auth`)**:
    *   `POST /register`: Register a new user.
    *   `POST /login`: Authenticate user and receive a JWT.
*   **Categories (`/api/categories`)**:
    *   `GET /`: Retrieve all categories for the authenticated user.
    *   `GET /{id}`: Retrieve a specific category.
    *   `POST /`: Create a new category.
    *   `PUT /{id}`: Update an existing category.
    *   `DELETE /{id}`: Delete a category.
*   **Expenses (`/api/expenses`)**:
    *   `GET /`: Retrieve all expenses for the authenticated user.
    *   `GET /{id}`: Retrieve a specific expense.
    *   `POST /`: Create a new expense.
    *   `PUT /{id}`: Update an existing expense.
    *   `DELETE /{id}`: Delete an expense.
*   **Budgets (`/api/budgets`)**:
    *   `GET /`: Retrieve all budgets for the authenticated user.
    *   `GET /{id}`: Retrieve a specific budget.
    *   `POST /`: Create a new budget.
    *   `PUT /{id}`: Update an existing budget.
    *   `DELETE /{id}`: Delete a budget.
*   **Reports (`/api/reports`)**: (Requires authentication)
    *   `GET /category-spending`: Get total spending by category.
    *   `GET /monthly-spending`: Get total spending per month.
    *   `GET /budget-status`: Get the current status of all user budgets (spent vs. allocated).

## 📄 License

This project is licensed under the MIT License.