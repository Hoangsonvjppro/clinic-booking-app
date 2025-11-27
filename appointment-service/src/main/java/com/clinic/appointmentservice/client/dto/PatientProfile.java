package com.clinic.appointmentservice.client.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.UUID;

@JsonIgnoreProperties(ignoreUnknown = true)
public record PatientProfile(UUID id, String firstName, String lastName, boolean active, String status) {
}
