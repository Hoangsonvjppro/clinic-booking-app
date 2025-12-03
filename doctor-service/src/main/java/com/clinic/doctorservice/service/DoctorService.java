package com.clinic.doctorservice.service;

import com.clinic.doctorservice.model.Doctor;
import com.clinic.doctorservice.repository.DoctorRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;

    public DoctorService(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    /**
     * Get all approved doctors with pagination and sorting
     */
    public Page<Doctor> getApprovedDoctors(int page, int size, String sortBy, String sortDir) {
        // Map frontend sort fields to actual Doctor entity fields
        String actualSortField = mapSortField(sortBy);
        
        Sort sort = sortDir.equalsIgnoreCase("desc") 
            ? Sort.by(actualSortField).descending() 
            : Sort.by(actualSortField).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        return doctorRepository.findByStatus("APPROVED", pageable);
    }

    /**
     * Map frontend sort field names to actual entity field names
     */
    private String mapSortField(String sortBy) {
        return switch (sortBy.toLowerCase()) {
            case "rating" -> "experienceYears"; // Rating not in DB, use experienceYears as proxy
            case "name" -> "fullName";
            case "price", "fee" -> "consultationFee";
            case "experience" -> "experienceYears";
            default -> "fullName"; // Default safe field
        };
    }

    /**
     * Get all approved doctors (no pagination)
     */
    public List<Doctor> getAllApprovedDoctors() {
        return doctorRepository.findByStatus("APPROVED");
    }

    /**
     * Get doctor by ID
     */
    public Optional<Doctor> getDoctorById(UUID id) {
        return doctorRepository.findById(id);
    }

    /**
     * Get doctor by user ID
     */
    public Optional<Doctor> getDoctorByUserId(UUID userId) {
        return doctorRepository.findByUserId(userId);
    }

    /**
     * Search doctors by name or specialty
     */
    public List<Doctor> searchDoctors(String query) {
        return doctorRepository.searchByNameOrSpecialty(query);
    }

    /**
     * Get doctors by specialty
     */
    public List<Doctor> getDoctorsBySpecialty(String specialty) {
        return doctorRepository.findBySpecialty(specialty);
    }

    /**
     * Get top rated doctors
     * Since rating is calculated from reviews, we use experienceYears as proxy
     */
    public List<Doctor> getTopRatedDoctors(int limit) {
        Pageable pageable = PageRequest.of(0, limit, Sort.by("experienceYears").descending());
        return doctorRepository.findByStatus("APPROVED", pageable).getContent();
    }

    /**
     * Count all approved doctors
     */
    public long countApprovedDoctors() {
        return doctorRepository.countByStatus("APPROVED");
    }
}
