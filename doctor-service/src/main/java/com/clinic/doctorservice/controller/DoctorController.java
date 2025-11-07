package com.clinic.doctorservice.controller;

import com.clinic.doctorservice.dto.ApplyDoctorRequest;
import com.clinic.doctorservice.dto.ApplyDoctorResponse;
import com.clinic.doctorservice.model.DoctorApplication;
import com.clinic.doctorservice.service.DoctorApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


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
        DoctorApplication app = new DoctorApplication();
        app.setUserId(data.getUserId());
        app.setHospitalEmail(data.getHospitalEmail());
        app.setAddress(data.getAddress());
        app.setPhone(data.getPhone());
        app.setDescription(data.getDescription());
        app.setPaymentMethods(data.getPaymentMethods());

        DoctorApplication saved = service.apply(app, certificates);
        return ResponseEntity.ok(new ApplyDoctorResponse(saved.getId(), saved.getStatus().name()));
    }

    /** Approve an application (admin).
     * In a real system protect with roles/authorization.
     */
    @PostMapping("/approve")
    public ResponseEntity<ApplyDoctorResponse> approve(@RequestParam("id") UUID applicationId) {
        DoctorApplication saved = service.approve(applicationId);
        return ResponseEntity.ok(new ApplyDoctorResponse(saved.getId(), saved.getStatus().name()));
    }

    @PostMapping("/get")
    public ResponseEntity<ApplyDoctorResponse> postMethodName(@RequestParam("id") UUID applicationId) {
        DoctorApplication saved = service.get(applicationId);
        return ResponseEntity.ok(new ApplyDoctorResponse(saved.getId(), saved.getStatus().name()));
    }
    
}