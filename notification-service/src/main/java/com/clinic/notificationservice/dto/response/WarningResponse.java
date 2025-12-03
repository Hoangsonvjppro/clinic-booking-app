package com.clinic.notificationservice.dto.response;

import com.clinic.notificationservice.entity.Warning;
import com.clinic.notificationservice.enums.UserType;
import com.clinic.notificationservice.enums.WarningType;

import java.time.Instant;
import java.util.UUID;

/**
 * Response DTO for warning data.
 */
public class WarningResponse {

    private UUID id;
    private UUID userId;
    private UserType userType;
    private String userName; // Populated from external service
    private WarningType warningType;
    private String title;
    private String message;
    private UUID reportId;
    private UUID issuedBy;
    private String issuedByName; // Populated from external service
    private boolean isRead;
    private Instant readAt;
    private Instant expiresAt;
    private boolean isExpired;
    private Instant createdAt;

    // === Constructors ===

    public WarningResponse() {
    }

    public static WarningResponse fromEntity(Warning warning) {
        WarningResponse response = new WarningResponse();
        response.setId(warning.getId());
        response.setUserId(warning.getUserId());
        response.setUserType(warning.getUserType());
        response.setWarningType(warning.getWarningType());
        response.setTitle(warning.getTitle());
        response.setMessage(warning.getMessage());
        response.setReportId(warning.getReport() != null ? warning.getReport().getId() : null);
        response.setIssuedBy(warning.getIssuedBy());
        response.setRead(warning.isRead());
        response.setReadAt(warning.getReadAt());
        response.setExpiresAt(warning.getExpiresAt());
        response.setExpired(warning.isExpired());
        response.setCreatedAt(warning.getCreatedAt());
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

    public WarningType getWarningType() {
        return warningType;
    }

    public void setWarningType(WarningType warningType) {
        this.warningType = warningType;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public UUID getReportId() {
        return reportId;
    }

    public void setReportId(UUID reportId) {
        this.reportId = reportId;
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

    public boolean isRead() {
        return isRead;
    }

    public void setRead(boolean read) {
        isRead = read;
    }

    public Instant getReadAt() {
        return readAt;
    }

    public void setReadAt(Instant readAt) {
        this.readAt = readAt;
    }

    public Instant getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(Instant expiresAt) {
        this.expiresAt = expiresAt;
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
