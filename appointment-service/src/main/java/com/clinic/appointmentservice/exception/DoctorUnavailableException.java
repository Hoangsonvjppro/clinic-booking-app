package com.clinic.appointmentservice.exception;

import java.util.UUID;

public class DoctorUnavailableException extends RuntimeException {
    public DoctorUnavailableException(UUID doctorId) {
        super("Doctor " + doctorId + " is not available at the requested time");
    }

    public DoctorUnavailableException(UUID doctorId, String message) {
        super("Doctor " + doctorId + ": " + message);
    }
}
