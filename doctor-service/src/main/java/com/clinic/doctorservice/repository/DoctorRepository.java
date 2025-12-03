package com.clinic.doctorservice.repository;

import com.clinic.doctorservice.model.Doctor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DoctorRepository extends JpaRepository<Doctor, UUID> {
    
    Optional<Doctor> findByUserId(UUID userId);
    
    // Find doctors by status
    List<Doctor> findByStatus(String status);
    
    // Find doctors by status with pagination
    Page<Doctor> findByStatus(String status, Pageable pageable);
    
    // Count doctors by status
    long countByStatus(String status);
    
    // Search doctors by name or specialty
    @Query("SELECT d FROM Doctor d LEFT JOIN d.specialties s " +
           "WHERE d.status = 'APPROVED' AND " +
           "(LOWER(d.fullName) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Doctor> searchByNameOrSpecialty(@Param("query") String query);
    
    // Find doctors by specialty name
    @Query("SELECT d FROM Doctor d JOIN d.specialties s " +
           "WHERE d.status = 'APPROVED' AND LOWER(s.name) = LOWER(:specialty)")
    List<Doctor> findBySpecialty(@Param("specialty") String specialty);
    
    // Find top rated doctors (assuming there's a rating field or calculating from reviews)
    @Query("SELECT d FROM Doctor d WHERE d.status = 'APPROVED' ORDER BY d.consultationFee ASC")
    List<Doctor> findTopRated(Pageable pageable);
}
