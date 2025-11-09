package com.expense.tracker.expense_tracker_backend.payload.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseDto {
    private Long id;
    private BigDecimal amount;
    private String description;
    private LocalDate date;
    private Long categoryId; // To link to a category
    private String categoryName; // For display in response
    // No user ID here
}