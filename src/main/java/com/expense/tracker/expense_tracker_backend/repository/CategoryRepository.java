package com.expense.tracker.expense_tracker_backend.repository;

import com.expense.tracker.expense_tracker_backend.entity.Category;
import com.expense.tracker.expense_tracker_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByUser(User user);
    Optional<Category> findByIdAndUser(Long id, User user); // To ensure user owns the category
    Boolean existsByNameAndUser(String name, User user); // To check for unique category name per user
}
