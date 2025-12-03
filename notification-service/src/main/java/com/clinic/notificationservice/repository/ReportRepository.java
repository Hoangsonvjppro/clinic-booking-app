package com.clinic.notificationservice.repository;

import com.clinic.notificationservice.entity.Report;
import com.clinic.notificationservice.enums.ReportStatus;
import com.clinic.notificationservice.enums.UserType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Repository
public interface ReportRepository extends JpaRepository<Report, UUID> {

    // === Find by Reporter ===
    
    Page<Report> findByReporterId(UUID reporterId, Pageable pageable);
    
    Page<Report> findByReporterIdAndStatus(UUID reporterId, ReportStatus status, Pageable pageable);
    
    List<Report> findByReporterIdAndReporterType(UUID reporterId, UserType reporterType);

    // === Find by Reported User ===
    
    Page<Report> findByReportedId(UUID reportedId, Pageable pageable);
    
    Page<Report> findByReportedIdAndStatus(UUID reportedId, ReportStatus status, Pageable pageable);
    
    List<Report> findByReportedIdAndReportedType(UUID reportedId, UserType reportedType);

    // === Find by Status ===
    
    Page<Report> findByStatus(ReportStatus status, Pageable pageable);
    
    List<Report> findByStatusIn(List<ReportStatus> statuses);

    // === Find by Appointment ===
    
    List<Report> findByAppointmentId(UUID appointmentId);

    // === Admin Queries ===
    
    @Query("SELECT r FROM Report r WHERE " +
           "(:status IS NULL OR r.status = :status) AND " +
           "(:reporterType IS NULL OR r.reporterType = :reporterType) AND " +
           "(:reportedType IS NULL OR r.reportedType = :reportedType) AND " +
           "(:fromDate IS NULL OR r.createdAt >= :fromDate) AND " +
           "(:toDate IS NULL OR r.createdAt <= :toDate)")
    Page<Report> findWithFilters(
            @Param("status") ReportStatus status,
            @Param("reporterType") UserType reporterType,
            @Param("reportedType") UserType reportedType,
            @Param("fromDate") Instant fromDate,
            @Param("toDate") Instant toDate,
            Pageable pageable
    );

    // === Statistics Queries ===
    
    long countByStatus(ReportStatus status);
    
    long countByReportedId(UUID reportedId);
    
    long countByReporterId(UUID reporterId);
    
    @Query("SELECT COUNT(r) FROM Report r WHERE r.status = 'PENDING'")
    long countPendingReports();
    
    @Query("SELECT COUNT(r) FROM Report r WHERE r.status = 'RESOLVED'")
    long countResolvedReports();
    
    @Query("SELECT COUNT(r) FROM Report r WHERE r.createdAt >= :since")
    long countReportsSince(@Param("since") Instant since);

    // === Check if user has reported before ===
    
    boolean existsByReporterIdAndReportedIdAndAppointmentId(UUID reporterId, UUID reportedId, UUID appointmentId);
}
