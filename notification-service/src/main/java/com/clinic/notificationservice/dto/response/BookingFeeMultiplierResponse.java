package com.clinic.notificationservice.dto.response;

import java.time.LocalDateTime;

/**
 * Response DTO for booking fee multiplier information.
 * Used to inform users about any fee penalties applied to their next booking.
 */
public class BookingFeeMultiplierResponse {

    private Long userId;
    private Double multiplier;
    private boolean hasActivePenalty;
    private String reason;
    private LocalDateTime penaltyExpiresAt;
    private String message;

    // === Constructors ===

    public BookingFeeMultiplierResponse() {
    }

    public BookingFeeMultiplierResponse(Long userId, Double multiplier, boolean hasActivePenalty, 
                                        String reason, LocalDateTime penaltyExpiresAt) {
        this.userId = userId;
        this.multiplier = multiplier;
        this.hasActivePenalty = hasActivePenalty;
        this.reason = reason;
        this.penaltyExpiresAt = penaltyExpiresAt;
        this.message = generateMessage();
    }

    // === Static Factory Methods ===

    /**
     * Creates response for user with no active penalty.
     */
    public static BookingFeeMultiplierResponse noActivePenalty(Long userId) {
        BookingFeeMultiplierResponse response = new BookingFeeMultiplierResponse();
        response.userId = userId;
        response.multiplier = 1.0;
        response.hasActivePenalty = false;
        response.reason = null;
        response.penaltyExpiresAt = null;
        response.message = "Không có phụ phí áp dụng";
        return response;
    }

    /**
     * Creates response for user with active fee multiplier penalty.
     */
    public static BookingFeeMultiplierResponse withPenalty(Long userId, Double multiplier, 
                                                           String reason, LocalDateTime expiresAt) {
        BookingFeeMultiplierResponse response = new BookingFeeMultiplierResponse();
        response.userId = userId;
        response.multiplier = multiplier;
        response.hasActivePenalty = true;
        response.reason = reason;
        response.penaltyExpiresAt = expiresAt;
        response.message = response.generateMessage();
        return response;
    }

    // === Helper Methods ===

    private String generateMessage() {
        if (!hasActivePenalty || multiplier == null || multiplier <= 1.0) {
            return "Không có phụ phí áp dụng";
        }
        
        String percentIncrease = String.format("%.0f", (multiplier - 1) * 100);
        String baseMessage = String.format("Phí đặt lịch của bạn sẽ tăng %s%% cho lần đặt tiếp theo", percentIncrease);
        
        if (reason != null && !reason.isEmpty()) {
            baseMessage += " do " + reason;
        }
        
        return baseMessage;
    }

    // === Getters and Setters ===

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Double getMultiplier() {
        return multiplier;
    }

    public void setMultiplier(Double multiplier) {
        this.multiplier = multiplier;
    }

    public boolean isHasActivePenalty() {
        return hasActivePenalty;
    }

    public void setHasActivePenalty(boolean hasActivePenalty) {
        this.hasActivePenalty = hasActivePenalty;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public LocalDateTime getPenaltyExpiresAt() {
        return penaltyExpiresAt;
    }

    public void setPenaltyExpiresAt(LocalDateTime penaltyExpiresAt) {
        this.penaltyExpiresAt = penaltyExpiresAt;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
