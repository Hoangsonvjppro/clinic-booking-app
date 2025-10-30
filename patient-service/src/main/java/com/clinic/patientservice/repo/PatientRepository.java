package com.clinic.patientservice.repo;

import com.clinic.patientservice.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, Long>, JpaSpecificationExecutor<Patient> {
    Optional<Patient> findByEmail(String email);
    Optional<Patient> findByEmailIgnoreCase(String email);
    boolean existsByEmail(String email);
    boolean existsByPatientCode(String patientCode);
}
