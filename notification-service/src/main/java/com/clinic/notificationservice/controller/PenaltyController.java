package com.clinic.notificationservice.controller;

import com.clinic.notificationservice.dto.response.BookingFeeMultiplierResponse;
import com.clinic.notificationservice.dto.response.PenaltyResponse;
import com.clinic.notificationservice.services.PenaltyService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Controller for user penalty operations.
 * Handles viewing penalties received by users.
 */
@RestController
@RequestMapping("/api/v1/penalties")
public class PenaltyController {

    private final PenaltyService penaltyService;

    public PenaltyController(PenaltyService penaltyService) {
        this.penaltyService = penaltyService;
    }

    /**
     * Gets all penalties for the current user.
     */
    @GetMapping("/my-penalties")
    public ResponseEntity<Page<PenaltyResponse>> getMyPenalties(
            @RequestHeader("X-User-Id") UUID userId,
            @PageableDefault(size = 10) Pageable pageable) {
        Page<PenaltyResponse> penalties = penaltyService.getPenaltiesByUser(userId, pageable);
        return ResponseEntity.ok(penalties);
    }

    /**
     * Gets active penalties for the current user.
     */
    @GetMapping("/my-penalties/active")
    public ResponseEntity<List<PenaltyResponse>> getMyActivePenalties(
            @RequestHeader("X-User-Id") UUID userId) {
        List<PenaltyResponse> penalties = penaltyService.getActivePenalties(userId);
        return ResponseEntity.ok(penalties);
    }

    /**
     * Gets a specific penalty by ID.
     */
    @GetMapping("/{penaltyId}")
    public ResponseEntity<PenaltyResponse> getPenalty(
            @PathVariable UUID penaltyId,
            @RequestHeader("X-User-Id") UUID userId) {
        PenaltyResponse penalty = penaltyService.getPenaltyById(penaltyId);
        
        // Verify user owns this penalty
        if (!penalty.getUserId().equals(userId)) {
            return ResponseEntity.status(403).build();
        }
        
        return ResponseEntity.ok(penalty);
    }

    /**
     * Gets current booking fee multiplier for the user.
     * This endpoint can be called by appointment service to check fees.
     */
    @GetMapping("/booking-fee-multiplier")
    public ResponseEntity<BookingFeeMultiplierResponse> getBookingFeeMultiplier(
            @RequestHeader("X-User-Id") UUID userId) {
        BookingFeeMultiplierResponse response = penaltyService.getBookingFeeMultiplier(userId);
        return ResponseEntity.ok(response);
    }

    /**
     * Internal endpoint for appointment service to check fee multiplier.
     * Does not require user header - uses path variable for user ID.
     */
    @GetMapping("/internal/booking-fee-multiplier/{userId}")
    public ResponseEntity<BookingFeeMultiplierResponse> getBookingFeeMultiplierInternal(
            @PathVariable UUID userId) {
        BookingFeeMultiplierResponse response = penaltyService.getBookingFeeMultiplier(userId);
        return ResponseEntity.ok(response);
    }

    /**
     * Checks if user has any active fee penalty.
     */
    @GetMapping("/has-fee-penalty")
    public ResponseEntity<Boolean> hasFeePenalty(
            @RequestHeader("X-User-Id") UUID userId) {
        boolean hasPenalty = penaltyService.hasActiveFeePenalty(userId);
        return ResponseEntity.ok(hasPenalty);
    }
}
