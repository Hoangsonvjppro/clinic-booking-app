package com.clinic.notificationservice.services;

import com.clinic.notificationservice.dto.request.SendWarningRequest;
import com.clinic.notificationservice.dto.response.WarningResponse;
import com.clinic.notificationservice.entity.Report;
import com.clinic.notificationservice.entity.Warning;
import com.clinic.notificationservice.enums.UserType;
import com.clinic.notificationservice.exceptions.ResourceNotFoundException;
import com.clinic.notificationservice.repository.ReportRepository;
import com.clinic.notificationservice.repository.WarningRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Implementation of WarningService for managing user warnings.
 */
@Service
@Transactional
public class WarningServiceImpl implements WarningService {

    private final WarningRepository warningRepository;
    private final ReportRepository reportRepository;

    public WarningServiceImpl(WarningRepository warningRepository, ReportRepository reportRepository) {
        this.warningRepository = warningRepository;
        this.reportRepository = reportRepository;
    }

    @Override
    public WarningResponse sendWarning(SendWarningRequest request) {
        Warning warning = new Warning();
        warning.setUserId(request.getUserId());
        warning.setUserType(request.getUserType());
        warning.setWarningType(request.getWarningType());
        warning.setTitle(request.getTitle());
        warning.setMessage(request.getMessage());
        warning.setIssuedBy(request.getIssuedBy());
        warning.setCreatedAt(Instant.now());
        warning.setRead(false);
        
        // Link to report if provided
        if (request.getReportId() != null) {
            Report report = reportRepository.findById(request.getReportId())
                    .orElseThrow(() -> new ResourceNotFoundException("Report not found with id: " + request.getReportId()));
            warning.setReport(report);
        }
        
        // Set expiration if provided
        if (request.getExpiresAt() != null) {
            warning.setExpiresAt(request.getExpiresAt());
        }

        Warning savedWarning = warningRepository.save(warning);
        return WarningResponse.fromEntity(savedWarning);
    }

    @Override
    @Transactional(readOnly = true)
    public WarningResponse getWarningById(UUID warningId) {
        Warning warning = warningRepository.findById(warningId)
                .orElseThrow(() -> new ResourceNotFoundException("Warning not found with id: " + warningId));
        return WarningResponse.fromEntity(warning);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<WarningResponse> getWarningsByUser(UUID userId, Pageable pageable) {
        return warningRepository.findByUserId(userId, pageable)
                .map(WarningResponse::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<WarningResponse> getUnreadWarnings(UUID userId) {
        return warningRepository.findByUserIdAndIsReadFalse(userId)
                .stream()
                .map(WarningResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public WarningResponse markAsRead(UUID warningId, UUID userId) {
        Warning warning = warningRepository.findById(warningId)
                .orElseThrow(() -> new ResourceNotFoundException("Warning not found with id: " + warningId));

        // Verify ownership
        if (!warning.getUserId().equals(userId)) {
            throw new IllegalStateException("You don't have permission to modify this warning");
        }

        if (!warning.isRead()) {
            warning.setRead(true);
            warning.setReadAt(Instant.now());
            warning = warningRepository.save(warning);
        }

        return WarningResponse.fromEntity(warning);
    }

    @Override
    public void markAllAsRead(UUID userId) {
        List<Warning> unreadWarnings = warningRepository.findByUserIdAndIsReadFalse(userId);
        Instant now = Instant.now();
        
        for (Warning warning : unreadWarnings) {
            warning.setRead(true);
            warning.setReadAt(now);
        }
        
        warningRepository.saveAll(unreadWarnings);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<WarningResponse> getAllWarnings(Pageable pageable) {
        return warningRepository.findAll(pageable)
                .map(WarningResponse::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<WarningResponse> getWarningsWithFilters(UUID userId, UserType userType, Pageable pageable) {
        return warningRepository.findWithFilters(userId, userType, null, null, null, pageable)
                .map(WarningResponse::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<WarningResponse> getWarningsByReport(UUID reportId) {
        return warningRepository.findByReportId(reportId)
                .stream()
                .map(WarningResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public long countWarningsByUser(UUID userId) {
        return warningRepository.countByUserId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public long countUnreadWarnings(UUID userId) {
        return warningRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<WarningResponse> getActiveWarnings(UUID userId) {
        Instant now = Instant.now();
        return warningRepository.findByUserId(userId, Pageable.unpaged())
                .getContent()
                .stream()
                .filter(w -> w.getExpiresAt() == null || w.getExpiresAt().isAfter(now))
                .map(WarningResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<WarningResponse> getRecentWarnings(UUID userId, int limit) {
        Pageable pageable = PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "createdAt"));
        return warningRepository.findByUserId(userId, pageable)
                .getContent()
                .stream()
                .map(WarningResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
