package com.clinic.appointmentservice.exception;

public class DoctorUnavailableException extends RuntimeException {

    public DoctorUnavailableException(Long doctorId) {
        super("Doctor is not available: " + doctorId);
    }

    public DoctorUnavailableException(Long doctorId, String message) {
        super(message + " (doctorId=" + doctorId + ")");
    }
}
