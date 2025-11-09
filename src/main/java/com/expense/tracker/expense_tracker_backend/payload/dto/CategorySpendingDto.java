package com.expense.tracker.expense_tracker_backend.payload.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategorySpendingDto {
    private String name; // Category name
    private BigDecimal amount; // Total spent in this category
}
