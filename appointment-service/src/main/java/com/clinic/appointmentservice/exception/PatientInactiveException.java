package com.clinic.appointmentservice.exception;

import java.util.UUID;

public class PatientInactiveException extends RuntimeException {
    public PatientInactiveException(UUID patientId) {
        super("Patient with ID " + patientId + " is inactive");
    }
}
