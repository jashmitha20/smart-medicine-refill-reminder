package com.medicinerefill.smartmedicine.controller;

import com.medicinerefill.smartmedicine.model.Medicine;
import com.medicinerefill.smartmedicine.model.User;
import com.medicinerefill.smartmedicine.repository.MedicineRepository;
import com.medicinerefill.smartmedicine.service.NotificationSchedulerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    
    @Autowired
    private NotificationSchedulerService notificationSchedulerService;
    
    @Autowired
    private MedicineRepository medicineRepository;
    
    @PostMapping("/trigger-reminder-check")
    public ResponseEntity<Map<String, String>> triggerManualReminderCheck() {
        try {
            notificationSchedulerService.triggerManualReminderCheck();
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Manual reminder check triggered successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Failed to trigger reminder check: " + e.getMessage());
            
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    @PostMapping("/send-immediate-reminder/{medicineId}")
    public ResponseEntity<Map<String, String>> sendImmediateReminder(@PathVariable Long medicineId, 
                                                                     Authentication authentication) {
        try {
            User currentUser = (User) authentication.getPrincipal();
            Medicine medicine = medicineRepository.findById(medicineId)
                    .filter(m -> m.getUser().getId().equals(currentUser.getId()))
                    .orElse(null);
            
            if (medicine == null) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Medicine not found");
                return ResponseEntity.notFound().build();
            }
            
            notificationSchedulerService.sendImmediateReminder(currentUser, medicine);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Immediate reminder sent successfully for " + medicine.getMedicineName());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Failed to send immediate reminder: " + e.getMessage());
            
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    @GetMapping("/status")
    public ResponseEntity<Map<String, String>> getNotificationStatus() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "Notification service is active");
        response.put("dailyReminders", "Scheduled at 9:00 AM daily");
        response.put("weeklyReminders", "Scheduled at 10:00 AM every Monday");
        
        return ResponseEntity.ok(response);
    }
}