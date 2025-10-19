package com.medicinerefill.smartmedicine.service;

import com.medicinerefill.smartmedicine.model.Medicine;
import com.medicinerefill.smartmedicine.model.User;
import com.medicinerefill.smartmedicine.repository.MedicineRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class NotificationSchedulerService {
    
    private static final Logger logger = LoggerFactory.getLogger(NotificationSchedulerService.class);
    
    @Autowired
    private MedicineRepository medicineRepository;
    
    @Autowired
    private EmailService emailService;
    
    // Run every day at 9:00 AM
    @Scheduled(cron = "0 0 9 * * *")
    public void sendDailyRefillReminders() {
        logger.info("Starting daily refill reminder check...");
        
        try {
            LocalDate today = LocalDate.now();
            LocalDate nextWeek = today.plusDays(7);
            
            // Find medicines needing refill reminders (refill date is today or within next 7 days)
            List<Medicine> medicinesNeedingReminder = medicineRepository
                    .findMedicinesNeedingRefillReminderBetween(today, nextWeek);
            
            if (medicinesNeedingReminder.isEmpty()) {
                logger.info("No medicines need refill reminders today.");
                return;
            }
            
            // Group medicines by user
            Map<User, List<Medicine>> medicinesByUser = medicinesNeedingReminder.stream()
                    .collect(Collectors.groupingBy(Medicine::getUser));
            
            int totalEmailsSent = 0;
            
            for (Map.Entry<User, List<Medicine>> entry : medicinesByUser.entrySet()) {
                User user = entry.getKey();
                List<Medicine> userMedicines = entry.getValue();
                
                try {
                    if (userMedicines.size() == 1) {
                        // Send single medicine reminder
                        emailService.sendRefillReminder(user, userMedicines.get(0));
                    } else {
                        // Send multiple medicines reminder
                        emailService.sendMultipleRefillReminders(user, userMedicines);
                    }
                    
                    totalEmailsSent++;
                    logger.info("Sent refill reminder to user: {} for {} medicine(s)", 
                              user.getEmail(), userMedicines.size());
                    
                } catch (Exception e) {
                    logger.error("Failed to send refill reminder to user: {}", user.getEmail(), e);
                }
            }
            
            logger.info("Daily refill reminder check completed. Sent {} emails to {} users.", 
                       totalEmailsSent, medicinesByUser.size());
            
        } catch (Exception e) {
            logger.error("Error during daily refill reminder check", e);
        }
    }
    
    // Run every Monday at 10:00 AM for weekly summary
    @Scheduled(cron = "0 0 10 * * MON")
    public void sendWeeklyMedicineSummary() {
        logger.info("Starting weekly medicine summary...");
        
        try {
            LocalDate today = LocalDate.now();
            
            // Find medicines that will need refill in the next 14 days
            List<Medicine> upcomingRefills = medicineRepository
                    .findMedicinesNeedingRefillReminderBetween(today, today.plusDays(14));
            
            if (upcomingRefills.isEmpty()) {
                logger.info("No medicines need attention in the next 2 weeks.");
                return;
            }
            
            // Group by user
            Map<User, List<Medicine>> medicinesByUser = upcomingRefills.stream()
                    .collect(Collectors.groupingBy(Medicine::getUser));
            
            int totalEmailsSent = 0;
            
            for (Map.Entry<User, List<Medicine>> entry : medicinesByUser.entrySet()) {
                User user = entry.getKey();
                List<Medicine> userMedicines = entry.getValue();
                
                try {
                    sendWeeklySummaryEmail(user, userMedicines);
                    totalEmailsSent++;
                    
                    logger.info("Sent weekly summary to user: {} for {} medicine(s)", 
                              user.getEmail(), userMedicines.size());
                    
                } catch (Exception e) {
                    logger.error("Failed to send weekly summary to user: {}", user.getEmail(), e);
                }
            }
            
            logger.info("Weekly medicine summary completed. Sent {} emails.", totalEmailsSent);
            
        } catch (Exception e) {
            logger.error("Error during weekly medicine summary", e);
        }
    }
    
    private void sendWeeklySummaryEmail(User user, List<Medicine> medicines) {
        String subject = "Weekly Medicine Summary - " + medicines.size() + " medicine(s) need attention";
        
        StringBuilder html = new StringBuilder();
        html.append("<!DOCTYPE html>")
            .append("<html><head><meta charset='UTF-8'><title>Weekly Medicine Summary</title>")
            .append("<style>")
            .append("body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }")
            .append(".container { max-width: 600px; margin: 0 auto; padding: 20px; }")
            .append(".header { background-color: #2196F3; color: white; padding: 20px; text-align: center; }")
            .append(".content { padding: 20px; background-color: #f9f9f9; }")
            .append(".medicine-info { background-color: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #2196F3; }")
            .append(".status { padding: 5px 10px; border-radius: 3px; color: white; font-weight: bold; }")
            .append(".status.ok { background-color: #4CAF50; }")
            .append(".status.low { background-color: #ff9800; }")
            .append(".status.refill-needed { background-color: #f44336; }")
            .append("</style></head><body>")
            .append("<div class='container'>")
            .append("<div class='header'>")
            .append("<h1>Weekly Medicine Summary</h1>")
            .append("</div>")
            .append("<div class='content'>")
            .append("<p>Dear ").append(user.getName()).append(",</p>")
            .append("<p>Here's your weekly medicine summary for the next 2 weeks:</p>");
        
        for (Medicine medicine : medicines) {
            html.append("<div class='medicine-info'>")
                .append("<h3>").append(medicine.getMedicineName()).append("</h3>")
                .append("<p><strong>Remaining Doses:</strong> ").append(medicine.getRemainingDoses()).append(" | ")
                .append("<strong>Days Left:</strong> ").append(medicine.getDaysLeft()).append("</p>")
                .append("<p><strong>Status:</strong> <span class='status ")
                .append(medicine.getStatus().toString().toLowerCase().replace("_", "-")).append("'>")
                .append(medicine.getStatus().toString().replace("_", " ")).append("</span></p>")
                .append("<p><strong>Refill Date:</strong> ").append(medicine.getRefillDate()).append("</p>")
                .append("</div>");
        }
        
        html.append("<p>Please plan ahead to ensure you don't run out of your medications!</p>")
            .append("<p>You can manage your medicines by logging into your Smart Medicine Refill System dashboard.</p>")
            .append("<p>Best regards,<br>Smart Medicine Refill System</p>")
            .append("</div>")
            .append("</div>")
            .append("</body></html>");
        
        emailService.sendHtmlEmail(user.getEmail(), subject, html.toString());
    }
    
    // Manual trigger for testing - can be called via API
    public void triggerManualReminderCheck() {
        logger.info("Manual reminder check triggered");
        sendDailyRefillReminders();
    }
    
    public void sendImmediateReminder(User user, Medicine medicine) {
        logger.info("Sending immediate reminder for medicine: {} to user: {}", 
                   medicine.getMedicineName(), user.getEmail());
        emailService.sendRefillReminder(user, medicine);
    }
}