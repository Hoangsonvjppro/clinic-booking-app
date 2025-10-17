package com.clinic.appointmentservice.exception;

public class UnsupportedAppointmentStatusException extends RuntimeException {

    public UnsupportedAppointmentStatusException(String status) {
        super("Unsupported appointment status: " + status);
    }
}
