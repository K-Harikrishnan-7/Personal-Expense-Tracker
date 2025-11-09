package com.expense.tracker.expense_tracker_backend.payload.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonthlySpendingDto {
    private String month; // e.g., "2023-10"
    private BigDecimal totalAmount; // Total spent in that month
}
