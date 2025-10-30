package com.clinic.appointmentservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CancelAppointmentRequest {

    @NotNull
    private Long requesterId;

    @NotNull
    private RequesterRole requesterRole;

    @Size(max = 500)
    private String reason;

    public Long getRequesterId() {
        return requesterId;
    }

    public void setRequesterId(Long requesterId) {
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
