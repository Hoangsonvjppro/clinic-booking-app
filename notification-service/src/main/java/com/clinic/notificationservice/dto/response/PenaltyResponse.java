package com.clinic.notificationservice.dto.response;

import com.clinic.notificationservice.entity.UserPenalty;
import com.clinic.notificationservice.enums.PenaltyType;
import com.clinic.notificationservice.enums.UserType;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * Response DTO for penalty data.
 */
public class PenaltyResponse {

    private UUID id;
    private UUID userId;
    private UserType userType;
    private String userName; // Populated from external service
    private PenaltyType penaltyType;
    private String description;
    private BigDecimal multiplier;
    private UUID reportId;
    private UUID warningId;
    private UUID issuedBy;
    private String issuedByName; // Populated from external service
    private Instant effectiveFrom;
    private Instant effectiveUntil;
    private boolean isActive;
    private boolean isCurrentlyActive;
    private boolean isExpired;
    private Instant createdAt;

    // === Constructors ===

    public PenaltyResponse() {
    }

    public static PenaltyResponse fromEntity(UserPenalty penalty) {
        PenaltyResponse response = new PenaltyResponse();
        response.setId(penalty.getId());
        response.setUserId(penalty.getUserId());
        response.setUserType(penalty.getUserType());
        response.setPenaltyType(penalty.getPenaltyType());
        response.setDescription(penalty.getDescription());
        response.setMultiplier(penalty.getMultiplier());
        response.setReportId(penalty.getReport() != null ? penalty.getReport().getId() : null);
        response.setWarningId(penalty.getWarning() != null ? penalty.getWarning().getId() : null);
        response.setIssuedBy(penalty.getIssuedBy());
        response.setEffectiveFrom(penalty.getEffectiveFrom());
        response.setEffectiveUntil(penalty.getEffectiveUntil());
        response.setActive(penalty.isActive());
        response.setCurrentlyActive(penalty.isCurrentlyActive());
        response.setExpired(penalty.isExpired());
        response.setCreatedAt(penalty.getCreatedAt());
        return response;
    }

    // === Getters and Setters ===

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

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

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
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

    public String getIssuedByName() {
        return issuedByName;
    }

    public void setIssuedByName(String issuedByName) {
        this.issuedByName = issuedByName;
    }

    public Instant getEffectiveFrom() {
        return effectiveFrom;
    }

    public void setEffectiveFrom(Instant effectiveFrom) {
        this.effectiveFrom = effectiveFrom;
    }

    public Instant getEffectiveUntil() {
        return effectiveUntil;
    }

    public void setEffectiveUntil(Instant effectiveUntil) {
        this.effectiveUntil = effectiveUntil;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public boolean isCurrentlyActive() {
        return isCurrentlyActive;
    }

    public void setCurrentlyActive(boolean currentlyActive) {
        isCurrentlyActive = currentlyActive;
    }

    public boolean isExpired() {
        return isExpired;
    }

    public void setExpired(boolean expired) {
        isExpired = expired;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
