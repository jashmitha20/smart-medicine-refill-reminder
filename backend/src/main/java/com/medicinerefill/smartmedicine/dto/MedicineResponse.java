package com.medicinerefill.smartmedicine.dto;

import com.medicinerefill.smartmedicine.model.Medicine;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class MedicineResponse {
    
    private Long id;
    private String medicineName;
    private Integer dosagePerDay;
    private Integer totalQuantity;
    private LocalDate startDate;
    private LocalDate refillDate;
    private Integer currentQuantity;
    private Boolean notificationsEnabled;
    private Integer lowStockThreshold;
    private Medicine.MedicineStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Calculated fields
    private int daysLeft;
    private int remainingDoses;
    private String refillUrl;
    
    public MedicineResponse() {}
    
    public MedicineResponse(Medicine medicine) {
        this.id = medicine.getId();
        this.medicineName = medicine.getMedicineName();
        this.dosagePerDay = medicine.getDosagePerDay();
        this.totalQuantity = medicine.getTotalQuantity();
        this.startDate = medicine.getStartDate();
        this.refillDate = medicine.getRefillDate();
        this.currentQuantity = medicine.getCurrentQuantity();
        this.notificationsEnabled = medicine.getNotificationsEnabled();
        this.lowStockThreshold = medicine.getLowStockThreshold();
        this.status = medicine.getStatus();
        this.createdAt = medicine.getCreatedAt();
        this.updatedAt = medicine.getUpdatedAt();
        
        // Calculate derived fields
        this.daysLeft = medicine.getDaysLeft();
        this.remainingDoses = medicine.getRemainingDoses();
        this.refillUrl = "https://www.1mg.com/search/all?name=" + medicine.getMedicineName().replace(" ", "%20");
    }
    
    // Getters and setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getMedicineName() {
        return medicineName;
    }
    
    public void setMedicineName(String medicineName) {
        this.medicineName = medicineName;
    }
    
    public Integer getDosagePerDay() {
        return dosagePerDay;
    }
    
    public void setDosagePerDay(Integer dosagePerDay) {
        this.dosagePerDay = dosagePerDay;
    }
    
    public Integer getTotalQuantity() {
        return totalQuantity;
    }
    
    public void setTotalQuantity(Integer totalQuantity) {
        this.totalQuantity = totalQuantity;
    }
    
    public LocalDate getStartDate() {
        return startDate;
    }
    
    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }
    
    public LocalDate getRefillDate() {
        return refillDate;
    }
    
    public void setRefillDate(LocalDate refillDate) {
        this.refillDate = refillDate;
    }
    
    public Integer getCurrentQuantity() {
        return currentQuantity;
    }
    
    public void setCurrentQuantity(Integer currentQuantity) {
        this.currentQuantity = currentQuantity;
    }
    
    public Boolean getNotificationsEnabled() {
        return notificationsEnabled;
    }
    
    public void setNotificationsEnabled(Boolean notificationsEnabled) {
        this.notificationsEnabled = notificationsEnabled;
    }
    
    public Integer getLowStockThreshold() {
        return lowStockThreshold;
    }
    
    public void setLowStockThreshold(Integer lowStockThreshold) {
        this.lowStockThreshold = lowStockThreshold;
    }
    
    public Medicine.MedicineStatus getStatus() {
        return status;
    }
    
    public void setStatus(Medicine.MedicineStatus status) {
        this.status = status;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public int getDaysLeft() {
        return daysLeft;
    }
    
    public void setDaysLeft(int daysLeft) {
        this.daysLeft = daysLeft;
    }
    
    public int getRemainingDoses() {
        return remainingDoses;
    }
    
    public void setRemainingDoses(int remainingDoses) {
        this.remainingDoses = remainingDoses;
    }
    
    public String getRefillUrl() {
        return refillUrl;
    }
    
    public void setRefillUrl(String refillUrl) {
        this.refillUrl = refillUrl;
    }
}