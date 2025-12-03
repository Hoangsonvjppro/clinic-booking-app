package com.clinic.notificationservice.services;

import com.clinic.notificationservice.dto.request.CreateReportRequest;
import com.clinic.notificationservice.dto.request.ResolveReportRequest;
import com.clinic.notificationservice.dto.response.ReportResponse;
import com.clinic.notificationservice.entity.Report;
import com.clinic.notificationservice.enums.ReportStatus;
import com.clinic.notificationservice.enums.UserType;
import com.clinic.notificationservice.exceptions.ResourceNotFoundException;
import com.clinic.notificationservice.repository.ReportRepository;
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
 * Implementation of ReportService for managing user reports.
 */
@Service
@Transactional
public class ReportServiceImpl implements ReportService {

    private final ReportRepository reportRepository;

    public ReportServiceImpl(ReportRepository reportRepository) {
        this.reportRepository = reportRepository;
    }

    @Override
    public ReportResponse createReport(UUID reporterId, UserType reporterType, CreateReportRequest request) {
        // Check if already reported for this appointment
        if (request.getAppointmentId() != null && 
            hasAlreadyReported(reporterId, request.getReportedId(), request.getAppointmentId())) {
            throw new IllegalStateException("You have already submitted a report for this appointment");
        }
        
        Report report = new Report();
        report.setReporterId(reporterId);
        report.setReporterType(reporterType);
        report.setReportedId(request.getReportedId());
        report.setReportedType(reporterType == UserType.PATIENT ? UserType.DOCTOR : UserType.PATIENT);
        report.setReportType(request.getReportType());
        report.setTitle(request.getTitle());
        report.setDescription(request.getDescription());
        report.setAppointmentId(request.getAppointmentId());
        report.setEvidenceUrls(request.getEvidenceUrls());
        report.setStatus(ReportStatus.PENDING);
        report.setCreatedAt(Instant.now());

        Report savedReport = reportRepository.save(report);
        return ReportResponse.fromEntity(savedReport);
    }

    @Override
    @Transactional(readOnly = true)
    public ReportResponse getReportById(UUID reportId) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found with id: " + reportId));
        return ReportResponse.fromEntity(report);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReportResponse> getReportsByReporter(UUID reporterId, Pageable pageable) {
        return reportRepository.findByReporterId(reporterId, pageable)
                .map(ReportResponse::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReportResponse> getReportsByReportedUser(UUID reportedId, Pageable pageable) {
        return reportRepository.findByReportedId(reportedId, pageable)
                .map(ReportResponse::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReportResponse> getReportsByStatus(ReportStatus status, Pageable pageable) {
        return reportRepository.findByStatus(status, pageable)
                .map(ReportResponse::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReportResponse> getAllReports(Pageable pageable) {
        return reportRepository.findAll(pageable)
                .map(ReportResponse::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReportResponse> getPendingReports(Pageable pageable) {
        return reportRepository.findByStatus(ReportStatus.PENDING, pageable)
                .map(ReportResponse::fromEntity);
    }

    @Override
    public ReportResponse startReview(UUID reportId, UUID adminId) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found with id: " + reportId));

        if (report.getStatus() != ReportStatus.PENDING) {
            throw new IllegalStateException("Report is not in pending status");
        }

        report.setStatus(ReportStatus.REVIEWING);
        report.setAdminId(adminId);
        report.setUpdatedAt(Instant.now());

        Report savedReport = reportRepository.save(report);
        return ReportResponse.fromEntity(savedReport);
    }

    @Override
    public ReportResponse resolveReport(UUID reportId, ResolveReportRequest request) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found with id: " + reportId));

        if (report.getStatus() == ReportStatus.RESOLVED) {
            throw new IllegalStateException("Report is already resolved");
        }

        report.setStatus(ReportStatus.RESOLVED);
        report.setResolution(request.getResolution());
        report.setAdminNotes(request.getAdminNotes());
        report.setAdminId(request.getAdminId());
        report.setResolvedAt(Instant.now());
        report.setUpdatedAt(Instant.now());

        Report savedReport = reportRepository.save(report);
        return ReportResponse.fromEntity(savedReport);
    }

    @Override
    @Transactional(readOnly = true)
    public long countByStatus(ReportStatus status) {
        return reportRepository.countByStatus(status);
    }

    @Override
    @Transactional(readOnly = true)
    public long countReportsAgainstUser(UUID userId) {
        return reportRepository.countByReportedId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReportResponse> getRecentReportsAgainstUser(UUID userId, int limit) {
        Pageable pageable = PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "createdAt"));
        return reportRepository.findByReportedId(userId, pageable)
                .getContent()
                .stream()
                .map(ReportResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReportResponse> getRecentReportsByUser(UUID userId, int limit) {
        Pageable pageable = PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "createdAt"));
        return reportRepository.findByReporterId(userId, pageable)
                .getContent()
                .stream()
                .map(ReportResponse::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public boolean hasAlreadyReported(UUID reporterId, UUID reportedId, UUID appointmentId) {
        return reportRepository.existsByReporterIdAndReportedIdAndAppointmentId(reporterId, reportedId, appointmentId);
    }
}
