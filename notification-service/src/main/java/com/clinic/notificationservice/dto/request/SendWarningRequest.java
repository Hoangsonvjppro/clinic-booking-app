package com.clinic.notificationservice.dto.request;

import com.clinic.notificationservice.enums.UserType;
import com.clinic.notificationservice.enums.WarningType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.Instant;
import java.util.UUID;

/**
 * Request DTO for sending a warning to a user (Admin action).
 */
public class SendWarningRequest {

    @NotNull(message = "User ID is required")
    private UUID userId;

    @NotNull(message = "User type is required")
    private UserType userType;

    @NotNull(message = "Warning type is required")
    private WarningType warningType;

    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title must not exceed 255 characters")
    private String title;

    @NotBlank(message = "Message is required")
    @Size(max = 5000, message = "Message must not exceed 5000 characters")
    private String message;

    private UUID reportId; // Optional: link to a report
    private Instant expiresAt; // Optional: when warning expires
    private UUID issuedBy; // Admin ID - set from controller header

    // === Constructors ===

    public SendWarningRequest() {
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

    public Instant getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(Instant expiresAt) {
        this.expiresAt = expiresAt;
    }

    public UUID getIssuedBy() {
        return issuedBy;
    }

    public void setIssuedBy(UUID issuedBy) {
        this.issuedBy = issuedBy;
    }
}
