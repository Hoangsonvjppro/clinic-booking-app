package com.clinic.notificationservice.dto.request;

import com.clinic.notificationservice.enums.PenaltyType;
import com.clinic.notificationservice.enums.UserType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Request DTO for applying a penalty to a user (Admin action).
 */
public class ApplyPenaltyRequest {

    @NotNull(message = "User ID is required")
    private UUID userId;

    @NotNull(message = "User type is required")
    private UserType userType;

    @NotNull(message = "Penalty type is required")
    private PenaltyType penaltyType;

    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    private String description;

    private BigDecimal multiplier; // For fee multiplier penalties
    private Integer durationDays; // null = permanent
    private UUID reportId; // Optional: link to a report
    private UUID warningId; // Optional: link to a warning
    private UUID issuedBy; // Admin ID - set from controller header

    // === Constructors ===

    public ApplyPenaltyRequest() {
    }

    // === Getters and Setters ===

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public UserType getUserType() {
        return userType;
    }

    public void setUserType(UserType userType) {
        this.userType = userType;
    }

    public PenaltyType getPenaltyType() {
        return penaltyType;
    }

    public void setPenaltyType(PenaltyType penaltyType) {
        this.penaltyType = penaltyType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getMultiplier() {
        return multiplier;
    }

    public void setMultiplier(BigDecimal multiplier) {
        this.multiplier = multiplier;
    }

    public Integer getDurationDays() {
        return durationDays;
    }

    public void setDurationDays(Integer durationDays) {
        this.durationDays = durationDays;
    }

    public UUID getReportId() {
        return reportId;
    }

    public void setReportId(UUID reportId) {
        this.reportId = reportId;
    }

    public UUID getWarningId() {
        return warningId;
    }

    public void setWarningId(UUID warningId) {
        this.warningId = warningId;
    }

    public UUID getIssuedBy() {
        return issuedBy;
    }

    public void setIssuedBy(UUID issuedBy) {
        this.issuedBy = issuedBy;
    }
}
