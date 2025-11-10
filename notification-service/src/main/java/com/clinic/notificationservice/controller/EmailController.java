package com.clinic.notificationservice.controller;

import com.clinic.notificationservice.dto.AppointmentDTO;
import com.clinic.notificationservice.dto.PatientDTO;
import com.clinic.notificationservice.services.ApiService;
import com.clinic.notificationservice.services.EmailService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class EmailController implements CommandLineRunner {

    private final EmailService emailService;
    private final ApiService apiService;

    public EmailController(EmailService emailService, ApiService apiService) {
        this.emailService = emailService;
        this.apiService = apiService;
    }

    public void sendEmail(int appointmentId) {
        try {
            // Call API and get data
            AppointmentDTO appointmentDTO = apiService.getAppointmentById(appointmentId);
            PatientDTO patientDTO = apiService.getPatientById(appointmentDTO.getPatientId());

            // Prepare email's content
            String toEmail = patientDTO.getEmail();
            String subject = "Xác nhận lịch hẹn khám chữa bệnh";
            Map<String, Object> body = getBody(patientDTO, appointmentDTO);

            // Send email
            emailService.sendEmailHtml(toEmail, subject, body);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void run(String... args) throws Exception {
        int appointmentId = 1;
        AppointmentDTO appointmentDTO = apiService.getAppointmentById(appointmentId);

        int patientId = appointmentDTO.getPatientId();
        PatientDTO patientDTO = apiService.getPatientById(patientId);

        String toEmail = "tuyetan419@gmail.com";
        String subject = "Xác nhận lịch hẹn khám chữa bệnh";
        Map<String, Object> body = getBody(patientDTO, appointmentDTO);

        emailService.sendEmailHtml(toEmail, subject, body);
        System.out.println("Gui mail thanh cong");
//        System.out.println(body);
    }

    private static Map<String, Object> getBody(PatientDTO patientDTO, AppointmentDTO appointmentDTO) {
        String patientName = patientDTO.getFullName();
        String appointmentTime = appointmentDTO.getAppointmentTimeString();
        String doctorName = "Võ Cao Sang";
        String notes = appointmentDTO.getNotes();
        String status = appointmentDTO.getVietnameseStatus();

        Map<String, Object> body = Map.of(
                "patientName", patientName,
                "appointmentTime", appointmentTime,
                "doctorName", doctorName,
                "notes", notes,
                "status", status
        );

        return body;
    }
}
