package com.clinic.appointmentservice.client.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.UUID;

@JsonIgnoreProperties(ignoreUnknown = true)
public record DoctorAvailability(UUID doctorId, boolean available, boolean autoAccept, String doctorName, String message) {
    // Constructor for backward compatibility
    public DoctorAvailability(UUID doctorId, boolean available, boolean autoAccept) {
        this(doctorId, available, autoAccept, null, null);
    }
}
