package com.expense.tracker.expense_tracker_backend.service;

import com.expense.tracker.expense_tracker_backend.entity.Category;
import com.expense.tracker.expense_tracker_backend.entity.User;
import com.expense.tracker.expense_tracker_backend.payload.dto.CategoryDto;
import com.expense.tracker.expense_tracker_backend.repository.CategoryRepository;
import com.expense.tracker.expense_tracker_backend.security.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private AuthService authService; // To get the authenticated user

    @Transactional
    public CategoryDto createCategory(CategoryDto categoryDto) {
        User currentUser = authService.getAuthenticatedUser();

        // Check if category name already exists for this user
        if (categoryRepository.existsByNameAndUser(categoryDto.getName(), currentUser)) {
            throw new IllegalArgumentException("Category with name '" + categoryDto.getName() + "' already exists for this user.");
        }

        Category category = new Category();
        category.setName(categoryDto.getName());
        category.setUser(currentUser); // Assign the current user

        Category savedCategory = categoryRepository.save(category);
        categoryDto.setId(savedCategory.getId());
        return categoryDto;
    }

    public List<CategoryDto> getAllCategories() {
        User currentUser = authService.getAuthenticatedUser();
        return categoryRepository.findByUser(currentUser).stream()
                .map(category -> new CategoryDto(category.getId(), category.getName()))
                .collect(Collectors.toList());
    }

    public CategoryDto getCategoryById(Long id) {
        User currentUser = authService.getAuthenticatedUser();
        Category category = categoryRepository.findByIdAndUser(id, currentUser)
                .orElseThrow(() -> new RuntimeException("Category not found or you don't have access."));
        return new CategoryDto(category.getId(), category.getName());
    }

    @Transactional
    public CategoryDto updateCategory(Long id, CategoryDto categoryDto) {
        User currentUser = authService.getAuthenticatedUser();
        Category existingCategory = categoryRepository.findByIdAndUser(id, currentUser)
                .orElseThrow(() -> new RuntimeException("Category not found or you don't have access."));

        // Check for duplicate name if the name is changed
        if (!existingCategory.getName().equals(categoryDto.getName()) &&
                categoryRepository.existsByNameAndUser(categoryDto.getName(), currentUser)) {
            throw new IllegalArgumentException("Category with name '" + categoryDto.getName() + "' already exists for this user.");
        }

        existingCategory.setName(categoryDto.getName());
        Category updatedCategory = categoryRepository.save(existingCategory);
        return new CategoryDto(updatedCategory.getId(), updatedCategory.getName());
    }

    @Transactional
    public void deleteCategory(Long id) {
        User currentUser = authService.getAuthenticatedUser();
        Category category = categoryRepository.findByIdAndUser(id, currentUser)
                .orElseThrow(() -> new RuntimeException("Category not found or you don't have access."));
        categoryRepository.delete(category);
    }
}
