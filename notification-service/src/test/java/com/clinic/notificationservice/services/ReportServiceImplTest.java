package com.clinic.notificationservice.services;

import com.clinic.notificationservice.dto.request.CreateReportRequest;
import com.clinic.notificationservice.dto.response.ReportResponse;
import com.clinic.notificationservice.entity.Report;
import com.clinic.notificationservice.enums.ReportStatus;
import com.clinic.notificationservice.enums.ReportType;
import com.clinic.notificationservice.enums.UserType;
import com.clinic.notificationservice.exceptions.ResourceNotFoundException;
import com.clinic.notificationservice.repository.ReportRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
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
 * Unit tests for ReportServiceImpl.
 */
@ExtendWith(MockitoExtension.class)
class ReportServiceImplTest {

    @Mock
    private ReportRepository reportRepository;

    @InjectMocks
    private ReportServiceImpl reportService;

    private UUID reporterId;
    private UUID reportedId;
    private UUID reportId;

    @BeforeEach
    void setUp() {
        reporterId = UUID.randomUUID();
        reportedId = UUID.randomUUID();
        reportId = UUID.randomUUID();
    }

    @Nested
    @DisplayName("createReport tests")
    class CreateReportTests {

        @Test
        @DisplayName("Should create report successfully")
        void shouldCreateReportSuccessfully() {
            // Given
            CreateReportRequest request = new CreateReportRequest();
            request.setReportedId(reportedId);
            request.setReportType(ReportType.UNPROFESSIONAL_BEHAVIOR);
            request.setTitle("Test Report");
            request.setDescription("Test description");

            Report savedReport = createTestReport();
            when(reportRepository.save(any(Report.class))).thenReturn(savedReport);

            // When
            ReportResponse response = reportService.createReport(reporterId, UserType.PATIENT, request);

            // Then
            assertThat(response).isNotNull();
            assertThat(response.getReporterId()).isEqualTo(reporterId);
            assertThat(response.getReportedId()).isEqualTo(reportedId);
            assertThat(response.getStatus()).isEqualTo(ReportStatus.PENDING);
            verify(reportRepository, times(1)).save(any(Report.class));
        }

        @Test
        @DisplayName("Should set correct user types for patient reporter")
        void shouldSetCorrectUserTypesForPatientReporter() {
            // Given
            CreateReportRequest request = new CreateReportRequest();
            request.setReportedId(reportedId);
            request.setReportType(ReportType.UNPROFESSIONAL_BEHAVIOR);
            request.setTitle("Test Report");
            request.setDescription("Test description");

            Report savedReport = createTestReport();
            savedReport.setReporterType(UserType.PATIENT);
            savedReport.setReportedType(UserType.DOCTOR);
            when(reportRepository.save(any(Report.class))).thenReturn(savedReport);

            // When
            ReportResponse response = reportService.createReport(reporterId, UserType.PATIENT, request);

            // Then
            assertThat(response.getReporterType()).isEqualTo(UserType.PATIENT);
            assertThat(response.getReportedType()).isEqualTo(UserType.DOCTOR);
        }
    }

    @Nested
    @DisplayName("getReportById tests")
    class GetReportByIdTests {

        @Test
        @DisplayName("Should return report when exists")
        void shouldReturnReportWhenExists() {
            // Given
            Report report = createTestReport();
            when(reportRepository.findById(reportId)).thenReturn(Optional.of(report));

            // When
            ReportResponse response = reportService.getReportById(reportId);

            // Then
            assertThat(response).isNotNull();
            assertThat(response.getId()).isEqualTo(reportId);
        }

        @Test
        @DisplayName("Should throw exception when report not found")
        void shouldThrowExceptionWhenReportNotFound() {
            // Given
            when(reportRepository.findById(reportId)).thenReturn(Optional.empty());

            // When & Then
            assertThatThrownBy(() -> reportService.getReportById(reportId))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining(reportId.toString());
        }
    }

    @Nested
    @DisplayName("getReportsByReporter tests")
    class GetReportsByReporterTests {

        @Test
        @DisplayName("Should return paginated reports for reporter")
        void shouldReturnPaginatedReportsForReporter() {
            // Given
            Pageable pageable = PageRequest.of(0, 10);
            Report report = createTestReport();
            Page<Report> reportPage = new PageImpl<>(List.of(report), pageable, 1);
            when(reportRepository.findByReporterId(reporterId, pageable)).thenReturn(reportPage);

            // When
            Page<ReportResponse> response = reportService.getReportsByReporter(reporterId, pageable);

            // Then
            assertThat(response.getContent()).hasSize(1);
            assertThat(response.getTotalElements()).isEqualTo(1);
        }

        @Test
        @DisplayName("Should return empty page when no reports")
        void shouldReturnEmptyPageWhenNoReports() {
            // Given
            Pageable pageable = PageRequest.of(0, 10);
            Page<Report> emptyPage = Page.empty(pageable);
            when(reportRepository.findByReporterId(reporterId, pageable)).thenReturn(emptyPage);

            // When
            Page<ReportResponse> response = reportService.getReportsByReporter(reporterId, pageable);

            // Then
            assertThat(response.getContent()).isEmpty();
            assertThat(response.getTotalElements()).isZero();
        }
    }

    @Nested
    @DisplayName("getReportsByStatus tests")
    class GetReportsByStatusTests {

        @Test
        @DisplayName("Should filter reports by PENDING status")
        void shouldFilterReportsByPendingStatus() {
            // Given
            Pageable pageable = PageRequest.of(0, 10);
            Report report = createTestReport();
            report.setStatus(ReportStatus.PENDING);
            Page<Report> reportPage = new PageImpl<>(List.of(report), pageable, 1);
            when(reportRepository.findByStatus(ReportStatus.PENDING, pageable)).thenReturn(reportPage);

            // When
            Page<ReportResponse> response = reportService.getReportsByStatus(ReportStatus.PENDING, pageable);

            // Then
            assertThat(response.getContent()).hasSize(1);
            assertThat(response.getContent().get(0).getStatus()).isEqualTo(ReportStatus.PENDING);
        }
    }

    @Nested
    @DisplayName("countByStatus tests")
    class CountByStatusTests {

        @Test
        @DisplayName("Should return correct count")
        void shouldReturnCorrectCount() {
            // Given
            when(reportRepository.countByStatus(ReportStatus.PENDING)).thenReturn(5L);

            // When
            long count = reportService.countByStatus(ReportStatus.PENDING);

            // Then
            assertThat(count).isEqualTo(5L);
        }
    }

    private Report createTestReport() {
        Report report = new Report();
        report.setId(reportId);
        report.setReporterId(reporterId);
        report.setReportedId(reportedId);
        report.setReporterType(UserType.PATIENT);
        report.setReportedType(UserType.DOCTOR);
        report.setReportType(ReportType.UNPROFESSIONAL_BEHAVIOR);
        report.setTitle("Test Report");
        report.setDescription("Test description");
        report.setStatus(ReportStatus.PENDING);
        report.setCreatedAt(Instant.now());
        return report;
    }
}
