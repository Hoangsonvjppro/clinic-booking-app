package com.clinic.appointmentservice.service;

import com.clinic.appointmentservice.domain.AppointmentStatus;
import com.clinic.appointmentservice.domain.AppointmentStatusCode;
import com.clinic.appointmentservice.repository.AppointmentStatusRepository;
import org.springframework.stereotype.Service;

@Service
public class AppointmentStatusService {

    private final AppointmentStatusRepository repository;

    public AppointmentStatusService(AppointmentStatusRepository repository) {
        this.repository = repository;
    }

    public AppointmentStatus getStatus(AppointmentStatusCode code) {
        return repository.findByCode(code)
                .orElseThrow(() -> new IllegalStateException("Appointment status not configured: " + code));
    }
}
