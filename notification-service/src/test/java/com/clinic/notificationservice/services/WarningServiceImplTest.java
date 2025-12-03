package com.clinic.notificationservice.services;

import com.clinic.notificationservice.dto.request.SendWarningRequest;
import com.clinic.notificationservice.dto.response.WarningResponse;
import com.clinic.notificationservice.entity.Warning;
import com.clinic.notificationservice.enums.UserType;
import com.clinic.notificationservice.enums.WarningType;
import com.clinic.notificationservice.exceptions.ResourceNotFoundException;
import com.clinic.notificationservice.repository.ReportRepository;
import com.clinic.notificationservice.repository.WarningRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for WarningServiceImpl.
 */
@ExtendWith(MockitoExtension.class)
class WarningServiceImplTest {

    @Mock
    private WarningRepository warningRepository;

    @Mock
    private ReportRepository reportRepository;

    private WarningServiceImpl warningService;

    private UUID userId;
    private UUID warningId;
    private UUID adminId;

    @BeforeEach
    void setUp() {
        warningService = new WarningServiceImpl(warningRepository, reportRepository);
        userId = UUID.randomUUID();
        warningId = UUID.randomUUID();
        adminId = UUID.randomUUID();
    }

    @Nested
    @DisplayName("sendWarning tests")
    class SendWarningTests {

        @Test
        @DisplayName("Should send warning successfully")
        void shouldSendWarningSuccessfully() {
            // Given
            SendWarningRequest request = new SendWarningRequest();
            request.setUserId(userId);
            request.setUserType(UserType.PATIENT);
            request.setWarningType(WarningType.WARNING);
            request.setTitle("Warning Notice");
            request.setMessage("You missed your appointment");
            request.setIssuedBy(adminId);

            Warning savedWarning = createTestWarning();
            when(warningRepository.save(any(Warning.class))).thenReturn(savedWarning);

            // When
            WarningResponse response = warningService.sendWarning(request);

            // Then
            assertThat(response).isNotNull();
            assertThat(response.getUserId()).isEqualTo(userId);
            assertThat(response.getWarningType()).isEqualTo(WarningType.WARNING);
            verify(warningRepository, times(1)).save(any(Warning.class));
        }

        @Test
        @DisplayName("Should set read status to false for new warning")
        void shouldSetReadStatusToFalseForNewWarning() {
            // Given
            SendWarningRequest request = new SendWarningRequest();
            request.setUserId(userId);
            request.setUserType(UserType.PATIENT);
            request.setWarningType(WarningType.WARNING);
            request.setTitle("Warning");
            request.setMessage("Please be on time");
            request.setIssuedBy(adminId);

            Warning savedWarning = createTestWarning();
            savedWarning.setRead(false);
            when(warningRepository.save(any(Warning.class))).thenReturn(savedWarning);

            // When
            WarningResponse response = warningService.sendWarning(request);

            // Then
            assertThat(response.isRead()).isFalse();
        }
    }

    @Nested
    @DisplayName("getWarningById tests")
    class GetWarningByIdTests {

        @Test
        @DisplayName("Should return warning when exists")
        void shouldReturnWarningWhenExists() {
            // Given
            Warning warning = createTestWarning();
            when(warningRepository.findById(warningId)).thenReturn(Optional.of(warning));

            // When
            WarningResponse response = warningService.getWarningById(warningId);

            // Then
            assertThat(response).isNotNull();
            assertThat(response.getId()).isEqualTo(warningId);
        }

        @Test
        @DisplayName("Should throw exception when warning not found")
        void shouldThrowExceptionWhenWarningNotFound() {
            // Given
            when(warningRepository.findById(warningId)).thenReturn(Optional.empty());

            // When & Then
            assertThatThrownBy(() -> warningService.getWarningById(warningId))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining(warningId.toString());
        }
    }

    @Nested
    @DisplayName("getWarningsByUser tests")
    class GetWarningsByUserTests {

        @Test
        @DisplayName("Should return paginated warnings for user")
        void shouldReturnPaginatedWarningsForUser() {
            // Given
            Pageable pageable = PageRequest.of(0, 10);
            Warning warning = createTestWarning();
            Page<Warning> warningPage = new PageImpl<>(List.of(warning), pageable, 1);
            when(warningRepository.findByUserId(userId, pageable)).thenReturn(warningPage);

            // When
            Page<WarningResponse> response = warningService.getWarningsByUser(userId, pageable);

            // Then
            assertThat(response.getContent()).hasSize(1);
            assertThat(response.getTotalElements()).isEqualTo(1);
        }
    }

    @Nested
    @DisplayName("markAsRead tests")
    class MarkAsReadTests {

        @Test
        @DisplayName("Should mark warning as read")
        void shouldMarkWarningAsRead() {
            // Given
            Warning warning = createTestWarning();
            warning.setRead(false);
            when(warningRepository.findById(warningId)).thenReturn(Optional.of(warning));
            when(warningRepository.save(any(Warning.class))).thenReturn(warning);

            // When
            warningService.markAsRead(warningId, userId);

            // Then
            verify(warningRepository, times(1)).save(argThat(Warning::isRead));
        }
    }

    @Nested
    @DisplayName("countWarningsByUser tests")
    class CountWarningsByUserTests {

        @Test
        @DisplayName("Should return correct warning count")
        void shouldReturnCorrectWarningCount() {
            // Given
            when(warningRepository.countByUserId(userId)).thenReturn(5L);

            // When
            long count = warningService.countWarningsByUser(userId);

            // Then
            assertThat(count).isEqualTo(5L);
        }
    }

    private Warning createTestWarning() {
        Warning warning = new Warning();
        warning.setId(warningId);
        warning.setUserId(userId);
        warning.setUserType(UserType.PATIENT);
        warning.setWarningType(WarningType.WARNING);
        warning.setTitle("Test Warning");
        warning.setMessage("Test warning message");
        warning.setIssuedBy(adminId);
        warning.setRead(false);
        warning.setCreatedAt(Instant.now());
        return warning;
    }
}
