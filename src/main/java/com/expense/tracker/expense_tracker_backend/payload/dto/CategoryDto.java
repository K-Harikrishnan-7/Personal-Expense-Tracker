package com.expense.tracker.expense_tracker_backend.payload.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDto {
    private Long id;
    private String name;
    // No user ID here; it will be handled by the backend based on authentication
}
