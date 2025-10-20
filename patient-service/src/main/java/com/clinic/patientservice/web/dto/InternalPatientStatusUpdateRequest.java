package com.clinic.patientservice.web.dto;

import com.clinic.patientservice.model.PatientStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class InternalPatientStatusUpdateRequest {

    @NotBlank
    @Email
    private String email;

    @NotNull
    private Boolean active;

    @NotNull
    private PatientStatus status;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public PatientStatus getStatus() {
        return status;
    }

    public void setStatus(PatientStatus status) {
        this.status = status;
    }
}

