package com.clinic.appointmentservice.exception;

public class PatientNotFoundException extends RuntimeException {

    public PatientNotFoundException(Long patientId) {
        super("Patient not found: " + patientId);
    }
}
