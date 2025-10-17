package com.clinic.auth.client.dto;

public record PatientStatusUpdateRequest(
        String email,
        boolean active,
        String status
) {
}

