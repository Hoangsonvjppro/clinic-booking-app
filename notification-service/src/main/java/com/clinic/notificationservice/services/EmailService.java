package com.clinic.notificationservice.services;

import com.clinic.notificationservice.utils.EmailProcessor;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final EmailProcessor emailProcessor;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender, EmailProcessor emailProcessor) {
        this.mailSender = mailSender;
        this.emailProcessor = emailProcessor;
    }

    public void sendEmailHtml(String toEmail, String subject, Map<String, Object> variables) throws MessagingException {
        // Prepare thymeleaf context
        String htmlContent = emailProcessor.renderAppointmentEmail(variables);

        // Prepare mime message
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setFrom(fromEmail);
        helper.setTo(toEmail);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);

        mailSender.send(message);
    }
}
