package com.clinic.appointmentservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class UpdateAppointmentStatusRequest {

    @NotBlank
    private String status;

    @NotNull
    private Long requesterId;

    @NotNull
    private RequesterRole requesterRole;

    @Size(max = 500)
    private String notes;

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

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

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
