package com.clinic.appointmentservice.client.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record DoctorAvailability(Long doctorId, boolean available, boolean autoAccept) {
}
