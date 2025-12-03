package com.clinic.doctorservice.controller;

import com.clinic.doctorservice.dto.DoctorDTO;
import com.clinic.doctorservice.dto.DoctorListResponse;
import com.clinic.doctorservice.model.Doctor;
import com.clinic.doctorservice.model.Review;
import com.clinic.doctorservice.repository.ReviewRepository;
import com.clinic.doctorservice.service.DoctorService;
import com.clinic.doctorservice.service.DoctorScheduleService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/doctors")
public class DoctorPublicController {

    private final DoctorService doctorService;
    private final ReviewRepository reviewRepository;
    private final DoctorScheduleService scheduleService;

    public DoctorPublicController(DoctorService doctorService, 
                                   ReviewRepository reviewRepository,
                                   DoctorScheduleService scheduleService) {
        this.doctorService = doctorService;
        this.reviewRepository = reviewRepository;
        this.scheduleService = scheduleService;
    }

    /**
     * Get all approved doctors with pagination and sorting
     * GET /api/v1/doctors?page=0&limit=10&sort=rating&order=desc
     */
    @GetMapping
    public ResponseEntity<DoctorListResponse> getDoctors(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "limit", defaultValue = "10") int limit,
            @RequestParam(name = "sort", defaultValue = "fullName") String sort,
            @RequestParam(name = "order", defaultValue = "asc") String order,
            @RequestParam(name = "specialty", required = false) String specialty,
            @RequestParam(name = "search", required = false) String search
    ) {
        List<Doctor> doctors;
        
        if (search != null && !search.isEmpty()) {
            doctors = doctorService.searchDoctors(search);
        } else if (specialty != null && !specialty.isEmpty()) {
            doctors = doctorService.getDoctorsBySpecialty(specialty);
        } else {
            Page<Doctor> doctorPage = doctorService.getApprovedDoctors(page, limit, sort, order);
            doctors = doctorPage.getContent();
        }
        
        List<DoctorDTO> doctorDTOs = doctors.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        
        DoctorListResponse response = new DoctorListResponse();
        response.setDoctors(doctorDTOs);
        response.setTotal(doctorService.countApprovedDoctors());
        response.setPage(page);
        response.setLimit(limit);
        
        return ResponseEntity.ok(response);
    }

    /**
     * Get doctor by ID
     * GET /api/v1/doctors/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<DoctorDTO> getDoctorById(@PathVariable("id") UUID id) {
        return doctorService.getDoctorById(id)
                .map(doctor -> ResponseEntity.ok(convertToDTO(doctor)))
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Check doctor availability for appointment
     * GET /api/v1/doctors/{id}/availability?appointmentTime=2024-01-15T10:00:00&durationMinutes=30
     */
    @GetMapping("/{id}/availability")
    public ResponseEntity<?> checkDoctorAvailability(
            @PathVariable("id") UUID id,
            @RequestParam("appointmentTime") String appointmentTime,
            @RequestParam(value = "durationMinutes", defaultValue = "30") Integer durationMinutes) {
        
        return doctorService.getDoctorById(id)
                .map(doctor -> {
                    // Check if doctor is approved (status = APPROVED)
                    if (!"APPROVED".equals(doctor.getStatus())) {
                        return ResponseEntity.status(409).body(java.util.Map.of(
                                "available", false,
                                "message", "Doctor is not available for appointments"
                        ));
                    }
                    
                    // Get doctor's schedules to check if the requested time slot is valid
                    java.util.List<com.clinic.doctorservice.model.DoctorSchedule> schedules = 
                            scheduleService.getSchedulesByDoctorId(id);
                    
                    java.time.LocalDateTime requestedTime;
                    try {
                        requestedTime = java.time.LocalDateTime.parse(appointmentTime);
                    } catch (Exception e) {
                        return ResponseEntity.badRequest().body(java.util.Map.of(
                                "available", false,
                                "message", "Invalid appointmentTime format"
                        ));
                    }
                    
                    java.time.DayOfWeek dayOfWeek = requestedTime.getDayOfWeek();
                    java.time.LocalTime requestedTimeOfDay = requestedTime.toLocalTime();
                    
                    // Check if doctor has schedule for this day and time
                    boolean isWithinSchedule = schedules.stream().anyMatch(schedule -> {
                        if (schedule.getDayOfWeek() != dayOfWeek) return false;
                        return !requestedTimeOfDay.isBefore(schedule.getStartTime()) 
                                && !requestedTimeOfDay.plusMinutes(durationMinutes).isAfter(schedule.getEndTime());
                    });
                    
                    if (!isWithinSchedule && !schedules.isEmpty()) {
                        return ResponseEntity.status(409).body(java.util.Map.of(
                                "available", false,
                                "message", "Doctor is not available at the requested time"
                        ));
                    }
                    
                    // Doctor is available (or has no specific schedule restrictions)
                    return ResponseEntity.ok(java.util.Map.of(
                            "available", true,
                            "doctorId", id,
                            "doctorName", doctor.getFullName(),
                            "appointmentTime", appointmentTime,
                            "durationMinutes", durationMinutes
                    ));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Search doctors
     * GET /api/v1/doctors/search?q=cardio
     */
    @GetMapping("/search")
    public ResponseEntity<List<DoctorDTO>> searchDoctors(@RequestParam(name = "q") String q) {
        List<DoctorDTO> doctors = doctorService.searchDoctors(q).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(doctors);
    }

    /**
     * Get doctors by specialty
     * GET /api/v1/doctors/specialty/{specialty}
     */
    @GetMapping("/specialty/{specialty}")
    public ResponseEntity<List<DoctorDTO>> getDoctorsBySpecialty(@PathVariable("specialty") String specialty) {
        List<DoctorDTO> doctors = doctorService.getDoctorsBySpecialty(specialty).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(doctors);
    }

    /**
     * Get top rated doctors
     * GET /api/v1/doctors/top-rated?limit=5
     */
    @GetMapping("/top-rated")
    public ResponseEntity<List<DoctorDTO>> getTopRatedDoctors(
            @RequestParam(name = "limit", defaultValue = "5") int limit) {
        List<DoctorDTO> doctors = doctorService.getTopRatedDoctors(limit).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(doctors);
    }

    /**
     * Convert Doctor entity to DTO with calculated rating
     */
    private DoctorDTO convertToDTO(Doctor doctor) {
        DoctorDTO dto = new DoctorDTO();
        dto.setId(doctor.getId());
        dto.setUserId(doctor.getUserId());
        dto.setFullName(doctor.getFullName());
        dto.setPhone(doctor.getPhone());
        dto.setHospitalName(doctor.getHospitalName());
        dto.setHospitalAddress(doctor.getHospitalAddress());
        dto.setConsultationFee(doctor.getConsultationFee());
        dto.setBio(doctor.getBio());
        dto.setExperienceYears(doctor.getExperienceYears());
        dto.setCertificateUrl(doctor.getCertificateUrl());
        
        // Get specialties
        if (doctor.getSpecialties() != null) {
            dto.setSpecialties(doctor.getSpecialties().stream()
                    .map(s -> s.getName())
                    .collect(Collectors.toList()));
        }
        
        // Calculate average rating from reviews
        try {
            Page<Review> reviewPage = reviewRepository.findByDoctorId(doctor.getId(), PageRequest.of(0, 1000));
            List<Review> reviews = reviewPage.getContent();
            if (reviews != null && !reviews.isEmpty()) {
                double avgRating = reviews.stream()
                        .mapToDouble(Review::getRating)
                        .average()
                        .orElse(0.0);
                dto.setRating(Math.round(avgRating * 10.0) / 10.0);
                dto.setReviewCount(reviews.size());
            } else {
                dto.setRating(0.0);
                dto.setReviewCount(0);
            }
        } catch (Exception e) {
            dto.setRating(0.0);
            dto.setReviewCount(0);
        }
        
        return dto;
    }
}
