package com.expense.tracker.expense_tracker_backend.repository;

import com.expense.tracker.expense_tracker_backend.entity.Budget;
import com.expense.tracker.expense_tracker_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface BudgetRepository extends JpaRepository<Budget, Long> {
    List<Budget> findByUser(User user);
    Optional<Budget> findByIdAndUser(Long id, User user); // To ensure user owns the budget

    // Find budgets for a specific category and user
    List<Budget> findByCategoryAndUser(com.expense.tracker.expense_tracker_backend.entity.Category category, User user);

    // Find budgets that are active for a given date
    List<Budget> findByUserAndStartDateLessThanEqualAndEndDateGreaterThanEqual(User user, LocalDate date1, LocalDate date2);
}
