package com.medicinerefill.smartmedicine;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SmartMedicineApplication {
    public static void main(String[] args) {
        SpringApplication.run(SmartMedicineApplication.class, args);
    }
}