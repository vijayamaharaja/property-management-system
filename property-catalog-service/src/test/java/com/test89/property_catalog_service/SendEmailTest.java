package com.test89.property_catalog_service;

import org.springframework.mail.MailAuthenticationException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import static org.testcontainers.shaded.org.bouncycastle.cert.DeltaCertificateTool.subject;

public class SendEmailTest {
    private static JavaMailSender mailSender = null;

    public SendEmailTest(JavaMailSender mailSender) {
        SendEmailTest.mailSender = mailSender;
    }

    public static void main(String[] args) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo("vxr016@gmail.com");
            message.setSubject("Test email");
            message.setText("Sneak peek at the email content");
            mailSender.send(message);
        } catch (MailAuthenticationException e) {
            throw new RuntimeException("Email authentication failed. Check your Mailtrap credentials.", e);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send email: " + subject, e);
        }

    }
}
