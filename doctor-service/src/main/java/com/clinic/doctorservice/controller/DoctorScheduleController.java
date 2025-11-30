package com.clinic.doctorservice.controller;

import com.clinic.doctorservice.dto.ScheduleRequest;
import com.clinic.doctorservice.model.DoctorSchedule;
import com.clinic.doctorservice.service.DoctorScheduleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/doctors")
@RequiredArgsConstructor
public class DoctorScheduleController {

    private final DoctorScheduleService doctorScheduleService;

    @PutMapping("/profile/schedules")
    public ResponseEntity<List<DoctorSchedule>> updateSchedules(
            @RequestHeader(value = "X-User-Id", required = false) UUID userId,
            @RequestBody @Valid List<ScheduleRequest> requests) {
        
        // Fallback for testing if header is missing (In real app, Gateway should ensure this)
        if (userId == null) {
            // This is just a placeholder behavior. In production, this should be 401 or handled by security filter.
            // For now, we might throw an exception or assume a test ID if needed, but let's throw.
            throw new IllegalArgumentException("Missing X-User-Id header");
        }

        return ResponseEntity.ok(doctorScheduleService.updateSchedules(userId, requests));
    }

    @GetMapping("/{doctorId}/schedules")
    public ResponseEntity<List<DoctorSchedule>> getSchedules(@PathVariable UUID doctorId) {
        return ResponseEntity.ok(doctorScheduleService.getSchedulesByDoctorId(doctorId));
    }
}
