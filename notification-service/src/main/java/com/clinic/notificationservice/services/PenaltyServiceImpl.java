package com.clinic.notificationservice.services;

import com.clinic.notificationservice.dto.request.ApplyPenaltyRequest;
import com.clinic.notificationservice.dto.response.BookingFeeMultiplierResponse;
import com.clinic.notificationservice.dto.response.PenaltyResponse;
import com.clinic.notificationservice.entity.Report;
import com.clinic.notificationservice.entity.UserPenalty;
import com.clinic.notificationservice.entity.Warning;
import com.clinic.notificationservice.enums.PenaltyType;
import com.clinic.notificationservice.enums.UserType;
import com.clinic.notificationservice.exceptions.ResourceNotFoundException;
import com.clinic.notificationservice.repository.ReportRepository;
import com.clinic.notificationservice.repository.UserPenaltyRepository;
import com.clinic.notificationservice.repository.WarningRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Implementation of PenaltyService for managing user penalties.
 */
@Service
@Transactional
public class PenaltyServiceImpl implements PenaltyService {
    
    private static final Logger log = LoggerFactory.getLogger(PenaltyServiceImpl.class);

    private final UserPenaltyRepository penaltyRepository;
    private final ReportRepository reportRepository;
    private final WarningRepository warningRepository;
    private final AuthServiceClient authServiceClient;

    public PenaltyServiceImpl(UserPenaltyRepository penaltyRepository, 
                              ReportRepository reportRepository,
                              WarningRepository warningRepository,
                              AuthServiceClient authServiceClient) {
        this.penaltyRepository = penaltyRepository;
        this.reportRepository = reportRepository;
        this.warningRepository = warningRepository;
        this.authServiceClient = authServiceClient;
    }

    @Override
    public PenaltyResponse applyPenalty(ApplyPenaltyRequest request) {
        UserPenalty penalty = new UserPenalty();
        penalty.setUserId(request.getUserId());
        penalty.setUserType(request.getUserType());
        penalty.setPenaltyType(request.getPenaltyType());
        penalty.setDescription(request.getDescription());
        penalty.setIssuedBy(request.getIssuedBy());
        penalty.setCreatedAt(Instant.now());
        penalty.setEffectiveFrom(Instant.now());
        penalty.setActive(true);
        
        // Set multiplier based on penalty type
        if (request.getMultiplier() != null) {
            penalty.setMultiplier(request.getMultiplier());
        } else {
            // Default multipliers based on penalty type
            switch (request.getPenaltyType()) {
                case DOUBLE_BOOKING_FEE:
                    penalty.setMultiplier(BigDecimal.valueOf(2.0));
                    break;
                case TRIPLE_BOOKING_FEE:
                    penalty.setMultiplier(BigDecimal.valueOf(3.0));
                    break;
                default:
                    penalty.setMultiplier(BigDecimal.ONE);
            }
        }
        
        // Set duration
        if (request.getDurationDays() != null && request.getDurationDays() > 0) {
            penalty.setEffectiveUntil(Instant.now().plusSeconds(request.getDurationDays() * 24 * 60 * 60));
        }
        
        // Link to report if provided
        if (request.getReportId() != null) {
            Report report = reportRepository.findById(request.getReportId())
                    .orElseThrow(() -> new ResourceNotFoundException("Report not found with id: " + request.getReportId()));
            penalty.setReport(report);
        }
        
        // Link to warning if provided
        if (request.getWarningId() != null) {
            Warning warning = warningRepository.findById(request.getWarningId())
                    .orElseThrow(() -> new ResourceNotFoundException("Warning not found with id: " + request.getWarningId()));
            penalty.setWarning(warning);
        }

        UserPenalty savedPenalty = penaltyRepository.save(penalty);
        
        // Sync account status with auth-service for suspension/ban penalties
        syncAccountStatusWithAuthService(savedPenalty);
        
        return PenaltyResponse.fromEntity(savedPenalty);
    }
    
    /**
     * Syncs the account status with auth-service based on penalty type.
     */
    private void syncAccountStatusWithAuthService(UserPenalty penalty) {
        String accountStatus = null;
        
        switch (penalty.getPenaltyType()) {
            case TEMPORARY_BAN:
                accountStatus = "SUSPENDED";
                break;
            case PERMANENT_BAN:
                accountStatus = "BANNED";
                break;
            default:
                // No account status change needed for fee penalties
                return;
        }
        
        try {
            boolean success = authServiceClient.updateUserAccountStatus(
                    penalty.getUserId(),
                    accountStatus,
                    penalty.getDescription()
            );
            if (success) {
                log.info("Successfully synced account status {} for user {}", 
                        accountStatus, penalty.getUserId());
            }
        } catch (Exception e) {
            log.warn("Failed to sync account status with auth-service: {}", e.getMessage());
            // Don't fail the penalty creation if auth-service sync fails
        }
    }

    @Override
    @Transactional(readOnly = true)
    public PenaltyResponse getPenaltyById(UUID penaltyId) {
        UserPenalty penalty = penaltyRepository.findById(penaltyId)
                .orElseThrow(() -> new ResourceNotFoundException("Penalty not found with id: " + penaltyId));
        return PenaltyResponse.fromEntity(penalty);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PenaltyResponse> getPenaltiesByUser(UUID userId, Pageable pageable) {
        return penaltyRepository.findByUserId(userId, pageable)
                .map(PenaltyResponse::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PenaltyResponse> getActivePenalties(UUID userId) {
        return penaltyRepository.findActiveByUserId(userId, Instant.now())
                .stream()
                .map(PenaltyResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public BookingFeeMultiplierResponse getBookingFeeMultiplier(UUID userId) {
        BigDecimal multiplier = penaltyRepository.getBookingFeeMultiplier(userId, Instant.now());
        
        if (multiplier == null || multiplier.compareTo(BigDecimal.ONE) <= 0) {
            return BookingFeeMultiplierResponse.noActivePenalty(userId.hashCode() & Long.MAX_VALUE);
        }
        
        // Find the active fee penalty for details
        List<UserPenalty> activePenalties = penaltyRepository.findActiveByUserId(userId, Instant.now());
        UserPenalty feePenalty = activePenalties.stream()
                .filter(p -> p.getPenaltyType() == PenaltyType.DOUBLE_BOOKING_FEE 
                          || p.getPenaltyType() == PenaltyType.TRIPLE_BOOKING_FEE)
                .findFirst()
                .orElse(null);
        
        if (feePenalty == null) {
            return BookingFeeMultiplierResponse.noActivePenalty(userId.hashCode() & Long.MAX_VALUE);
        }
        
        LocalDateTime expiresAt = feePenalty.getEffectiveUntil() != null 
                ? LocalDateTime.ofInstant(feePenalty.getEffectiveUntil(), ZoneId.systemDefault())
                : null;
        
        return BookingFeeMultiplierResponse.withPenalty(
                userId.hashCode() & Long.MAX_VALUE,
                multiplier.doubleValue(),
                feePenalty.getDescription(),
                expiresAt
        );
    }

    @Override
    public PenaltyResponse revokePenalty(UUID penaltyId, UUID adminId) {
        UserPenalty penalty = penaltyRepository.findById(penaltyId)
                .orElseThrow(() -> new ResourceNotFoundException("Penalty not found with id: " + penaltyId));

        if (!penalty.isActive()) {
            throw new IllegalStateException("Penalty is already inactive");
        }

        penalty.setActive(false);
        penalty.setEffectiveUntil(Instant.now());

        UserPenalty savedPenalty = penaltyRepository.save(penalty);
        
        // Reactivate user account if this was a suspension/ban penalty
        if (penalty.getPenaltyType() == PenaltyType.TEMPORARY_BAN || 
            penalty.getPenaltyType() == PenaltyType.PERMANENT_BAN) {
            try {
                authServiceClient.reactivateUser(
                        penalty.getUserId(),
                        "Penalty revoked by admin"
                );
                log.info("Reactivated user {} after penalty revocation", penalty.getUserId());
            } catch (Exception e) {
                log.warn("Failed to reactivate user account in auth-service: {}", e.getMessage());
            }
        }
        
        return PenaltyResponse.fromEntity(savedPenalty);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PenaltyResponse> getAllPenalties(Pageable pageable) {
        return penaltyRepository.findAll(pageable)
                .map(PenaltyResponse::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PenaltyResponse> getPenaltiesWithFilters(UUID userId, UserType userType, 
                                                          PenaltyType penaltyType, boolean activeOnly, 
                                                          Pageable pageable) {
        return penaltyRepository.findWithFilters(userId, userType, penaltyType, activeOnly, pageable)
                .map(PenaltyResponse::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PenaltyResponse> getPenaltiesByReport(UUID reportId) {
        return penaltyRepository.findByReportId(reportId)
                .stream()
                .map(PenaltyResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PenaltyResponse> getPenaltiesByWarning(UUID warningId) {
        return penaltyRepository.findByWarningId(warningId)
                .stream()
                .map(PenaltyResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public long countPenaltiesByUser(UUID userId) {
        return penaltyRepository.findByUserId(userId, Pageable.unpaged()).getTotalElements();
    }

    @Override
    @Transactional(readOnly = true)
    public long countActivePenalties(UUID userId) {
        return penaltyRepository.findActiveByUserId(userId, Instant.now()).size();
    }

    @Override
    @Transactional(readOnly = true)
    public boolean hasActiveFeePenalty(UUID userId) {
        BigDecimal multiplier = penaltyRepository.getBookingFeeMultiplier(userId, Instant.now());
        return multiplier != null && multiplier.compareTo(BigDecimal.ONE) > 0;
    }
}
