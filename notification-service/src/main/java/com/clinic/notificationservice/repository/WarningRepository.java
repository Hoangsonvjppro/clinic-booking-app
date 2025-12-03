package com.clinic.notificationservice.repository;

import com.clinic.notificationservice.entity.Warning;
import com.clinic.notificationservice.enums.UserType;
import com.clinic.notificationservice.enums.WarningType;
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
public interface WarningRepository extends JpaRepository<Warning, UUID> {

    // === Find by User ===
    
    Page<Warning> findByUserId(UUID userId, Pageable pageable);
    
    Page<Warning> findByUserIdAndIsRead(UUID userId, boolean isRead, Pageable pageable);
    
    List<Warning> findByUserIdAndUserType(UUID userId, UserType userType);

    // === Find by Read Status ===
    
    List<Warning> findByUserIdAndIsReadFalse(UUID userId);

    // === Find by Warning Type ===
    
    Page<Warning> findByUserIdAndWarningType(UUID userId, WarningType warningType, Pageable pageable);

    // === Find by Report ===
    
    List<Warning> findByReportId(UUID reportId);

    // === Admin Queries ===
    
    @Query("SELECT w FROM Warning w WHERE " +
           "(:userId IS NULL OR w.userId = :userId) AND " +
           "(:userType IS NULL OR w.userType = :userType) AND " +
           "(:warningType IS NULL OR w.warningType = :warningType) AND " +
           "(:fromDate IS NULL OR w.createdAt >= :fromDate) AND " +
           "(:toDate IS NULL OR w.createdAt <= :toDate)")
    Page<Warning> findWithFilters(
            @Param("userId") UUID userId,
            @Param("userType") UserType userType,
            @Param("warningType") WarningType warningType,
            @Param("fromDate") Instant fromDate,
            @Param("toDate") Instant toDate,
            Pageable pageable
    );

    // === Statistics Queries ===
    
    long countByUserId(UUID userId);
    
    long countByUserIdAndIsReadFalse(UUID userId);
    
    @Query("SELECT COUNT(w) FROM Warning w WHERE w.createdAt >= :since")
    long countWarningsSince(@Param("since") Instant since);
    
    @Query("SELECT COUNT(w) FROM Warning w WHERE w.isRead = false")
    long countUnreadWarnings();

    // === Expiration Queries ===
    
    @Query("SELECT w FROM Warning w WHERE w.expiresAt IS NOT NULL AND w.expiresAt < :now")
    List<Warning> findExpiredWarnings(@Param("now") Instant now);
}
