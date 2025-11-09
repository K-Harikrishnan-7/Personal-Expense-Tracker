package com.expense.tracker.expense_tracker_backend.payload.request;

import lombok.Data;

@Data
public class LoginRequest {
    private String username;
    private String password;
}
