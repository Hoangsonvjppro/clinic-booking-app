package com.clinic.notificationservice.services;

import com.clinic.notificationservice.dto.AppointmentDTO;
import com.clinic.notificationservice.dto.DoctorDTO;
import com.clinic.notificationservice.dto.PatientDTO;
import com.clinic.notificationservice.exceptions.CustomException;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class ApiService {

    private final WebClient patientWebClient;
    private final WebClient appointmentWebClient;
    private final WebClient doctorWebClient;

    public ApiService() {
        this.patientWebClient = WebClient.builder().baseUrl("http://doctor-service:8082").build();
        this.appointmentWebClient = WebClient.builder().baseUrl("http://appointment-service:8084").build();
        this.doctorWebClient = WebClient.builder().baseUrl("http://patient-service:8083").build();
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

    public DoctorDTO getDoctorById(int id) throws CustomException.DoctorNotFoundException {
        return doctorWebClient.get()
                .uri("/api/doctor/user/{id}", id)
                .retrieve()
                .bodyToMono(DoctorDTO.class)
                .block();
    }
}
