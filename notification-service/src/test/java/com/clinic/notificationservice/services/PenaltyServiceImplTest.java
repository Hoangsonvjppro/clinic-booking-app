package com.clinic.notificationservice.services;

import com.clinic.notificationservice.dto.request.ApplyPenaltyRequest;
import com.clinic.notificationservice.dto.response.BookingFeeMultiplierResponse;
import com.clinic.notificationservice.dto.response.PenaltyResponse;
import com.clinic.notificationservice.entity.UserPenalty;
import com.clinic.notificationservice.enums.PenaltyType;
import com.clinic.notificationservice.enums.UserType;
import com.clinic.notificationservice.exceptions.ResourceNotFoundException;
import com.clinic.notificationservice.repository.ReportRepository;
import com.clinic.notificationservice.repository.UserPenaltyRepository;
import com.clinic.notificationservice.repository.WarningRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for PenaltyServiceImpl.
 */
@ExtendWith(MockitoExtension.class)
class PenaltyServiceImplTest {

    @Mock
    private UserPenaltyRepository penaltyRepository;

    @Mock
    private ReportRepository reportRepository;

    @Mock
    private WarningRepository warningRepository;

    @Mock
    private AuthServiceClient authServiceClient;

    private PenaltyServiceImpl penaltyService;

    private UUID userId;
    private UUID penaltyId;
    private UUID adminId;

    @BeforeEach
    void setUp() {
        penaltyService = new PenaltyServiceImpl(
                penaltyRepository, 
                reportRepository, 
                warningRepository, 
                authServiceClient
        );
        userId = UUID.randomUUID();
        penaltyId = UUID.randomUUID();
        adminId = UUID.randomUUID();
    }

    @Nested
    @DisplayName("applyPenalty tests")
    class ApplyPenaltyTests {

        @Test
        @DisplayName("Should apply DOUBLE_BOOKING_FEE penalty with correct multiplier")
        void shouldApplyDoubleBookingFeePenalty() {
            // Given
            ApplyPenaltyRequest request = new ApplyPenaltyRequest();
            request.setUserId(userId);
            request.setUserType(UserType.PATIENT);
            request.setPenaltyType(PenaltyType.DOUBLE_BOOKING_FEE);
            request.setDescription("Too many no-shows");
            request.setIssuedBy(adminId);

            UserPenalty savedPenalty = createTestPenalty(PenaltyType.DOUBLE_BOOKING_FEE);
            savedPenalty.setMultiplier(BigDecimal.valueOf(2.0));
            when(penaltyRepository.save(any(UserPenalty.class))).thenReturn(savedPenalty);

            // When
            PenaltyResponse response = penaltyService.applyPenalty(request);

            // Then
            assertThat(response).isNotNull();
            assertThat(response.getPenaltyType()).isEqualTo(PenaltyType.DOUBLE_BOOKING_FEE);
            assertThat(response.getMultiplier()).isEqualByComparingTo(BigDecimal.valueOf(2.0));
            verify(penaltyRepository, times(1)).save(any(UserPenalty.class));
        }

        @Test
        @DisplayName("Should apply TRIPLE_BOOKING_FEE penalty with correct multiplier")
        void shouldApplyTripleBookingFeePenalty() {
            // Given
            ApplyPenaltyRequest request = new ApplyPenaltyRequest();
            request.setUserId(userId);
            request.setUserType(UserType.PATIENT);
            request.setPenaltyType(PenaltyType.TRIPLE_BOOKING_FEE);
            request.setDescription("Repeat offender");
            request.setIssuedBy(adminId);

            UserPenalty savedPenalty = createTestPenalty(PenaltyType.TRIPLE_BOOKING_FEE);
            savedPenalty.setMultiplier(BigDecimal.valueOf(3.0));
            when(penaltyRepository.save(any(UserPenalty.class))).thenReturn(savedPenalty);

            // When
            PenaltyResponse response = penaltyService.applyPenalty(request);

            // Then
            assertThat(response.getMultiplier()).isEqualByComparingTo(BigDecimal.valueOf(3.0));
        }

        @Test
        @DisplayName("Should sync TEMPORARY_BAN to auth-service as SUSPENDED")
        void shouldSyncTemporaryBanToAuthService() {
            // Given
            ApplyPenaltyRequest request = new ApplyPenaltyRequest();
            request.setUserId(userId);
            request.setUserType(UserType.PATIENT);
            request.setPenaltyType(PenaltyType.TEMPORARY_BAN);
            request.setDescription("Temporary suspension");
            request.setIssuedBy(adminId);
            request.setDurationDays(7);

            UserPenalty savedPenalty = createTestPenalty(PenaltyType.TEMPORARY_BAN);
            when(penaltyRepository.save(any(UserPenalty.class))).thenReturn(savedPenalty);
            when(authServiceClient.updateUserAccountStatus(eq(userId), eq("SUSPENDED"), anyString()))
                    .thenReturn(true);

            // When
            PenaltyResponse response = penaltyService.applyPenalty(request);

            // Then
            verify(authServiceClient, times(1))
                    .updateUserAccountStatus(eq(userId), eq("SUSPENDED"), anyString());
        }

        @Test
        @DisplayName("Should sync PERMANENT_BAN to auth-service as BANNED")
        void shouldSyncPermanentBanToAuthService() {
            // Given
            ApplyPenaltyRequest request = new ApplyPenaltyRequest();
            request.setUserId(userId);
            request.setUserType(UserType.PATIENT);
            request.setPenaltyType(PenaltyType.PERMANENT_BAN);
            request.setDescription("Permanent ban");
            request.setIssuedBy(adminId);

            UserPenalty savedPenalty = createTestPenalty(PenaltyType.PERMANENT_BAN);
            when(penaltyRepository.save(any(UserPenalty.class))).thenReturn(savedPenalty);
            when(authServiceClient.updateUserAccountStatus(eq(userId), eq("BANNED"), anyString()))
                    .thenReturn(true);

            // When
            PenaltyResponse response = penaltyService.applyPenalty(request);

            // Then
            verify(authServiceClient, times(1))
                    .updateUserAccountStatus(eq(userId), eq("BANNED"), anyString());
        }

        @Test
        @DisplayName("Should continue penalty creation even if auth-service sync fails")
        void shouldContinuePenaltyCreationIfAuthServiceSyncFails() {
            // Given
            ApplyPenaltyRequest request = new ApplyPenaltyRequest();
            request.setUserId(userId);
            request.setUserType(UserType.PATIENT);
            request.setPenaltyType(PenaltyType.TEMPORARY_BAN);
            request.setDescription("Temporary suspension");
            request.setIssuedBy(adminId);

            UserPenalty savedPenalty = createTestPenalty(PenaltyType.TEMPORARY_BAN);
            when(penaltyRepository.save(any(UserPenalty.class))).thenReturn(savedPenalty);
            when(authServiceClient.updateUserAccountStatus(any(), any(), any()))
                    .thenThrow(new RuntimeException("Auth service unavailable"));

            // When
            PenaltyResponse response = penaltyService.applyPenalty(request);

            // Then
            assertThat(response).isNotNull();
            verify(penaltyRepository, times(1)).save(any(UserPenalty.class));
        }
    }

    @Nested
    @DisplayName("revokePenalty tests")
    class RevokePenaltyTests {

        @Test
        @DisplayName("Should revoke active penalty")
        void shouldRevokeActivePenalty() {
            // Given
            UserPenalty penalty = createTestPenalty(PenaltyType.DOUBLE_BOOKING_FEE);
            penalty.setActive(true);
            when(penaltyRepository.findById(penaltyId)).thenReturn(Optional.of(penalty));
            when(penaltyRepository.save(any(UserPenalty.class))).thenReturn(penalty);

            // When
            PenaltyResponse response = penaltyService.revokePenalty(penaltyId, adminId);

            // Then
            assertThat(response).isNotNull();
            verify(penaltyRepository, times(1)).save(argThat(p -> !p.isActive()));
        }

        @Test
        @DisplayName("Should throw exception when revoking already inactive penalty")
        void shouldThrowExceptionWhenRevokingInactivePenalty() {
            // Given
            UserPenalty penalty = createTestPenalty(PenaltyType.DOUBLE_BOOKING_FEE);
            penalty.setActive(false);
            when(penaltyRepository.findById(penaltyId)).thenReturn(Optional.of(penalty));

            // When & Then
            assertThatThrownBy(() -> penaltyService.revokePenalty(penaltyId, adminId))
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessageContaining("already inactive");
        }

        @Test
        @DisplayName("Should reactivate user when revoking TEMPORARY_BAN")
        void shouldReactivateUserWhenRevokingTemporaryBan() {
            // Given
            UserPenalty penalty = createTestPenalty(PenaltyType.TEMPORARY_BAN);
            penalty.setActive(true);
            when(penaltyRepository.findById(penaltyId)).thenReturn(Optional.of(penalty));
            when(penaltyRepository.save(any(UserPenalty.class))).thenReturn(penalty);
            when(authServiceClient.reactivateUser(eq(userId), anyString())).thenReturn(true);

            // When
            penaltyService.revokePenalty(penaltyId, adminId);

            // Then
            verify(authServiceClient, times(1)).reactivateUser(eq(userId), anyString());
        }
    }

    @Nested
    @DisplayName("getBookingFeeMultiplier tests")
    class GetBookingFeeMultiplierTests {

        @Test
        @DisplayName("Should return 1.0 when no active fee penalty")
        void shouldReturnOneWhenNoActivePenalty() {
            // Given
            when(penaltyRepository.getBookingFeeMultiplier(eq(userId), any(Instant.class)))
                    .thenReturn(null);

            // When
            BookingFeeMultiplierResponse response = penaltyService.getBookingFeeMultiplier(userId);

            // Then
            assertThat(response.getMultiplier()).isEqualTo(1.0);
            assertThat(response.isHasActivePenalty()).isFalse();
        }

        @Test
        @DisplayName("Should return correct multiplier when active fee penalty exists")
        void shouldReturnCorrectMultiplierWhenActivePenaltyExists() {
            // Given
            when(penaltyRepository.getBookingFeeMultiplier(eq(userId), any(Instant.class)))
                    .thenReturn(BigDecimal.valueOf(2.0));
            
            UserPenalty feePenalty = createTestPenalty(PenaltyType.DOUBLE_BOOKING_FEE);
            feePenalty.setMultiplier(BigDecimal.valueOf(2.0));
            when(penaltyRepository.findActiveByUserId(eq(userId), any(Instant.class)))
                    .thenReturn(List.of(feePenalty));

            // When
            BookingFeeMultiplierResponse response = penaltyService.getBookingFeeMultiplier(userId);

            // Then
            assertThat(response.getMultiplier()).isEqualTo(2.0);
            assertThat(response.isHasActivePenalty()).isTrue();
        }
    }

    @Nested
    @DisplayName("getPenaltyById tests")
    class GetPenaltyByIdTests {

        @Test
        @DisplayName("Should return penalty when exists")
        void shouldReturnPenaltyWhenExists() {
            // Given
            UserPenalty penalty = createTestPenalty(PenaltyType.DOUBLE_BOOKING_FEE);
            when(penaltyRepository.findById(penaltyId)).thenReturn(Optional.of(penalty));

            // When
            PenaltyResponse response = penaltyService.getPenaltyById(penaltyId);

            // Then
            assertThat(response).isNotNull();
            assertThat(response.getId()).isEqualTo(penaltyId);
        }

        @Test
        @DisplayName("Should throw exception when penalty not found")
        void shouldThrowExceptionWhenPenaltyNotFound() {
            // Given
            when(penaltyRepository.findById(penaltyId)).thenReturn(Optional.empty());

            // When & Then
            assertThatThrownBy(() -> penaltyService.getPenaltyById(penaltyId))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining(penaltyId.toString());
        }
    }

    private UserPenalty createTestPenalty(PenaltyType penaltyType) {
        UserPenalty penalty = new UserPenalty();
        penalty.setId(penaltyId);
        penalty.setUserId(userId);
        penalty.setUserType(UserType.PATIENT);
        penalty.setPenaltyType(penaltyType);
        penalty.setDescription("Test penalty");
        penalty.setIssuedBy(adminId);
        penalty.setActive(true);
        penalty.setMultiplier(BigDecimal.ONE);
        penalty.setCreatedAt(Instant.now());
        penalty.setEffectiveFrom(Instant.now());
        return penalty;
    }
}
