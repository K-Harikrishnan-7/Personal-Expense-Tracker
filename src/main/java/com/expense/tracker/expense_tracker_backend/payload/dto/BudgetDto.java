package com.expense.tracker.expense_tracker_backend.payload.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BudgetDto {
    private Long id;
    private BigDecimal amount;
    private LocalDate startDate;
    private LocalDate endDate;
    private Long categoryId; // Optional: To link to a specific category
    private String categoryName; // For display in response
    // No user ID here
}