package com.clinic.doctorservice.service;

import com.clinic.doctorservice.dto.FeeSettingsResponse;
import com.clinic.doctorservice.dto.UpdateFeeRequest;
import com.clinic.doctorservice.exception.ApplicationException;
import com.clinic.doctorservice.model.Doctor;
import com.clinic.doctorservice.model.DoctorApplication;
import com.clinic.doctorservice.model.DoctorApplicationStatus;
import com.clinic.doctorservice.repository.DoctorApplicationRepository;
import com.clinic.doctorservice.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.UUID;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DoctorApplicationService {
    private final DoctorApplicationRepository repo;
    private final DoctorRepository doctorRepository;
    private final Path uploadDir;

    public DoctorApplicationService(
            DoctorApplicationRepository repo, 
            DoctorRepository doctorRepository,
            @Value("${app.upload-dir:./uploads}") String uploadDir) {
        this.repo = repo;
        this.doctorRepository = doctorRepository;
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

    // --- Approve application ---
    public DoctorApplication approve(UUID applicationId) {
        DoctorApplication app = repo.findById(applicationId).orElseThrow(() -> new RuntimeException("Application not found"));
        app.setStatus(DoctorApplicationStatus.APPROVED);
        // In real app: create Doctor entity, grant roles, notify user, etc.
        return repo.save(app);
    }
    
    // --- Reject application ---
    public DoctorApplication reject(UUID applicationId) {
        DoctorApplication app = repo.findById(applicationId).orElseThrow(() -> new RuntimeException("Application not found"));
        app.setStatus(DoctorApplicationStatus.REJECTED);
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

    // --- Get all application ---
    public List<DoctorApplication> getAllApplication() {
        return repo.findAll()
            .stream()
            .toList();
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

    // --- Get Fee Settings ---
    public FeeSettingsResponse getFeeSettings(String userId) {
        // Ưu tiên lấy từ bảng Doctor (nguồn hiển thị cho bệnh nhân)
        Optional<Doctor> doctorOpt = doctorRepository.findByUserId(UUID.fromString(userId));
        if (doctorOpt.isPresent()) {
            Doctor doctor = doctorOpt.get();
            return new FeeSettingsResponse(
                doctor.getConsultationFee() != null ? doctor.getConsultationFee() : BigDecimal.valueOf(300000),
                BigDecimal.valueOf(200000), // followUpFee - không có trong Doctor
                BigDecimal.valueOf(500000), // emergencyFee - không có trong Doctor
                30 // consultationDuration - không có trong Doctor
            );
        }
        
        // Fallback lấy từ DoctorApplication nếu có
        Optional<DoctorApplication> appOpt = repo.findByUserId(userId);
        if (appOpt.isPresent()) {
            DoctorApplication app = appOpt.get();
            return new FeeSettingsResponse(
                app.getConsultationFee() != null ? app.getConsultationFee() : BigDecimal.valueOf(300000),
                app.getFollowUpFee() != null ? app.getFollowUpFee() : BigDecimal.valueOf(200000),
                app.getEmergencyFee() != null ? app.getEmergencyFee() : BigDecimal.valueOf(500000),
                app.getConsultationDuration() != null ? app.getConsultationDuration() : 30
            );
        }
        
        // Default values
        return new FeeSettingsResponse(
            BigDecimal.valueOf(300000),
            BigDecimal.valueOf(200000),
            BigDecimal.valueOf(500000),
            30
        );
    }

    // --- Update Fee Settings ---
    public FeeSettingsResponse updateFeeSettings(String userId, UpdateFeeRequest request) {
        // Cập nhật trực tiếp bảng Doctor (nguồn chính hiển thị cho bệnh nhân)
        Optional<Doctor> doctorOpt = doctorRepository.findByUserId(UUID.fromString(userId));
        if (doctorOpt.isEmpty()) {
            throw new ApplicationException("Không tìm thấy thông tin bác sĩ với userId: " + userId);
        }
        
        Doctor doctor = doctorOpt.get();
        
        if (request.getConsultationFee() != null) {
            doctor.setConsultationFee(request.getConsultationFee());
        }
        
        doctorRepository.save(doctor);
        
        // Cũng cập nhật DoctorApplication nếu có
        Optional<DoctorApplication> appOpt = repo.findByUserId(userId);
        if (appOpt.isPresent()) {
            DoctorApplication app = appOpt.get();
            if (request.getConsultationFee() != null) {
                app.setConsultationFee(request.getConsultationFee());
            }
            if (request.getFollowUpFee() != null) {
                app.setFollowUpFee(request.getFollowUpFee());
            }
            if (request.getEmergencyFee() != null) {
                app.setEmergencyFee(request.getEmergencyFee());
            }
            if (request.getConsultationDuration() != null) {
                app.setConsultationDuration(request.getConsultationDuration());
            }
            repo.save(app);
        }
        
        return new FeeSettingsResponse(
            doctor.getConsultationFee(),
            BigDecimal.valueOf(200000),
            BigDecimal.valueOf(500000),
            30
        );
    }
}