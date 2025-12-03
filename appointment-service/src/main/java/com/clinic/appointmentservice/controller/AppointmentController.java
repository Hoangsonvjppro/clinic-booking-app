package com.clinic.appointmentservice.controller;

import com.clinic.appointmentservice.dto.AppointmentResponse;
import com.clinic.appointmentservice.dto.CancelAppointmentRequest;
import com.clinic.appointmentservice.dto.CreateAppointmentRequest;
import com.clinic.appointmentservice.dto.UpdateAppointmentStatusRequest;
import com.clinic.appointmentservice.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/appointments")
@Validated
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping
    public ResponseEntity<AppointmentResponse> createAppointment(@Valid @RequestBody CreateAppointmentRequest request) {
        AppointmentResponse response = appointmentService.createAppointment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }



    @PutMapping("/{appointmentId}/cancel")
    public ResponseEntity<AppointmentResponse> cancelAppointment(@PathVariable("appointmentId") UUID appointmentId,
                                                                 @Valid @RequestBody CancelAppointmentRequest request) {
        AppointmentResponse response = appointmentService.cancelAppointment(appointmentId, request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{appointmentId}/status")
    public ResponseEntity<AppointmentResponse> updateStatus(@PathVariable("appointmentId") UUID appointmentId,
                                                            @Valid @RequestBody UpdateAppointmentStatusRequest request) {
        AppointmentResponse response = appointmentService.updateStatus(appointmentId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<AppointmentResponse>> listAppointments(
            @RequestParam(name = "patientId", required = false) UUID patientId,
            @RequestParam(name = "doctorId", required = false) UUID doctorId) {
        if (patientId != null) {
            return ResponseEntity.ok(appointmentService.getAppointmentsByPatient(patientId));
        }
        if (doctorId != null) {
            return ResponseEntity.ok(appointmentService.getAppointmentsByDoctor(doctorId));
        }
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

    @GetMapping("/{appointmentId}")
    public ResponseEntity<AppointmentResponse> getAppointment(@PathVariable("appointmentId") UUID appointmentId) {
        return ResponseEntity.ok(appointmentService.getAppointment(appointmentId));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<AppointmentResponse>> getUpcomingAppointments(
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        if (userId != null) {
            return ResponseEntity.ok(appointmentService.getUpcomingAppointmentsByPatient(UUID.fromString(userId)));
        }
        return ResponseEntity.ok(appointmentService.getUpcomingAppointments());
    }

    @GetMapping("/history")
    public ResponseEntity<List<AppointmentResponse>> getAppointmentHistory(
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        if (userId != null) {
            return ResponseEntity.ok(appointmentService.getAppointmentHistoryByPatient(UUID.fromString(userId)));
        }
        return ResponseEntity.ok(appointmentService.getAppointmentHistory());
    }
}
