package com.clinic.appointmentservice.dto;

import java.time.Instant;
import java.time.LocalDateTime;

public record AppointmentResponse(
        Long appointmentId,
        Long patientId,
        Long doctorId,
        LocalDateTime appointmentTime,
        Integer durationMinutes,
        String status,
        String notes,
        String cancelledReason,
        Instant createdAt,
        Instant updatedAt
) {
}
