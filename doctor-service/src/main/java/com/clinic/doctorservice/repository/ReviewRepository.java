package com.clinic.doctorservice.repository;

import com.clinic.doctorservice.model.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    Page<Review> findByDoctorId(UUID doctorId, Pageable pageable);
    boolean existsByAppointmentId(Long appointmentId);
}
