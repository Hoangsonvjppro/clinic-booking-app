package com.clinic.notificationservice.services;

import com.clinic.notificationservice.dto.AppointmentDTO;
import com.clinic.notificationservice.dto.PatientDTO;
import com.clinic.notificationservice.exceptions.CustomException;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class ApiService {

    private final WebClient patientWebClient;
    private final WebClient appointmentWebClient;

    public ApiService() {
        this.patientWebClient = WebClient.builder().baseUrl("http://localhost:8082").build();
        this.appointmentWebClient = WebClient.builder().baseUrl("http://localhost:8084").build();
    }

    public PatientDTO getPatientById(int id) throws CustomException.PatientNotFoundException {
        return patientWebClient.get()
                .uri("/api/patients/{id}", id)
                .retrieve()
                .bodyToMono(PatientDTO.class) // Parse JSON to DTO
                .block();
    }

    public AppointmentDTO getAppointmentById(int id) throws CustomException.AppointmentNotFoundException {
        return appointmentWebClient.get()
                .uri("/api/appointments/{id}", id)
                .retrieve()
                .bodyToMono(AppointmentDTO.class)
                .block();
    }
}
