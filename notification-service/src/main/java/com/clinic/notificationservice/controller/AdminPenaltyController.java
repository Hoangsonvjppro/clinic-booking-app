package com.clinic.notificationservice.controller;

import com.clinic.notificationservice.dto.request.ApplyPenaltyRequest;
import com.clinic.notificationservice.dto.response.PenaltyResponse;
import com.clinic.notificationservice.enums.PenaltyType;
import com.clinic.notificationservice.enums.UserType;
import com.clinic.notificationservice.services.PenaltyService;
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
 * Admin controller for penalty management.
 * Handles applying and managing penalties for users.
 */
@RestController
@RequestMapping("/api/v1/admin/penalties")
public class AdminPenaltyController {

    private final PenaltyService penaltyService;

    public AdminPenaltyController(PenaltyService penaltyService) {
        this.penaltyService = penaltyService;
    }

    /**
     * Gets all penalties with optional filters.
     */
    @GetMapping
    public ResponseEntity<Page<PenaltyResponse>> getAllPenalties(
            @RequestParam(required = false) UUID userId,
            @RequestParam(required = false) UserType userType,
            @RequestParam(required = false) PenaltyType penaltyType,
            @RequestParam(defaultValue = "false") boolean activeOnly,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<PenaltyResponse> penalties = penaltyService.getPenaltiesWithFilters(
                userId, userType, penaltyType, activeOnly, pageable);
        return ResponseEntity.ok(penalties);
    }

    /**
     * Gets a specific penalty by ID.
     */
    @GetMapping("/{penaltyId}")
    public ResponseEntity<PenaltyResponse> getPenalty(@PathVariable UUID penaltyId) {
        PenaltyResponse penalty = penaltyService.getPenaltyById(penaltyId);
        return ResponseEntity.ok(penalty);
    }

    /**
     * Applies a new penalty to a user.
     */
    @PostMapping
    public ResponseEntity<PenaltyResponse> applyPenalty(
            @RequestHeader("X-User-Id") UUID adminId,
            @Valid @RequestBody ApplyPenaltyRequest request) {
        request.setIssuedBy(adminId);
        PenaltyResponse penalty = penaltyService.applyPenalty(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(penalty);
    }

    /**
     * Revokes (deactivates) a penalty.
     */
    @PostMapping("/{penaltyId}/revoke")
    public ResponseEntity<PenaltyResponse> revokePenalty(
            @PathVariable UUID penaltyId,
            @RequestHeader("X-User-Id") UUID adminId) {
        PenaltyResponse penalty = penaltyService.revokePenalty(penaltyId, adminId);
        return ResponseEntity.ok(penalty);
    }

    /**
     * Gets penalties for a specific user.
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<PenaltyResponse>> getPenaltiesByUser(
            @PathVariable UUID userId,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<PenaltyResponse> penalties = penaltyService.getPenaltiesByUser(userId, pageable);
        return ResponseEntity.ok(penalties);
    }

    /**
     * Gets active penalties for a specific user.
     */
    @GetMapping("/user/{userId}/active")
    public ResponseEntity<List<PenaltyResponse>> getActivePenaltiesByUser(
            @PathVariable UUID userId) {
        List<PenaltyResponse> penalties = penaltyService.getActivePenalties(userId);
        return ResponseEntity.ok(penalties);
    }

    /**
     * Gets penalties linked to a specific report.
     */
    @GetMapping("/report/{reportId}")
    public ResponseEntity<List<PenaltyResponse>> getPenaltiesByReport(
            @PathVariable UUID reportId) {
        List<PenaltyResponse> penalties = penaltyService.getPenaltiesByReport(reportId);
        return ResponseEntity.ok(penalties);
    }

    /**
     * Gets penalties linked to a specific warning.
     */
    @GetMapping("/warning/{warningId}")
    public ResponseEntity<List<PenaltyResponse>> getPenaltiesByWarning(
            @PathVariable UUID warningId) {
        List<PenaltyResponse> penalties = penaltyService.getPenaltiesByWarning(warningId);
        return ResponseEntity.ok(penalties);
    }

    /**
     * Gets penalty count for a user.
     */
    @GetMapping("/user/{userId}/count")
    public ResponseEntity<Long> getPenaltyCount(@PathVariable UUID userId) {
        long count = penaltyService.countPenaltiesByUser(userId);
        return ResponseEntity.ok(count);
    }
}
