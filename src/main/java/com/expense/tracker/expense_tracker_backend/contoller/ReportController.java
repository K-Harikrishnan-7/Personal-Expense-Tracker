package com.expense.tracker.expense_tracker_backend.contoller;

import com.expense.tracker.expense_tracker_backend.payload.dto.BudgetStatusDto;
import com.expense.tracker.expense_tracker_backend.payload.dto.CategorySpendingDto;
import com.expense.tracker.expense_tracker_backend.payload.dto.MonthlySpendingDto;
import com.expense.tracker.expense_tracker_backend.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping("/category-spending")
    public ResponseEntity<List<CategorySpendingDto>> getCategorySpendingReport() {
        List<CategorySpendingDto> report = reportService.getCategorySpendingReport();
        return ResponseEntity.ok(report);
    }

    @GetMapping("/monthly-spending")
    public ResponseEntity<List<MonthlySpendingDto>> getMonthlySpendingReport() {
        List<MonthlySpendingDto> report = reportService.getMonthlySpendingReport();
        return ResponseEntity.ok(report);
    }

    // --- NEW ENDPOINT FOR BUDGET STATUS ---
    @GetMapping("/budget-status")
    public ResponseEntity<List<BudgetStatusDto>> getBudgetStatusReport() {
        List<BudgetStatusDto> report = reportService.getBudgetStatusReport();
        return ResponseEntity.ok(report);
    }
}