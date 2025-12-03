package com.clinic.notificationservice.services;

import com.clinic.notificationservice.dto.request.CreateReportRequest;
import com.clinic.notificationservice.dto.request.ResolveReportRequest;
import com.clinic.notificationservice.dto.response.ReportResponse;
import com.clinic.notificationservice.enums.ReportStatus;
import com.clinic.notificationservice.enums.UserType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

/**
 * Service interface for managing reports between users.
 */
public interface ReportService {

    /**
     * Creates a new report.
     *
     * @param reporterId the reporter's user ID
     * @param reporterType the reporter's user type
     * @param request the report creation request
     * @return the created report response
     */
    ReportResponse createReport(UUID reporterId, UserType reporterType, CreateReportRequest request);

    /**
     * Gets a report by ID.
     *
     * @param reportId the report ID
     * @return the report response
     */
    ReportResponse getReportById(UUID reportId);

    /**
     * Gets all reports made by a specific user.
     *
     * @param reporterId the reporter's user ID
     * @param pageable pagination info
     * @return page of report responses
     */
    Page<ReportResponse> getReportsByReporter(UUID reporterId, Pageable pageable);

    /**
     * Gets all reports received by a specific user.
     *
     * @param reportedId the reported user's ID
     * @param pageable pagination info
     * @return page of report responses
     */
    Page<ReportResponse> getReportsByReportedUser(UUID reportedId, Pageable pageable);

    /**
     * Gets all reports with a specific status (for admin).
     *
     * @param status the report status
     * @param pageable pagination info
     * @return page of report responses
     */
    Page<ReportResponse> getReportsByStatus(ReportStatus status, Pageable pageable);

    /**
     * Gets all reports (for admin).
     *
     * @param pageable pagination info
     * @return page of report responses
     */
    Page<ReportResponse> getAllReports(Pageable pageable);

    /**
     * Gets pending reports (for admin).
     *
     * @param pageable pagination info
     * @return page of pending reports
     */
    Page<ReportResponse> getPendingReports(Pageable pageable);

    /**
     * Updates report status to reviewing (admin started reviewing).
     *
     * @param reportId the report ID
     * @param adminId the admin user ID
     * @return updated report response
     */
    ReportResponse startReview(UUID reportId, UUID adminId);

    /**
     * Resolves a report with admin decision.
     *
     * @param reportId the report ID
     * @param request the resolution request
     * @return resolved report response
     */
    ReportResponse resolveReport(UUID reportId, ResolveReportRequest request);

    /**
     * Counts reports by status.
     *
     * @param status the report status
     * @return count of reports
     */
    long countByStatus(ReportStatus status);

    /**
     * Counts total reports received by a user.
     *
     * @param userId the user ID
     * @return count of reports
     */
    long countReportsAgainstUser(UUID userId);

    /**
     * Gets recent reports for a specific user (as reported).
     *
     * @param userId the user ID
     * @param limit max number of reports
     * @return list of recent reports
     */
    List<ReportResponse> getRecentReportsAgainstUser(UUID userId, int limit);

    /**
     * Gets recent reports made by a specific user.
     *
     * @param userId the user ID
     * @param limit max number of reports
     * @return list of recent reports
     */
    List<ReportResponse> getRecentReportsByUser(UUID userId, int limit);
    
    /**
     * Checks if a user has already reported another user for the same appointment.
     *
     * @param reporterId the reporter's user ID
     * @param reportedId the reported user's ID
     * @param appointmentId the appointment ID
     * @return true if report already exists
     */
    boolean hasAlreadyReported(UUID reporterId, UUID reportedId, UUID appointmentId);
}
