package com.test89.property_catalog_service.service;

import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendWelcomeEmail(String to, String username) {
        String subject = "Welcome to Property Management System";
        String body = "<h3>Hi " + username + ",</h3>" +
                "<p>Welcome to our platform!</p>" +
                "<p>You can now browse and book your dream property.</p>" +
                "<br><p>Thanks,<br>Property Management / Catalog Team</p>";

        sendEmail(to, subject, body);
    }

    public void sendEmail(String to, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true); // true = HTML
            mailSender.send(message);
        } catch (MessagingException e) {
            // TODO: Need to handle failure
            throw new RuntimeException("Failed to send email: " + subject, e);
        }
    }
}