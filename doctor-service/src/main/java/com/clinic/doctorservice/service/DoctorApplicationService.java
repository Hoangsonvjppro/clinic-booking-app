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
                throw new ApplicationException("You already have a pending doctor application");
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

    private String saveFile(UUID userId, MultipartFile file) {
        try {
            String filename = userId + "-" + System.currentTimeMillis() + "-" + file.getOriginalFilename();
            Path target = uploadDir.resolve(filename);
            file.transferTo(target);
            return target.toAbsolutePath().toString();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public DoctorApplication approve(UUID applicationId) {
        DoctorApplication app = repo.findById(applicationId).orElseThrow(() -> new RuntimeException("Application not found"));
        app.setStatus(DoctorApplicationStatus.APPROVED);
        // In real app: create Doctor entity, grant roles, notify user, etc.
        return repo.save(app);
    }

    public DoctorApplication get(UUID id) {
        DoctorApplication app = repo.findById(id).orElseThrow(() -> new RuntimeException("Application not found"));
        return repo.save(app);
    }
}