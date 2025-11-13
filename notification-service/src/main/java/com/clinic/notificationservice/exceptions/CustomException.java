package com.clinic.notificationservice.exceptions;

/**
 * This class is used for ApiService when the API returns 404 code
 */
public class CustomException {

    // Appointment not found
    public static class AppointmentNotFoundException extends RuntimeException {
        public AppointmentNotFoundException(String message) {
            super(message);
        }
    }

    // Patient not found
    public static class PatientNotFoundException extends RuntimeException {
        public PatientNotFoundException(String message) {
            super(message);
        }
    }
}
