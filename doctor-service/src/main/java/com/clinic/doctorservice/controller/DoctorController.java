package com.clinic.doctorservice.controller;

import com.clinic.doctorservice.dto.ApplyDoctorRequest;
import com.clinic.doctorservice.dto.ApplyDoctorResponse;
import com.clinic.doctorservice.dto.DeleteDoctorResponse;
import com.clinic.doctorservice.dto.FeeSettingsResponse;
import com.clinic.doctorservice.dto.UpdateFeeRequest;
import com.clinic.doctorservice.model.DoctorApplication;
import com.clinic.doctorservice.service.DoctorApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;
import java.util.List;


@RestController
@RequestMapping("/api/doctor")
public class DoctorController {
    private final DoctorApplicationService service;

    public DoctorController(DoctorApplicationService service) { this.service = service; }

    /**
     * Apply to become a doctor.
     * Accepts multipart form-data: fields for the ApplyDoctorRequest and files named "certificates"
     */
    @PostMapping(value = "/apply", consumes = {"multipart/form-data"})
    public ResponseEntity<ApplyDoctorResponse> apply(
            @RequestPart("data") ApplyDoctorRequest data,
            @RequestPart(value = "certificates", required = false) MultipartFile[] certificates
    ) throws IOException {
        System.out.println("Received data: " + data);

        DoctorApplication app = new DoctorApplication();
        app.setUserId(data.getUserId());
        app.setName(data.getName());
        app.setHospitalEmail(data.getHospitalEmail());
        app.setAddress(data.getAddress());
        app.setPhone(data.getPhone());
        app.setDescription(data.getDescription());
        app.setPaymentMethods(data.getPaymentMethods());

        DoctorApplication saved = service.apply(app, certificates);
        return ResponseEntity.ok(new ApplyDoctorResponse(saved.getId(), saved.getUserId(), saved.getStatus().name()));
    }

    /** Approve an application (admin).
     * In a real system protect with roles/authorization.
     */
    @PutMapping("/approve")
    public ResponseEntity<ApplyDoctorResponse> approve(@RequestParam("id") UUID applicationId) {
        DoctorApplication saved = service.approve(applicationId);
        return ResponseEntity.ok(new ApplyDoctorResponse(saved.getId(), saved.getUserId(), saved.getStatus().name()));
    }
    
    /** Reject an application (admin).
     * In a real system protect with roles/authorization.
     */
    @PutMapping("/reject")
    public ResponseEntity<ApplyDoctorResponse> reject(@RequestParam("id") UUID applicationId) {
        DoctorApplication saved = service.reject(applicationId);
        return ResponseEntity.ok(new ApplyDoctorResponse(saved.getId(), saved.getUserId(), saved.getStatus().name()));
    }

    // --- GET STATUS BY APPLICATION ID ---
    // This uses the 'id' of the application
    @GetMapping("/status/{id}")
    public ResponseEntity<ApplyDoctorResponse> getStatus(@PathVariable("id") UUID applicationId) {
        DoctorApplication app = service.getStatus(applicationId);
        return ResponseEntity.ok(new ApplyDoctorResponse(app.getId(), app.getUserId(), app.getStatus().name()));
    }

    // --- GET APPLICATION BY USER ID ---
    @GetMapping("/user/{userId}")
    public ResponseEntity<DoctorApplication> getByUserId(@PathVariable("userId") String userId) {
        DoctorApplication app = service.getByUserId(userId);
        return ResponseEntity.ok(app);
    }

    // --- UPDATE ---
    @PutMapping("/user/{userId}")
    public ResponseEntity<DoctorApplication> updateDoctor(
            @PathVariable("userId") String userId,
            @RequestBody DoctorApplication updateRequest
    ) {
        DoctorApplication updated = service.updateByUserId(userId, updateRequest);
        return ResponseEntity.ok(updated);
    }

    // --- DELETE ---
    @DeleteMapping("/user/{userId}")
    public ResponseEntity<DeleteDoctorResponse> deleteDoctor(@PathVariable("userId") String userId) {
        service.deleteByUserId(userId);
        return ResponseEntity.ok(new DeleteDoctorResponse("Successfully deleted", userId));
    }

    // --- GET ALL USER IDs ---
    @GetMapping("/all-users")
    public ResponseEntity<List<String>> getAllUserIds() {
        List<String> userIds = service.getAllUserIds();
        return ResponseEntity.ok(userIds);
    }

    // --- GET ALL USER ---
    @GetMapping("/all-application")
    public ResponseEntity<List<DoctorApplication>> getAllApplications() {
        return ResponseEntity.ok(service.getAllApplication());
    }

    // --- GET FEE SETTINGS ---
    @GetMapping("/fee/{userId}")
    public ResponseEntity<FeeSettingsResponse> getFeeSettings(@PathVariable("userId") String userId) {
        FeeSettingsResponse fees = service.getFeeSettings(userId);
        return ResponseEntity.ok(fees);
    }

    // --- UPDATE FEE SETTINGS ---
    @PutMapping("/fee/{userId}")
    public ResponseEntity<FeeSettingsResponse> updateFeeSettings(
            @PathVariable("userId") String userId,
            @RequestBody UpdateFeeRequest request
    ) {
        FeeSettingsResponse updated = service.updateFeeSettings(userId, request);
        return ResponseEntity.ok(updated);
    }

}