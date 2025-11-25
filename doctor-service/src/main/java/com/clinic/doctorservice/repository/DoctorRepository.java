package com.clinic.doctorservice.repository;

import com.clinic.doctorservice.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface DoctorRepository extends JpaRepository<Doctor, UUID> {
}
