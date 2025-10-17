package com.clinic.appointmentservice.client.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record PatientProfile(Long id, boolean active, String status) {
}
