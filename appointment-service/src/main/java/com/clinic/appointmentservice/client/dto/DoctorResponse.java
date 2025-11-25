package com.clinic.appointmentservice.client.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.UUID;

@JsonIgnoreProperties(ignoreUnknown = true)
public record DoctorResponse(
    UUID id,
    String fullName,
    String hospitalName,
    String hospitalAddress,
    String phone
) {}
