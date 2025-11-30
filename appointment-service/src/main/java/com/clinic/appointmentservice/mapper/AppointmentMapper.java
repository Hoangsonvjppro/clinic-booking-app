package com.clinic.appointmentservice.mapper;

import com.clinic.appointmentservice.domain.Appointment;
import com.clinic.appointmentservice.dto.AppointmentResponse;

public final class AppointmentMapper {

    private AppointmentMapper() {
    }

    public static AppointmentResponse toResponse(Appointment appointment, java.util.UUID medicalRecordId) {
        return new AppointmentResponse(
                appointment.getId(),
                appointment.getPatientId(),
                appointment.getDoctorId(),
                appointment.getAppointmentTime(),
                appointment.getDurationMinutes(),
                appointment.getStatus().getCode().name(),
                appointment.getNotes(),
                appointment.getCancelledReason(),
                appointment.getCreatedAt(),
                appointment.getUpdatedAt(),
                medicalRecordId
        );
    }
}
