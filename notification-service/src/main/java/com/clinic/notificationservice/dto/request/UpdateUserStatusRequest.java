package com.clinic.notificationservice.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Request DTO for updating a user's account status (Admin action).
 */
public class UpdateUserStatusRequest {

    @NotNull(message = "Status is required")
    private String status; // ACTIVE, WARNED, SUSPENDED, BANNED

    @Size(max = 2000, message = "Reason must not exceed 2000 characters")
    private String reason;

    private Integer suspendDays; // Only for SUSPENDED status

    // === Constructors ===

    public UpdateUserStatusRequest() {
    }

    public UpdateUserStatusRequest(String status) {
        this.status = status;
    }

    // === Getters and Setters ===

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public Integer getSuspendDays() {
        return suspendDays;
    }

    public void setSuspendDays(Integer suspendDays) {
        this.suspendDays = suspendDays;
    }
}
