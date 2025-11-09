package com.clinic.notificationservice.controller;

import com.clinic.notificationservice.services.EmailService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class EmailController implements CommandLineRunner {

    private final EmailService emailService;

    public EmailController(EmailService emailService) {
        this.emailService = emailService;
    }

//    @Override
//    public void run(String... args) throws Exception {
//        String toEmail = "tuyetan419@gmail.com";
//        String subject = "Test notification service";
//        String body = "Hello world";
//        emailService.sendEmail(toEmail, subject, body);
//    }

    @Override
    public void run(String... args) throws Exception {
        String toEmail = "tuyetan419@gmail.com";
        String subject = "Xác nhận lịch hẹn khám chữa bệnh";
        Map<String, Object> body = Map.of(
                "patientName", "Nguyễn Khắc Đông Quân",
                "appointmentTime", "12/11/2025 09:00:00",
                "doctorName", "Võ Cao Sang",
                "notes", "Kiểm tra tình trạng sức khỏe",
                "status", "Đã xác nhận"
        );
        emailService.sendEmailHtml(toEmail, subject, body);
        System.out.println("Gui mail thanh cong");
    }
}
