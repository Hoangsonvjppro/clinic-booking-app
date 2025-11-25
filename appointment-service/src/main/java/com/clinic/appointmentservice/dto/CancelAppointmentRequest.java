package com.clinic.appointmentservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public class CancelAppointmentRequest {

    @NotNull
    private UUID requesterId;

    @NotNull
    private RequesterRole requesterRole;

    @Size(max = 500)
    private String reason;

    public UUID getRequesterId() {
        return requesterId;
    }

    public void setRequesterId(UUID requesterId) {
        this.requesterId = requesterId;
    }

    public RequesterRole getRequesterRole() {
        return requesterRole;
    }

    public void setRequesterRole(RequesterRole requesterRole) {
        this.requesterRole = requesterRole;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
