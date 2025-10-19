package com.medicinerefill.smartmedicine.repository;

import com.medicinerefill.smartmedicine.model.Medicine;
import com.medicinerefill.smartmedicine.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Long> {
    
    List<Medicine> findByUser(User user);
    
    List<Medicine> findByUserOrderByRefillDateAsc(User user);
    
    @Query("SELECT m FROM Medicine m WHERE m.user = :user AND m.status = :status")
    List<Medicine> findByUserAndStatus(@Param("user") User user, @Param("status") Medicine.MedicineStatus status);
    
    @Query("SELECT m FROM Medicine m WHERE m.refillDate <= :date AND m.notificationsEnabled = true AND m.user.emailNotificationsEnabled = true")
    List<Medicine> findMedicinesNeedingRefillReminder(@Param("date") LocalDate date);
    
    @Query("SELECT m FROM Medicine m WHERE m.refillDate BETWEEN :startDate AND :endDate AND m.notificationsEnabled = true AND m.user.emailNotificationsEnabled = true")
    List<Medicine> findMedicinesNeedingRefillReminderBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT COUNT(m) FROM Medicine m WHERE m.user = :user AND m.status = 'REFILL_NEEDED'")
    long countRefillNeededByUser(@Param("user") User user);
    
    @Query("SELECT COUNT(m) FROM Medicine m WHERE m.user = :user AND m.status = 'LOW'")
    long countLowStockByUser(@Param("user") User user);
}