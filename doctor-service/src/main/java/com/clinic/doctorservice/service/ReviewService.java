package com.clinic.doctorservice.service;

import com.clinic.doctorservice.dto.CreateReviewRequest;
import com.clinic.doctorservice.dto.ReviewResponse;
import com.clinic.doctorservice.exception.ApplicationException;
import com.clinic.doctorservice.model.Doctor;
import com.clinic.doctorservice.model.Review;
import com.clinic.doctorservice.repository.DoctorRepository;
import com.clinic.doctorservice.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final DoctorRepository doctorRepository;

    @Transactional
    public ReviewResponse createReview(UUID doctorId, CreateReviewRequest request) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ApplicationException("Doctor not found with id: " + doctorId));

        if (reviewRepository.existsByAppointmentId(request.getAppointmentId())) {
            throw new ApplicationException("Review already exists for this appointment");
        }

        Review review = Review.builder()
                .doctor(doctor)
                .patientId(request.getPatientId())
                .appointmentId(request.getAppointmentId())
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        Review savedReview = reviewRepository.save(review);

        // Optional: Update doctor's average rating
        // For now, we are not persisting average rating to Doctor entity as the field doesn't exist yet.
        // If needed, we would calculate it here and update the doctor entity.

        return mapToResponse(savedReview);
    }

    public Page<ReviewResponse> getReviewsByDoctorId(UUID doctorId, Pageable pageable) {
        if (!doctorRepository.existsById(doctorId)) {
            throw new ApplicationException("Doctor not found with id: " + doctorId);
        }
        return reviewRepository.findByDoctorId(doctorId, pageable)
                .map(this::mapToResponse);
    }

    private ReviewResponse mapToResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .patientName("Patient " + review.getPatientId()) // Placeholder as we don't have Patient Service client yet
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
