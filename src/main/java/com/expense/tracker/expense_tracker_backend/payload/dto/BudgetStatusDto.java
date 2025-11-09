package com.expense.tracker.expense_tracker_backend.payload.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BudgetStatusDto {
    private Long id;
    private BigDecimal budgetAmount;
    private LocalDate startDate;
    private LocalDate endDate;
    private Long categoryId; // Null for overall budget
    private String categoryName; // "Overall" or actual category name

    private BigDecimal currentSpending; // Total spent in this budget's scope
    private BigDecimal remainingAmount; // BudgetAmount - CurrentSpending
    private boolean isExceeded; // True if CurrentSpending > BudgetAmount
    private BigDecimal exceededAmount; // How much it's exceeded by (0 if not exceeded)

    public void calculateStatus() {
        this.remainingAmount = this.budgetAmount.subtract(this.currentSpending);
        this.isExceeded = this.currentSpending.compareTo(this.budgetAmount) > 0;
        this.exceededAmount = this.isExceeded ? this.currentSpending.subtract(this.budgetAmount) : BigDecimal.ZERO;
    }
}
