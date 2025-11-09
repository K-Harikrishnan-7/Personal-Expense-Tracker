package com.expense.tracker.expense_tracker_backend.service;

import com.expense.tracker.expense_tracker_backend.entity.Category;
import com.expense.tracker.expense_tracker_backend.entity.Expense;
import com.expense.tracker.expense_tracker_backend.entity.User;
import com.expense.tracker.expense_tracker_backend.payload.dto.ExpenseDto;
import com.expense.tracker.expense_tracker_backend.repository.CategoryRepository;
import com.expense.tracker.expense_tracker_backend.repository.ExpenseRepository;
import com.expense.tracker.expense_tracker_backend.security.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private CategoryRepository categoryRepository; // Needed to link expenses to categories

    @Autowired
    private AuthService authService;

    @Transactional
    public ExpenseDto createExpense(ExpenseDto expenseDto) {
        User currentUser = authService.getAuthenticatedUser();

        Category category = categoryRepository.findByIdAndUser(expenseDto.getCategoryId(), currentUser)
                .orElseThrow(() -> new RuntimeException("Category not found or you don't have access."));

        Expense expense = new Expense();
        expense.setAmount(expenseDto.getAmount());
        expense.setDescription(expenseDto.getDescription());
        expense.setDate(expenseDto.getDate());
        expense.setCategory(category);
        expense.setUser(currentUser);

        Expense savedExpense = expenseRepository.save(expense);
        return mapToDto(savedExpense);
    }

    public List<ExpenseDto> getAllExpenses() {
        User currentUser = authService.getAuthenticatedUser();
        return expenseRepository.findByUser(currentUser).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public ExpenseDto getExpenseById(Long id) {
        User currentUser = authService.getAuthenticatedUser();
        Expense expense = expenseRepository.findByIdAndUser(id, currentUser)
                .orElseThrow(() -> new RuntimeException("Expense not found or you don't have access."));
        return mapToDto(expense);
    }

    @Transactional
    public ExpenseDto updateExpense(Long id, ExpenseDto expenseDto) {
        User currentUser = authService.getAuthenticatedUser();
        Expense existingExpense = expenseRepository.findByIdAndUser(id, currentUser)
                .orElseThrow(() -> new RuntimeException("Expense not found or you don't have access."));

        Category category = categoryRepository.findByIdAndUser(expenseDto.getCategoryId(), currentUser)
                .orElseThrow(() -> new RuntimeException("Category not found or you don't have access."));

        existingExpense.setAmount(expenseDto.getAmount());
        existingExpense.setDescription(expenseDto.getDescription());
        existingExpense.setDate(expenseDto.getDate());
        existingExpense.setCategory(category); // Update category if changed

        Expense updatedExpense = expenseRepository.save(existingExpense);
        return mapToDto(updatedExpense);
    }

    @Transactional
    public void deleteExpense(Long id) {
        User currentUser = authService.getAuthenticatedUser();
        Expense expense = expenseRepository.findByIdAndUser(id, currentUser)
                .orElseThrow(() -> new RuntimeException("Expense not found or you don't have access."));
        expenseRepository.delete(expense);
    }

    private ExpenseDto mapToDto(Expense expense) {
        ExpenseDto dto = new ExpenseDto();
        dto.setId(expense.getId());
        dto.setAmount(expense.getAmount());
        dto.setDescription(expense.getDescription());
        dto.setDate(expense.getDate());
        dto.setCategoryId(expense.getCategory().getId());
        dto.setCategoryName(expense.getCategory().getName());
        return dto;
    }
}
