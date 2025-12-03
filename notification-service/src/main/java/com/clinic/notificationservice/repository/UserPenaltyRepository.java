package com.clinic.notificationservice.repository;

import com.clinic.notificationservice.entity.UserPenalty;
import com.clinic.notificationservice.enums.PenaltyType;
import com.clinic.notificationservice.enums.UserType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserPenaltyRepository extends JpaRepository<UserPenalty, UUID> {

    // === Find by User ===
    
    Page<UserPenalty> findByUserId(UUID userId, Pageable pageable);
    
    List<UserPenalty> findByUserIdAndIsActiveTrue(UUID userId);
    
    List<UserPenalty> findByUserIdAndUserType(UUID userId, UserType userType);

    // === Find Active Penalties ===
    
    @Query("SELECT p FROM UserPenalty p WHERE p.userId = :userId AND p.isActive = true " +
           "AND (p.effectiveUntil IS NULL OR p.effectiveUntil > :now)")
    List<UserPenalty> findActiveByUserId(@Param("userId") UUID userId, @Param("now") Instant now);
    
    @Query("SELECT p FROM UserPenalty p WHERE p.userId = :userId AND p.isActive = true " +
           "AND p.penaltyType = :penaltyType " +
           "AND (p.effectiveUntil IS NULL OR p.effectiveUntil > :now)")
    Optional<UserPenalty> findActiveByUserIdAndType(
            @Param("userId") UUID userId,
            @Param("penaltyType") PenaltyType penaltyType,
            @Param("now") Instant now
    );

    // === Find by Penalty Type ===
    
    List<UserPenalty> findByPenaltyType(PenaltyType penaltyType);
    
    Page<UserPenalty> findByPenaltyTypeAndIsActiveTrue(PenaltyType penaltyType, Pageable pageable);

    // === Find by Report/Warning ===
    
    List<UserPenalty> findByReportId(UUID reportId);
    
    List<UserPenalty> findByWarningId(UUID warningId);

    // === Booking Fee Multiplier Query ===
    
    @Query("SELECT COALESCE(MAX(p.multiplier), 1.0) FROM UserPenalty p " +
           "WHERE p.userId = :userId AND p.isActive = true " +
           "AND p.penaltyType IN ('DOUBLE_BOOKING_FEE', 'TRIPLE_BOOKING_FEE') " +
           "AND (p.effectiveUntil IS NULL OR p.effectiveUntil > :now)")
    BigDecimal getBookingFeeMultiplier(@Param("userId") UUID userId, @Param("now") Instant now);

    // === Admin Queries ===
    
    @Query("SELECT p FROM UserPenalty p WHERE " +
           "(:userId IS NULL OR p.userId = :userId) AND " +
           "(:userType IS NULL OR p.userType = :userType) AND " +
           "(:penaltyType IS NULL OR p.penaltyType = :penaltyType) AND " +
           "(:activeOnly = false OR p.isActive = true)")
    Page<UserPenalty> findWithFilters(
            @Param("userId") UUID userId,
            @Param("userType") UserType userType,
            @Param("penaltyType") PenaltyType penaltyType,
            @Param("activeOnly") boolean activeOnly,
            Pageable pageable
    );

    // === Statistics Queries ===
    
    long countByUserId(UUID userId);
    
    long countByUserIdAndIsActiveTrue(UUID userId);
    
    @Query("SELECT COUNT(p) FROM UserPenalty p WHERE p.isActive = true")
    long countActivePenalties();
    
    @Query("SELECT COUNT(p) FROM UserPenalty p WHERE p.createdAt >= :since")
    long countPenaltiesSince(@Param("since") Instant since);

    // === Expiration Queries ===
    
    @Query("SELECT p FROM UserPenalty p WHERE p.isActive = true " +
           "AND p.effectiveUntil IS NOT NULL AND p.effectiveUntil < :now")
    List<UserPenalty> findExpiredPenalties(@Param("now") Instant now);

    // === Check if user has active penalty ===
    
    @Query("SELECT COUNT(p) > 0 FROM UserPenalty p WHERE p.userId = :userId " +
           "AND p.penaltyType = :penaltyType AND p.isActive = true " +
           "AND (p.effectiveUntil IS NULL OR p.effectiveUntil > :now)")
    boolean hasActivePenalty(
            @Param("userId") UUID userId,
            @Param("penaltyType") PenaltyType penaltyType,
            @Param("now") Instant now
    );
}
