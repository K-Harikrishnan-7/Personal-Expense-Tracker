package com.expense.tracker.expense_tracker_backend.contoller;

import com.expense.tracker.expense_tracker_backend.payload.dto.BudgetDto;
import com.expense.tracker.expense_tracker_backend.service.BudgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600) // Adjust for your frontend URL
@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    @Autowired
    private BudgetService budgetService;

    @PostMapping
    public ResponseEntity<BudgetDto> createBudget(@RequestBody BudgetDto budgetDto) {
        try {
            BudgetDto createdBudget = budgetService.createBudget(budgetDto);
            return new ResponseEntity<>(createdBudget, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST); // E.g., category not found
        }
    }

    @GetMapping
    public ResponseEntity<List<BudgetDto>> getAllBudgets() {
        List<BudgetDto> budgets = budgetService.getAllBudgets();
        return ResponseEntity.ok(budgets);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BudgetDto> getBudgetById(@PathVariable Long id) {
        try {
            BudgetDto budget = budgetService.getBudgetById(id);
            return ResponseEntity.ok(budget);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<BudgetDto> updateBudget(@PathVariable Long id, @RequestBody BudgetDto budgetDto) {
        try {
            BudgetDto updatedBudget = budgetService.updateBudget(id, budgetDto);
            return ResponseEntity.ok(updatedBudget);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST); // E.g., category not found or budget not found
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteBudget(@PathVariable Long id) {
        try {
            budgetService.deleteBudget(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
