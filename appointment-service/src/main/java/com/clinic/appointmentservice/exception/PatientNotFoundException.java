package com.clinic.appointmentservice.exception;

import java.util.UUID;

public class PatientNotFoundException extends RuntimeException {
    public PatientNotFoundException(UUID patientId) {
        super("Patient not found with ID: " + patientId);
    }
}
