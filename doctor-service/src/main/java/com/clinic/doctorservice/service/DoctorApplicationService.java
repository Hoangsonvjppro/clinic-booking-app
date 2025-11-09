package com.clinic.doctorservice.service;

import com.clinic.doctorservice.exception.ApplicationException;
import com.clinic.doctorservice.model.DoctorApplication;
import com.clinic.doctorservice.model.DoctorApplicationStatus;
import com.clinic.doctorservice.repository.DoctorApplicationRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.UUID;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorApplicationService {
    private final DoctorApplicationRepository repo;
    private final Path uploadDir;

    public DoctorApplicationService(DoctorApplicationRepository repo, @Value("${app.upload-dir:./uploads}") String uploadDir) {
        this.repo = repo;
        this.uploadDir = Path.of(uploadDir);
        try { Files.createDirectories(this.uploadDir); } catch (IOException ignored) {}
    }

    public DoctorApplication apply(DoctorApplication app, MultipartFile[] certificates) throws IOException {

        repo.findByUserId(app.getUserId()).ifPresent(existing -> {
            if (existing.getStatus() == DoctorApplicationStatus.PENDING) {
                throw new ApplicationException("You already have a pending doctor application: " + existing.getId());
            }
        });

        if (certificates != null && certificates.length > 0) {
            String saved = Arrays.stream(certificates)
                    .map(file -> saveFile(app.getUserId(), file))
                    .collect(Collectors.joining(","));
            app.setCertificatePaths(saved);
        }

        return repo.save(app);
    }

    private String saveFile(String userId, MultipartFile file) {
        try {
            String filename = userId + "-" + System.currentTimeMillis() + "-" + file.getOriginalFilename();
            Path target = uploadDir.resolve(filename);
            file.transferTo(target);
            return target.toAbsolutePath().toString();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public List<String> getAllUserIds() {
        return repo.findAll() // fetch all DoctorApplication entities
                .stream()
                .map(DoctorApplication::getUserId) // extract userId
                .toList();
    }


    public DoctorApplication approve(UUID applicationId) {
        DoctorApplication app = repo.findById(applicationId).orElseThrow(() -> new RuntimeException("Application not found"));
        app.setStatus(DoctorApplicationStatus.APPROVED);
        // In real app: create Doctor entity, grant roles, notify user, etc.
        return repo.save(app);
    }

    // --- Get status by application ID ---
    public DoctorApplication getStatus(UUID applicationId) {
        return repo.findById(applicationId)
                .orElseThrow(() -> new ApplicationException("Application not found"));
    }

    // --- Get by user ID ---
    public DoctorApplication getByUserId(String userId) {
        return repo.findByUserId(userId)
                .orElseThrow(() -> new ApplicationException("Application not found for userId: " + userId));
    }

    // --- Update by user ID ---
    public DoctorApplication updateByUserId(String userId, DoctorApplication updated) {
        DoctorApplication existing = getByUserId(userId);

        existing.setHospitalEmail(updated.getHospitalEmail());
        existing.setAddress(updated.getAddress());
        existing.setPhone(updated.getPhone());
        existing.setDescription(updated.getDescription());
        existing.setPaymentMethods(updated.getPaymentMethods());

        return repo.save(existing);
    }

    // --- Delete by user ID ---
    public void deleteByUserId(String userId) {
        DoctorApplication existing = getByUserId(userId);
        repo.delete(existing);
    }
}