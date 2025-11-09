package com.expense.tracker.expense_tracker_backend.repository;

import com.expense.tracker.expense_tracker_backend.entity.Category;
import com.expense.tracker.expense_tracker_backend.entity.Expense;
import com.expense.tracker.expense_tracker_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal; // Import BigDecimal
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByUser(User user);
    Optional<Expense> findByIdAndUser(Long id, User user);

    List<Expense> findByUserAndDateBetween(User user, LocalDate startDate, LocalDate endDate);

    @Query("SELECT c.name, SUM(e.amount) FROM Expense e JOIN e.category c WHERE e.user = :user GROUP BY c.name")
    List<Object[]> findTotalExpensesByCategoryForUser(@Param("user") User user);

    @Query("SELECT FUNCTION('DATE_FORMAT', e.date, '%Y-%m'), SUM(e.amount) FROM Expense e WHERE e.user = :user GROUP BY FUNCTION('DATE_FORMAT', e.date, '%Y-%m') ORDER BY FUNCTION('DATE_FORMAT', e.date, '%Y-%m') ASC")
    List<Object[]> findMonthlySpendingForUser(@Param("user") User user);

    // --- NEW METHODS FOR BUDGET TRACKING ---

    // Sum of expenses for a user within a date range (overall budget)
    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.user = :user AND e.date BETWEEN :startDate AND :endDate")
    BigDecimal sumAmountByUserAndDateBetween(@Param("user") User user, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    // Sum of expenses for a user, category, and date range (category-specific budget)
    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.user = :user AND e.category = :category AND e.date BETWEEN :startDate AND :endDate")
    BigDecimal sumAmountByUserAndCategoryAndDateBetween(@Param("user") User user, @Param("category") Category category, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}