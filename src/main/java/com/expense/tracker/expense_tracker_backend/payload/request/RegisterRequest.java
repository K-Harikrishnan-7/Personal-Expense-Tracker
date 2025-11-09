package com.expense.tracker.expense_tracker_backend.payload.request;

import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String email;
    private String password;
}