package com.medicinerefill.smartmedicine.controller;

import com.medicinerefill.smartmedicine.dto.MedicineRequest;
import com.medicinerefill.smartmedicine.dto.MedicineResponse;
import com.medicinerefill.smartmedicine.model.Medicine;
import com.medicinerefill.smartmedicine.model.User;
import com.medicinerefill.smartmedicine.repository.MedicineRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/medicines")
public class MedicineController {
    
    @Autowired
    private MedicineRepository medicineRepository;
    
    @GetMapping
    public ResponseEntity<List<MedicineResponse>> getAllMedicines(Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        List<Medicine> medicines = medicineRepository.findByUserOrderByRefillDateAsc(currentUser);
        
        List<MedicineResponse> response = medicines.stream()
                .map(MedicineResponse::new)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<MedicineResponse> getMedicineById(@PathVariable Long id, Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        Medicine medicine = medicineRepository.findById(id)
                .filter(m -> m.getUser().getId().equals(currentUser.getId()))
                .orElse(null);
        
        if (medicine == null) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(new MedicineResponse(medicine));
    }
    
    @PostMapping
    public ResponseEntity<MedicineResponse> createMedicine(@Valid @RequestBody MedicineRequest request, 
                                                         Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        
        Medicine medicine = new Medicine(
                request.getMedicineName(),
                request.getDosagePerDay(),
                request.getTotalQuantity(),
                request.getStartDate(),
                currentUser
        );
        
        if (request.getCurrentQuantity() != null) {
            medicine.setCurrentQuantity(request.getCurrentQuantity());
        }
        
        if (request.getNotificationsEnabled() != null) {
            medicine.setNotificationsEnabled(request.getNotificationsEnabled());
        }
        
        if (request.getLowStockThreshold() != null) {
            medicine.setLowStockThreshold(request.getLowStockThreshold());
        }
        
        Medicine savedMedicine = medicineRepository.save(medicine);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(new MedicineResponse(savedMedicine));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<MedicineResponse> updateMedicine(@PathVariable Long id,
                                                         @Valid @RequestBody MedicineRequest request,
                                                         Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        Medicine medicine = medicineRepository.findById(id)
                .filter(m -> m.getUser().getId().equals(currentUser.getId()))
                .orElse(null);
        
        if (medicine == null) {
            return ResponseEntity.notFound().build();
        }
        
        medicine.setMedicineName(request.getMedicineName());
        medicine.setDosagePerDay(request.getDosagePerDay());
        medicine.setTotalQuantity(request.getTotalQuantity());
        medicine.setStartDate(request.getStartDate());
        
        if (request.getCurrentQuantity() != null) {
            medicine.setCurrentQuantity(request.getCurrentQuantity());
        }
        
        if (request.getNotificationsEnabled() != null) {
            medicine.setNotificationsEnabled(request.getNotificationsEnabled());
        }
        
        if (request.getLowStockThreshold() != null) {
            medicine.setLowStockThreshold(request.getLowStockThreshold());
        }
        
        Medicine updatedMedicine = medicineRepository.save(medicine);
        
        return ResponseEntity.ok(new MedicineResponse(updatedMedicine));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMedicine(@PathVariable Long id, Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        Medicine medicine = medicineRepository.findById(id)
                .filter(m -> m.getUser().getId().equals(currentUser.getId()))
                .orElse(null);
        
        if (medicine == null) {
            return ResponseEntity.notFound().build();
        }
        
        medicineRepository.delete(medicine);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Medicine deleted successfully");
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/{id}/take-dose")
    public ResponseEntity<MedicineResponse> takeDose(@PathVariable Long id, Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        Medicine medicine = medicineRepository.findById(id)
                .filter(m -> m.getUser().getId().equals(currentUser.getId()))
                .orElse(null);
        
        if (medicine == null) {
            return ResponseEntity.notFound().build();
        }
        
        medicine.takeDose();
        Medicine updatedMedicine = medicineRepository.save(medicine);
        
        return ResponseEntity.ok(new MedicineResponse(updatedMedicine));
    }
    
    @PostMapping("/{id}/refill")
    public ResponseEntity<MedicineResponse> refillMedicine(@PathVariable Long id,
                                                         @RequestParam int quantity,
                                                         Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        Medicine medicine = medicineRepository.findById(id)
                .filter(m -> m.getUser().getId().equals(currentUser.getId()))
                .orElse(null);
        
        if (medicine == null) {
            return ResponseEntity.notFound().build();
        }
        
        medicine.refillMedicine(quantity);
        Medicine updatedMedicine = medicineRepository.save(medicine);
        
        return ResponseEntity.ok(new MedicineResponse(updatedMedicine));
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<MedicineResponse>> getMedicinesByStatus(@PathVariable Medicine.MedicineStatus status,
                                                                     Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        List<Medicine> medicines = medicineRepository.findByUserAndStatus(currentUser, status);
        
        List<MedicineResponse> response = medicines.stream()
                .map(MedicineResponse::new)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/dashboard-summary")
    public ResponseEntity<Map<String, Object>> getDashboardSummary(Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        
        List<Medicine> allMedicines = medicineRepository.findByUser(currentUser);
        long refillNeededCount = medicineRepository.countRefillNeededByUser(currentUser);
        long lowStockCount = medicineRepository.countLowStockByUser(currentUser);
        
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalMedicines", allMedicines.size());
        summary.put("refillNeeded", refillNeededCount);
        summary.put("lowStock", lowStockCount);
        summary.put("ok", allMedicines.size() - refillNeededCount - lowStockCount);
        
        List<MedicineResponse> recentMedicines = allMedicines.stream()
                .limit(5)
                .map(MedicineResponse::new)
                .collect(Collectors.toList());
        
        summary.put("recentMedicines", recentMedicines);
        
        return ResponseEntity.ok(summary);
    }
}