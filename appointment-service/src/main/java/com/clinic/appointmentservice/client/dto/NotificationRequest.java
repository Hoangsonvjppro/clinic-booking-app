package com.clinic.appointmentservice.client.dto;

public record NotificationRequest(
        Long patientId,
        Long doctorId,
        Long appointmentId,
        String subject,
        String message,
        String channel
) {
}
