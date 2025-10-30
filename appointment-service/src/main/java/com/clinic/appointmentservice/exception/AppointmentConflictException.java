package com.clinic.appointmentservice.exception;

public class AppointmentConflictException extends RuntimeException {

    public AppointmentConflictException(Long doctorId, String time) {
        super("Doctor " + doctorId + " already has an appointment at " + time);
    }
}
