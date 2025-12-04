package com.clinic.appointmentservice.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;

import java.util.UUID;

public record AppointmentResponse(
        UUID id,
        UUID patientId,
        UUID doctorId,
        String doctorName,
        String patientName,
        String clinicAddress,
        LocalDateTime appointmentTime,
        Integer durationMinutes,
        String status,
        String notes,
        String cancelledReason,
        BigDecimal consultationFee,
        BigDecimal serviceFee,
        BigDecimal totalAmount,
        Instant createdAt,
        Instant updatedAt,
        UUID medicalRecordId
) {
}
