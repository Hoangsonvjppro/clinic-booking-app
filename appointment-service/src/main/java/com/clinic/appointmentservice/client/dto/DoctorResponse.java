package com.clinic.appointmentservice.client.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.math.BigDecimal;
import java.util.UUID;

@JsonIgnoreProperties(ignoreUnknown = true)
public record DoctorResponse(
    UUID id,
    String fullName,
    String hospitalName,
    String hospitalAddress,
    String phone,
    BigDecimal consultationFee
) {}
