package com.medicinerefill.smartmedicine.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Entity
@Table(name = "medicines")
public class Medicine {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Column(name = "medicine_name")
    private String medicineName;
    
    @NotNull
    @Positive
    @Column(name = "dosage_per_day")
    private Integer dosagePerDay;
    
    @NotNull
    @Positive
    @Column(name = "total_quantity")
    private Integer totalQuantity;
    
    @NotNull
    @Column(name = "start_date")
    private LocalDate startDate;
    
    @Column(name = "refill_date")
    private LocalDate refillDate;
    
    @Column(name = "current_quantity")
    private Integer currentQuantity;
    
    @Column(name = "notifications_enabled")
    private Boolean notificationsEnabled = true;
    
    @Column(name = "low_stock_threshold")
    private Integer lowStockThreshold = 5; // Days before refill
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Enumerated(EnumType.STRING)
    private MedicineStatus status;
    
    public enum MedicineStatus {
        OK,
        LOW,
        REFILL_NEEDED
    }
    
    public Medicine() {}
    
    public Medicine(String medicineName, Integer dosagePerDay, Integer totalQuantity, LocalDate startDate, User user) {
        this.medicineName = medicineName;
        this.dosagePerDay = dosagePerDay;
        this.totalQuantity = totalQuantity;
        this.currentQuantity = totalQuantity;
        this.startDate = startDate;
        this.user = user;
        calculateRefillDate();
        updateStatus();
    }
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (currentQuantity == null) {
            currentQuantity = totalQuantity;
        }
        calculateRefillDate();
        updateStatus();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        calculateRefillDate();
        updateStatus();
    }
    
    public void calculateRefillDate() {
        if (dosagePerDay != null && currentQuantity != null && currentQuantity > 0) {
            int daysUntilEmpty = currentQuantity / dosagePerDay;
            this.refillDate = LocalDate.now().plusDays(daysUntilEmpty);
        } else {
            this.refillDate = LocalDate.now();
        }
    }
    
    public void updateStatus() {
        if (currentQuantity == null || currentQuantity <= 0) {
            this.status = MedicineStatus.REFILL_NEEDED;
        } else {
            long daysLeft = ChronoUnit.DAYS.between(LocalDate.now(), refillDate);
            if (daysLeft <= 0) {
                this.status = MedicineStatus.REFILL_NEEDED;
            } else if (daysLeft <= lowStockThreshold) {
                this.status = MedicineStatus.LOW;
            } else {
                this.status = MedicineStatus.OK;
            }
        }
    }
    
    public int getDaysLeft() {
        if (refillDate == null) {
            return 0;
        }
        long days = ChronoUnit.DAYS.between(LocalDate.now(), refillDate);
        return Math.max(0, (int) days);
    }
    
    public int getRemainingDoses() {
        return currentQuantity != null ? currentQuantity : 0;
    }
    
    public void takeDose() {
        if (currentQuantity != null && currentQuantity > 0) {
            currentQuantity--;
            calculateRefillDate();
            updateStatus();
        }
    }
    
    public void refillMedicine(int quantity) {
        if (currentQuantity == null) {
            currentQuantity = quantity;
        } else {
            currentQuantity += quantity;
        }
        totalQuantity = currentQuantity; // Update total quantity on refill
        calculateRefillDate();
        updateStatus();
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
        calculateRefillDate();
        updateStatus();
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
        calculateRefillDate();
        updateStatus();
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
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public MedicineStatus getStatus() {
        return status;
    }
    
    public void setStatus(MedicineStatus status) {
        this.status = status;
    }
}