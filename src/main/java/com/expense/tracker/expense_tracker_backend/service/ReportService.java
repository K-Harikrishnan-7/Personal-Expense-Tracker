package com.expense.tracker.expense_tracker_backend.service;


import com.expense.tracker.expense_tracker_backend.entity.Budget;
import com.expense.tracker.expense_tracker_backend.entity.User;
import com.expense.tracker.expense_tracker_backend.payload.dto.BudgetStatusDto;
import com.expense.tracker.expense_tracker_backend.payload.dto.CategorySpendingDto;
import com.expense.tracker.expense_tracker_backend.payload.dto.MonthlySpendingDto;
import com.expense.tracker.expense_tracker_backend.repository.BudgetRepository;
import com.expense.tracker.expense_tracker_backend.repository.ExpenseRepository;
import com.expense.tracker.expense_tracker_backend.security.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReportService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private BudgetRepository budgetRepository; // Inject BudgetRepository

    @Autowired
    private AuthService authService;

    public List<CategorySpendingDto> getCategorySpendingReport() {
        User currentUser = authService.getAuthenticatedUser();
        List<Object[]> results = expenseRepository.findTotalExpensesByCategoryForUser(currentUser);

        return results.stream()
                .map(row -> new CategorySpendingDto((String) row[0], (BigDecimal) row[1]))
                .collect(Collectors.toList());
    }

    public List<MonthlySpendingDto> getMonthlySpendingReport() {
        User currentUser = authService.getAuthenticatedUser();
        List<Object[]> results = expenseRepository.findMonthlySpendingForUser(currentUser);

        return results.stream()
                .map(row -> new MonthlySpendingDto((String) row[0], (BigDecimal) row[1]))
                .collect(Collectors.toList());
    }

    // --- NEW METHOD FOR BUDGET STATUS ---
    public List<BudgetStatusDto> getBudgetStatusReport() {
        User currentUser = authService.getAuthenticatedUser();
        List<Budget> budgets = budgetRepository.findByUser(currentUser);

        return budgets.stream()
                .map(budget -> {
                    BigDecimal currentSpending;
                    if (budget.getCategory() != null) {
                        // Category-specific budget
                        currentSpending = expenseRepository.sumAmountByUserAndCategoryAndDateBetween(
                                currentUser, budget.getCategory(), budget.getStartDate(), budget.getEndDate());
                    } else {
                        // Overall budget
                        currentSpending = expenseRepository.sumAmountByUserAndDateBetween(
                                currentUser, budget.getStartDate(), budget.getEndDate());
                    }

                    BudgetStatusDto dto = new BudgetStatusDto(
                            budget.getId(),
                            budget.getAmount(),
                            budget.getStartDate(),
                            budget.getEndDate(),
                            budget.getCategory() != null ? budget.getCategory().getId() : null,
                            budget.getCategory() != null ? budget.getCategory().getName() : "Overall",
                            currentSpending,
                            BigDecimal.ZERO, // Will be calculated by calculateStatus()
                            false,
                            BigDecimal.ZERO
                    );
                    dto.calculateStatus(); // Calculate remaining, exceeded, etc.
                    return dto;
                })
                .collect(Collectors.toList());
    }
}
