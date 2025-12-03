package com.clinic.notificationservice.controller;

import com.clinic.notificationservice.dto.request.ResolveReportRequest;
import com.clinic.notificationservice.dto.response.ReportResponse;
import com.clinic.notificationservice.enums.ReportStatus;
import com.clinic.notificationservice.services.ReportService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * Admin controller for report management.
 * Handles report review and resolution by administrators.
 */
@RestController
@RequestMapping("/api/v1/admin/reports")
public class AdminReportController {

    private final ReportService reportService;

    public AdminReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    /**
     * Gets all reports with optional status filter.
     */
    @GetMapping
    public ResponseEntity<Page<ReportResponse>> getAllReports(
            @RequestParam(required = false) ReportStatus status,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<ReportResponse> reports;
        if (status != null) {
            reports = reportService.getReportsByStatus(status, pageable);
        } else {
            reports = reportService.getAllReports(pageable);
        }
        return ResponseEntity.ok(reports);
    }

    /**
     * Gets pending reports for review queue.
     */
    @GetMapping("/pending")
    public ResponseEntity<Page<ReportResponse>> getPendingReports(
            @PageableDefault(size = 20) Pageable pageable) {
        Page<ReportResponse> reports = reportService.getPendingReports(pageable);
        return ResponseEntity.ok(reports);
    }

    /**
     * Gets a specific report by ID.
     */
    @GetMapping("/{reportId}")
    public ResponseEntity<ReportResponse> getReport(@PathVariable UUID reportId) {
        ReportResponse report = reportService.getReportById(reportId);
        return ResponseEntity.ok(report);
    }

    /**
     * Starts reviewing a report.
     * Changes status from PENDING to REVIEWING.
     */
    @PostMapping("/{reportId}/start-review")
    public ResponseEntity<ReportResponse> startReview(
            @PathVariable UUID reportId,
            @RequestHeader("X-User-Id") UUID adminId) {
        ReportResponse report = reportService.startReview(reportId, adminId);
        return ResponseEntity.ok(report);
    }

    /**
     * Resolves a report with admin decision.
     */
    @PostMapping("/{reportId}/resolve")
    public ResponseEntity<ReportResponse> resolveReport(
            @PathVariable UUID reportId,
            @RequestHeader("X-User-Id") UUID adminId,
            @Valid @RequestBody ResolveReportRequest request) {
        request.setAdminId(adminId);
        ReportResponse report = reportService.resolveReport(reportId, request);
        return ResponseEntity.ok(report);
    }

    /**
     * Gets reports received by a specific user.
     */
    @GetMapping("/user/{userId}/received")
    public ResponseEntity<Page<ReportResponse>> getReportsAgainstUser(
            @PathVariable UUID userId,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<ReportResponse> reports = reportService.getReportsByReportedUser(userId, pageable);
        return ResponseEntity.ok(reports);
    }

    /**
     * Gets reports made by a specific user.
     */
    @GetMapping("/user/{userId}/made")
    public ResponseEntity<Page<ReportResponse>> getReportsByUser(
            @PathVariable UUID userId,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<ReportResponse> reports = reportService.getReportsByReporter(userId, pageable);
        return ResponseEntity.ok(reports);
    }

    /**
     * Gets report statistics for admin dashboard.
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getReportStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("pending", reportService.countByStatus(ReportStatus.PENDING));
        stats.put("reviewing", reportService.countByStatus(ReportStatus.REVIEWING));
        stats.put("resolved", reportService.countByStatus(ReportStatus.RESOLVED));
        return ResponseEntity.ok(stats);
    }
}
