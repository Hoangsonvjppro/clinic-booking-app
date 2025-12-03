package com.clinic.notificationservice.controller;

import com.clinic.notificationservice.dto.request.CreateReportRequest;
import com.clinic.notificationservice.dto.response.ReportResponse;
import com.clinic.notificationservice.enums.UserType;
import com.clinic.notificationservice.services.ReportService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Controller for user report operations.
 * Handles report submission by patients and doctors.
 */
@RestController
@RequestMapping("/api/v1/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    /**
     * Creates a new report from a patient.
     * Patient can report a doctor for various violations.
     */
    @PostMapping("/patient")
    public ResponseEntity<ReportResponse> createPatientReport(
            @RequestHeader("X-User-Id") UUID userId,
            @Valid @RequestBody CreateReportRequest request) {
        ReportResponse response = reportService.createReport(userId, UserType.PATIENT, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Creates a new report from a doctor.
     * Doctor can report a patient for no-show or other violations.
     */
    @PostMapping("/doctor")
    public ResponseEntity<ReportResponse> createDoctorReport(
            @RequestHeader("X-User-Id") UUID userId,
            @Valid @RequestBody CreateReportRequest request) {
        ReportResponse response = reportService.createReport(userId, UserType.DOCTOR, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Gets all reports made by the current user.
     */
    @GetMapping("/my-reports")
    public ResponseEntity<Page<ReportResponse>> getMyReports(
            @RequestHeader("X-User-Id") UUID userId,
            @PageableDefault(size = 10) Pageable pageable) {
        Page<ReportResponse> reports = reportService.getReportsByReporter(userId, pageable);
        return ResponseEntity.ok(reports);
    }

    /**
     * Gets a specific report by ID.
     */
    @GetMapping("/{reportId}")
    public ResponseEntity<ReportResponse> getReport(
            @PathVariable UUID reportId,
            @RequestHeader("X-User-Id") UUID userId) {
        ReportResponse report = reportService.getReportById(reportId);
        
        // Verify user has access to this report
        if (!report.getReporterId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        return ResponseEntity.ok(report);
    }

    /**
     * Checks if user can report another user for a specific appointment.
     */
    @GetMapping("/check")
    public ResponseEntity<Map<String, Object>> checkCanReport(
            @RequestHeader("X-User-Id") UUID userId,
            @RequestParam UUID reportedId,
            @RequestParam(required = false) UUID appointmentId) {
        Map<String, Object> response = new HashMap<>();
        
        if (appointmentId != null) {
            boolean hasReported = reportService.hasAlreadyReported(userId, reportedId, appointmentId);
            response.put("canReport", !hasReported);
            response.put("alreadyReported", hasReported);
        } else {
            response.put("canReport", true);
            response.put("alreadyReported", false);
        }
        
        return ResponseEntity.ok(response);
    }

    /**
     * Gets recent reports made by the current user.
     */
    @GetMapping("/my-reports/recent")
    public ResponseEntity<List<ReportResponse>> getMyRecentReports(
            @RequestHeader("X-User-Id") UUID userId,
            @RequestParam(defaultValue = "5") int limit) {
        List<ReportResponse> reports = reportService.getRecentReportsByUser(userId, limit);
        return ResponseEntity.ok(reports);
    }
}
