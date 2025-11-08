package com.clinic.notificationservice.controller;

import com.clinic.notificationservice.services.EmailService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class EmailController implements CommandLineRunner {

    private final EmailService emailService;

    public EmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    @Override
    public void run(String... args) throws Exception {
        String toEmail = "tuyetan419@gmail.com";
        String subject = "Test notification service";
        String body = "Hello world";
        emailService.sendEmail(toEmail, subject, body);
    }
}
