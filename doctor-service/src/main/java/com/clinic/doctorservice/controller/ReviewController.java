package com.clinic.doctorservice.controller;

import com.clinic.doctorservice.dto.CreateReviewRequest;
import com.clinic.doctorservice.dto.ReviewResponse;
import com.clinic.doctorservice.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/doctors")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping("/{doctorId}/reviews")
    public ResponseEntity<ReviewResponse> createReview(
            @PathVariable UUID doctorId,
            @Valid @RequestBody CreateReviewRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(reviewService.createReview(doctorId, request));
    }

    @GetMapping("/{doctorId}/reviews")
    public ResponseEntity<Page<ReviewResponse>> getReviews(
            @PathVariable UUID doctorId,
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(reviewService.getReviewsByDoctorId(doctorId, pageable));
    }
}
