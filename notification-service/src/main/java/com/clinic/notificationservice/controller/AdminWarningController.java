package com.clinic.notificationservice.controller;

import com.clinic.notificationservice.dto.request.SendWarningRequest;
import com.clinic.notificationservice.dto.response.WarningResponse;
import com.clinic.notificationservice.enums.UserType;
import com.clinic.notificationservice.services.WarningService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Admin controller for warning management.
 * Handles sending warnings to users.
 */
@RestController
@RequestMapping("/api/v1/admin/warnings")
public class AdminWarningController {

    private final WarningService warningService;

    public AdminWarningController(WarningService warningService) {
        this.warningService = warningService;
    }

    /**
     * Gets all warnings with optional filters.
     */
    @GetMapping
    public ResponseEntity<Page<WarningResponse>> getAllWarnings(
            @RequestParam(required = false) UUID userId,
            @RequestParam(required = false) UserType userType,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<WarningResponse> warnings;
        if (userId != null || userType != null) {
            warnings = warningService.getWarningsWithFilters(userId, userType, pageable);
        } else {
            warnings = warningService.getAllWarnings(pageable);
        }
        return ResponseEntity.ok(warnings);
    }

    /**
     * Gets a specific warning by ID.
     */
    @GetMapping("/{warningId}")
    public ResponseEntity<WarningResponse> getWarning(@PathVariable UUID warningId) {
        WarningResponse warning = warningService.getWarningById(warningId);
        return ResponseEntity.ok(warning);
    }

    /**
     * Sends a new warning to a user.
     */
    @PostMapping
    public ResponseEntity<WarningResponse> sendWarning(
            @RequestHeader("X-User-Id") UUID adminId,
            @Valid @RequestBody SendWarningRequest request) {
        request.setIssuedBy(adminId);
        WarningResponse warning = warningService.sendWarning(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(warning);
    }

    /**
     * Gets warnings for a specific user.
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<WarningResponse>> getWarningsByUser(
            @PathVariable UUID userId,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<WarningResponse> warnings = warningService.getWarningsByUser(userId, pageable);
        return ResponseEntity.ok(warnings);
    }

    /**
     * Gets warnings linked to a specific report.
     */
    @GetMapping("/report/{reportId}")
    public ResponseEntity<List<WarningResponse>> getWarningsByReport(
            @PathVariable UUID reportId) {
        List<WarningResponse> warnings = warningService.getWarningsByReport(reportId);
        return ResponseEntity.ok(warnings);
    }

    /**
     * Gets warning count for a user.
     */
    @GetMapping("/user/{userId}/count")
    public ResponseEntity<Long> getWarningCount(@PathVariable UUID userId) {
        long count = warningService.countWarningsByUser(userId);
        return ResponseEntity.ok(count);
    }
}
