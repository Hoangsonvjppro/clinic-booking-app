package com.clinic.notificationservice.controller;

import com.clinic.notificationservice.dto.response.UnreadCountResponse;
import com.clinic.notificationservice.dto.response.WarningResponse;
import com.clinic.notificationservice.services.WarningService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Controller for user warning operations.
 * Handles viewing and managing warnings received by users.
 */
@RestController
@RequestMapping("/api/v1/warnings")
public class WarningController {

    private final WarningService warningService;

    public WarningController(WarningService warningService) {
        this.warningService = warningService;
    }

    /**
     * Gets all warnings for the current user.
     */
    @GetMapping("/my-warnings")
    public ResponseEntity<Page<WarningResponse>> getMyWarnings(
            @RequestHeader("X-User-Id") UUID userId,
            @PageableDefault(size = 10) Pageable pageable) {
        Page<WarningResponse> warnings = warningService.getWarningsByUser(userId, pageable);
        return ResponseEntity.ok(warnings);
    }

    /**
     * Gets unread warnings for the current user.
     */
    @GetMapping("/my-warnings/unread")
    public ResponseEntity<List<WarningResponse>> getUnreadWarnings(
            @RequestHeader("X-User-Id") UUID userId) {
        List<WarningResponse> warnings = warningService.getUnreadWarnings(userId);
        return ResponseEntity.ok(warnings);
    }

    /**
     * Gets a specific warning by ID.
     */
    @GetMapping("/{warningId}")
    public ResponseEntity<WarningResponse> getWarning(
            @PathVariable UUID warningId,
            @RequestHeader("X-User-Id") UUID userId) {
        WarningResponse warning = warningService.getWarningById(warningId);
        
        // Verify user owns this warning
        if (!warning.getUserId().equals(userId)) {
            return ResponseEntity.status(403).build();
        }
        
        return ResponseEntity.ok(warning);
    }

    /**
     * Marks a warning as read.
     */
    @PatchMapping("/{warningId}/read")
    public ResponseEntity<WarningResponse> markAsRead(
            @PathVariable UUID warningId,
            @RequestHeader("X-User-Id") UUID userId) {
        WarningResponse warning = warningService.markAsRead(warningId, userId);
        return ResponseEntity.ok(warning);
    }

    /**
     * Marks all warnings as read for the current user.
     */
    @PatchMapping("/mark-all-read")
    public ResponseEntity<Void> markAllAsRead(
            @RequestHeader("X-User-Id") UUID userId) {
        warningService.markAllAsRead(userId);
        return ResponseEntity.ok().build();
    }

    /**
     * Gets unread count for notifications badge.
     */
    @GetMapping("/unread-count")
    public ResponseEntity<UnreadCountResponse> getUnreadCount(
            @RequestHeader("X-User-Id") UUID userId) {
        long unreadWarnings = warningService.countUnreadWarnings(userId);
        UnreadCountResponse response = UnreadCountResponse.of(
                userId.hashCode() & Long.MAX_VALUE,
                unreadWarnings,
                0, // Other notifications would be from different service
                0  // Pending reports
        );
        return ResponseEntity.ok(response);
    }

    /**
     * Gets active (non-expired) warnings for the current user.
     */
    @GetMapping("/my-warnings/active")
    public ResponseEntity<List<WarningResponse>> getActiveWarnings(
            @RequestHeader("X-User-Id") UUID userId) {
        List<WarningResponse> warnings = warningService.getActiveWarnings(userId);
        return ResponseEntity.ok(warnings);
    }

    /**
     * Gets recent warnings for the current user.
     */
    @GetMapping("/my-warnings/recent")
    public ResponseEntity<List<WarningResponse>> getRecentWarnings(
            @RequestHeader("X-User-Id") UUID userId,
            @RequestParam(defaultValue = "5") int limit) {
        List<WarningResponse> warnings = warningService.getRecentWarnings(userId, limit);
        return ResponseEntity.ok(warnings);
    }
}
