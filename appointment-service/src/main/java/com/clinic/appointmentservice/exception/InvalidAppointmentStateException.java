package com.clinic.appointmentservice.exception;

import com.clinic.appointmentservice.domain.AppointmentStatusCode;
import java.util.UUID;

public class InvalidAppointmentStateException extends RuntimeException {
    public InvalidAppointmentStateException(UUID appointmentId, AppointmentStatusCode currentStatus, AppointmentStatusCode targetStatus) {
        super("Cannot transition appointment " + appointmentId + " from " + currentStatus + " to " + targetStatus);
    }
}
