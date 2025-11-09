package com.expense.tracker.expense_tracker_backend.service;

import com.expense.tracker.expense_tracker_backend.entity.Budget;
import com.expense.tracker.expense_tracker_backend.entity.Category;
import com.expense.tracker.expense_tracker_backend.entity.User;
import com.expense.tracker.expense_tracker_backend.payload.dto.BudgetDto;
import com.expense.tracker.expense_tracker_backend.repository.BudgetRepository;
import com.expense.tracker.expense_tracker_backend.repository.CategoryRepository;
import com.expense.tracker.expense_tracker_backend.security.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BudgetService {

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private AuthService authService;

    @Transactional
    public BudgetDto createBudget(BudgetDto budgetDto) {
        User currentUser = authService.getAuthenticatedUser();

        Budget budget = new Budget();
        budget.setAmount(budgetDto.getAmount());
        budget.setStartDate(budgetDto.getStartDate());
        budget.setEndDate(budgetDto.getEndDate());
        budget.setUser(currentUser);

        if (budgetDto.getCategoryId() != null) {
            Category category = categoryRepository.findByIdAndUser(budgetDto.getCategoryId(), currentUser)
                    .orElseThrow(() -> new RuntimeException("Category not found or you don't have access."));
            budget.setCategory(category);
        }

        Budget savedBudget = budgetRepository.save(budget);
        return mapToDto(savedBudget);
    }

    public List<BudgetDto> getAllBudgets() {
        User currentUser = authService.getAuthenticatedUser();
        return budgetRepository.findByUser(currentUser).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public BudgetDto getBudgetById(Long id) {
        User currentUser = authService.getAuthenticatedUser();
        Budget budget = budgetRepository.findByIdAndUser(id, currentUser)
                .orElseThrow(() -> new RuntimeException("Budget not found or you don't have access."));
        return mapToDto(budget);
    }

    @Transactional
    public BudgetDto updateBudget(Long id, BudgetDto budgetDto) {
        User currentUser = authService.getAuthenticatedUser();
        Budget existingBudget = budgetRepository.findByIdAndUser(id, currentUser)
                .orElseThrow(() -> new RuntimeException("Budget not found or you don't have access."));

        existingBudget.setAmount(budgetDto.getAmount());
        existingBudget.setStartDate(budgetDto.getStartDate());
        existingBudget.setEndDate(budgetDto.getEndDate());

        if (budgetDto.getCategoryId() != null) {
            Category category = categoryRepository.findByIdAndUser(budgetDto.getCategoryId(), currentUser)
                    .orElseThrow(() -> new RuntimeException("Category not found or you don't have access."));
            existingBudget.setCategory(category);
        } else {
            existingBudget.setCategory(null); // If category is removed from budget
        }

        Budget updatedBudget = budgetRepository.save(existingBudget);
        return mapToDto(updatedBudget);
    }

    @Transactional
    public void deleteBudget(Long id) {
        User currentUser = authService.getAuthenticatedUser();
        Budget budget = budgetRepository.findByIdAndUser(id, currentUser)
                .orElseThrow(() -> new RuntimeException("Budget not found or you don't have access."));
        budgetRepository.delete(budget);
    }

    private BudgetDto mapToDto(Budget budget) {
        BudgetDto dto = new BudgetDto();
        dto.setId(budget.getId());
        dto.setAmount(budget.getAmount());
        dto.setStartDate(budget.getStartDate());
        dto.setEndDate(budget.getEndDate());
        Optional.ofNullable(budget.getCategory()).ifPresent(category -> {
            dto.setCategoryId(category.getId());
            dto.setCategoryName(category.getName());
        });
        return dto;
    }
}
