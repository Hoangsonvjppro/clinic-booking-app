package com.clinic.appointmentservice.exception;

public class PatientInactiveException extends RuntimeException {

    public PatientInactiveException(Long patientId) {
        super("Patient account is not active: " + patientId);
    }
}
