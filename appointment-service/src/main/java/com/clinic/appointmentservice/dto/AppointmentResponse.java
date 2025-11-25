package com.clinic.appointmentservice.dto;

import java.time.Instant;
import java.time.LocalDateTime;

import java.util.UUID;

public record AppointmentResponse(
        UUID id,
        UUID patientId,
        UUID doctorId,
        LocalDateTime appointmentTime,
        Integer durationMinutes,
        String status,
        String notes,
        String cancelledReason,
        Instant createdAt,
        Instant updatedAt
) {
}
