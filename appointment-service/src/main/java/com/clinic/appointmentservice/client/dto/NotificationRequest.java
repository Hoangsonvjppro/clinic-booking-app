package com.clinic.appointmentservice.client.dto;

import java.util.UUID;

public record NotificationRequest(
        UUID patientId,
        UUID doctorId,
        UUID appointmentId,
        String subject,
        String message,
        String channel
) {
}
