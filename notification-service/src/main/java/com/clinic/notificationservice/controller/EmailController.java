package com.clinic.notificationservice.controller;

import com.clinic.notificationservice.dto.AppointmentDTO;
import com.clinic.notificationservice.dto.PatientDTO;
import com.clinic.notificationservice.exceptions.CustomException;
import com.clinic.notificationservice.services.ApiService;
import com.clinic.notificationservice.services.EmailService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/notifications")
public class EmailController implements CommandLineRunner {

    private final EmailService emailService;
    private final ApiService apiService;

    public EmailController(EmailService emailService, ApiService apiService) {
        this.emailService = emailService;
        this.apiService = apiService;
    }

    /**
     * This endpoint is for sending email automatically with Kafka
     */
    @PostMapping("/send-email")
    public ResponseEntity<Map<String, Object>> sendEmail(@RequestBody AppointmentDTO appointmentRequest) {
        Map<String, Object> response = new HashMap<>();

        try {
            // Call API and get data
            AppointmentDTO appointmentDTO = apiService.getAppointmentById(appointmentRequest.getAppointmentId());
            PatientDTO patientDTO = apiService.getPatientById(appointmentDTO.getPatientId());

            // Prepare email's content
            String toEmail = patientDTO.getEmail();
            String subject = "Xác nhận lịch hẹn khám chữa bệnh";
            Map<String, Object> body = getBody(patientDTO, appointmentDTO);

            // Send email
            emailService.sendEmailHtml(toEmail, subject, body);
            response.put("message", "Email sent successfully");

            return ResponseEntity.ok(response);
        } catch (CustomException.AppointmentNotFoundException e) {
            response.put("message", "Appointment not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (CustomException.PatientNotFoundException e) {
            response.put("message", "Patient not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            e.printStackTrace();
            response.put("message", "Email cannot be sent, please try again later!");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @Override
    public void run(String... args) throws Exception {
//        int appointmentId = 1;
//        AppointmentDTO appointmentDTO = apiService.getAppointmentById(appointmentId);
//
//        int patientId = appointmentDTO.getPatientId();
//        PatientDTO patientDTO = apiService.getPatientById(patientId);
//
//        String toEmail = "tuyetan419@gmail.com";
//        String subject = "Xác nhận lịch hẹn khám chữa bệnh";
//        Map<String, Object> body = getBody(patientDTO, appointmentDTO);
//
//        emailService.sendEmailHtml(toEmail, subject, body);
//        System.out.println("Gui mail thanh cong");
//        System.out.println(body);
    }

    private static Map<String, Object> getBody(PatientDTO patientDTO, AppointmentDTO appointmentDTO) {
        String patientName = patientDTO.getFullName();
        String appointmentTime = appointmentDTO.getAppointmentTimeString();

        // Temporary fixed doctor name wait until the doctor service completes
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
