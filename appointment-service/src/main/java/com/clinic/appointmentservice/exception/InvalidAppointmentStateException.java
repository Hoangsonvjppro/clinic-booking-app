package com.clinic.appointmentservice.exception;

import com.clinic.appointmentservice.domain.AppointmentStatusCode;

public class InvalidAppointmentStateException extends RuntimeException {

    public InvalidAppointmentStateException(Long appointmentId, AppointmentStatusCode currentStatus, AppointmentStatusCode targetStatus) {
        super("Cannot change appointment " + appointmentId + " from " + currentStatus + " to " + targetStatus);
    }
}
