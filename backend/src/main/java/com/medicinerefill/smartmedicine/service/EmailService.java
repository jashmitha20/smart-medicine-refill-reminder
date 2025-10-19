package com.medicinerefill.smartmedicine.service;

import com.medicinerefill.smartmedicine.model.Medicine;
import com.medicinerefill.smartmedicine.model.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.util.List;

@Service
public class EmailService {
    
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    
    @Autowired
    private JavaMailSender mailSender;
    
    @Value("${spring.mail.username}")
    private String fromEmail;
    
    public void sendSimpleEmail(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            
            mailSender.send(message);
            logger.info("Email sent successfully to: {}", to);
        } catch (Exception e) {
            logger.error("Failed to send email to: {}", to, e);
        }
    }
    
    public void sendHtmlEmail(String to, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
            logger.info("HTML Email sent successfully to: {}", to);
        } catch (MessagingException e) {
            logger.error("Failed to send HTML email to: {}", to, e);
        }
    }
    
    public void sendRefillReminder(User user, Medicine medicine) {
        String subject = "Medicine Refill Reminder - " + medicine.getMedicineName();
        
        String htmlContent = buildRefillReminderHtml(user, medicine);
        
        sendHtmlEmail(user.getEmail(), subject, htmlContent);
    }
    
    public void sendMultipleRefillReminders(User user, List<Medicine> medicines) {
        String subject = "Multiple Medicine Refill Reminders";
        
        String htmlContent = buildMultipleRefillReminderHtml(user, medicines);
        
        sendHtmlEmail(user.getEmail(), subject, htmlContent);
    }
    
    private String buildRefillReminderHtml(User user, Medicine medicine) {
        StringBuilder html = new StringBuilder();
        
        html.append("<!DOCTYPE html>")
            .append("<html><head><meta charset='UTF-8'><title>Medicine Refill Reminder</title>")
            .append("<style>")
            .append("body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }")
            .append(".container { max-width: 600px; margin: 0 auto; padding: 20px; }")
            .append(".header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }")
            .append(".content { padding: 20px; background-color: #f9f9f9; }")
            .append(".medicine-info { background-color: white; padding: 15px; margin: 10px 0; border-radius: 5px; }")
            .append(".status { padding: 5px 10px; border-radius: 3px; color: white; font-weight: bold; }")
            .append(".status.low { background-color: #ff9800; }")
            .append(".status.refill-needed { background-color: #f44336; }")
            .append(".refill-button { background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0; }")
            .append("</style></head><body>")
            .append("<div class='container'>")
            .append("<div class='header'>")
            .append("<h1>Medicine Refill Reminder</h1>")
            .append("</div>")
            .append("<div class='content'>")
            .append("<p>Dear ").append(user.getName()).append(",</p>")
            .append("<p>This is a friendly reminder about your medicine refill:</p>")
            .append("<div class='medicine-info'>")
            .append("<h3>").append(medicine.getMedicineName()).append("</h3>")
            .append("<p><strong>Remaining Doses:</strong> ").append(medicine.getRemainingDoses()).append("</p>")
            .append("<p><strong>Days Left:</strong> ").append(medicine.getDaysLeft()).append("</p>")
            .append("<p><strong>Status:</strong> <span class='status ")
            .append(medicine.getStatus().toString().toLowerCase().replace("_", "-")).append("'>")
            .append(medicine.getStatus().toString().replace("_", " ")).append("</span></p>")
            .append("<p><strong>Refill Date:</strong> ").append(medicine.getRefillDate()).append("</p>")
            .append("</div>")
            .append("<p>Don't run out of your important medication!</p>")
            .append("<a href='https://www.1mg.com/search/all?name=").append(medicine.getMedicineName().replace(" ", "%20"))
            .append("' class='refill-button' target='_blank'>Refill Now</a>")
            .append("<p>You can also manage your medicines by logging into your Smart Medicine Refill System dashboard.</p>")
            .append("<p>Best regards,<br>Smart Medicine Refill System</p>")
            .append("</div>")
            .append("</div>")
            .append("</body></html>");
        
        return html.toString();
    }
    
    private String buildMultipleRefillReminderHtml(User user, List<Medicine> medicines) {
        StringBuilder html = new StringBuilder();
        
        html.append("<!DOCTYPE html>")
            .append("<html><head><meta charset='UTF-8'><title>Multiple Medicine Refill Reminders</title>")
            .append("<style>")
            .append("body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }")
            .append(".container { max-width: 600px; margin: 0 auto; padding: 20px; }")
            .append(".header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }")
            .append(".content { padding: 20px; background-color: #f9f9f9; }")
            .append(".medicine-info { background-color: white; padding: 15px; margin: 10px 0; border-radius: 5px; }")
            .append(".status { padding: 5px 10px; border-radius: 3px; color: white; font-weight: bold; }")
            .append(".status.low { background-color: #ff9800; }")
            .append(".status.refill-needed { background-color: #f44336; }")
            .append(".refill-button { background-color: #4CAF50; color: white; padding: 8px 16px; text-decoration: none; border-radius: 3px; font-size: 12px; }")
            .append("</style></head><body>")
            .append("<div class='container'>")
            .append("<div class='header'>")
            .append("<h1>Multiple Medicine Refill Reminders</h1>")
            .append("</div>")
            .append("<div class='content'>")
            .append("<p>Dear ").append(user.getName()).append(",</p>")
            .append("<p>You have ").append(medicines.size()).append(" medicine(s) that need attention:</p>");
        
        for (Medicine medicine : medicines) {
            html.append("<div class='medicine-info'>")
                .append("<h3>").append(medicine.getMedicineName()).append("</h3>")
                .append("<p><strong>Remaining Doses:</strong> ").append(medicine.getRemainingDoses()).append(" | ")
                .append("<strong>Days Left:</strong> ").append(medicine.getDaysLeft()).append("</p>")
                .append("<p><strong>Status:</strong> <span class='status ")
                .append(medicine.getStatus().toString().toLowerCase().replace("_", "-")).append("'>")
                .append(medicine.getStatus().toString().replace("_", " ")).append("</span> | ")
                .append("<strong>Refill Date:</strong> ").append(medicine.getRefillDate()).append("</p>")
                .append("<a href='https://www.1mg.com/search/all?name=").append(medicine.getMedicineName().replace(" ", "%20"))
                .append("' class='refill-button' target='_blank'>Refill Now</a>")
                .append("</div>");
        }
        
        html.append("<p>Please ensure you don't run out of your important medications!</p>")
            .append("<p>You can also manage all your medicines by logging into your Smart Medicine Refill System dashboard.</p>")
            .append("<p>Best regards,<br>Smart Medicine Refill System</p>")
            .append("</div>")
            .append("</div>")
            .append("</body></html>");
        
        return html.toString();
    }
}