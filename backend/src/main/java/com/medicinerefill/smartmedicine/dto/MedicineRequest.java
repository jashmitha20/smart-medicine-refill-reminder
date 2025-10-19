package com.medicinerefill.smartmedicine.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;

public class MedicineRequest {
    
    @NotBlank
    private String medicineName;
    
    @NotNull
    @Positive
    private Integer dosagePerDay;
    
    @NotNull
    @Positive
    private Integer totalQuantity;
    
    @NotNull
    private LocalDate startDate;
    
    private Integer currentQuantity;
    
    private Boolean notificationsEnabled = true;
    
    private Integer lowStockThreshold = 5;
    
    public MedicineRequest() {}
    
    public MedicineRequest(String medicineName, Integer dosagePerDay, Integer totalQuantity, LocalDate startDate) {
        this.medicineName = medicineName;
        this.dosagePerDay = dosagePerDay;
        this.totalQuantity = totalQuantity;
        this.startDate = startDate;
        this.currentQuantity = totalQuantity;
    }
    
    // Getters and setters
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
}