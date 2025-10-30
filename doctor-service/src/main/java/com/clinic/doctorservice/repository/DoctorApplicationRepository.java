package com.clinic.doctorservice.repository;

import com.clinic.doctorservice.model.DoctorApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface DoctorApplicationRepository extends JpaRepository<DoctorApplication, UUID> {
    Optional<DoctorApplication> findByUserId(UUID userId);
}