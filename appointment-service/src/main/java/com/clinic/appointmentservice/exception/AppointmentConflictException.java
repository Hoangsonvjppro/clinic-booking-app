package com.clinic.appointmentservice.exception;

import java.util.UUID;

public class AppointmentConflictException extends RuntimeException {

    public AppointmentConflictException(UUID doctorId, String time) {
        super("Doctor " + doctorId + " already has an appointment at " + time);
    }
}
