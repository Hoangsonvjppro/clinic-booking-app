package com.clinic.appointmentservice.service;

import com.clinic.appointmentservice.client.DoctorServiceClient;
import com.clinic.appointmentservice.client.NotificationServiceClient;
import com.clinic.appointmentservice.client.PatientServiceClient;
import com.clinic.appointmentservice.client.dto.DoctorAvailability;
import com.clinic.appointmentservice.client.dto.PatientProfile;
import com.clinic.appointmentservice.config.AppointmentProperties;
import com.clinic.appointmentservice.domain.Appointment;
import com.clinic.appointmentservice.domain.AppointmentStatus;
import com.clinic.appointmentservice.domain.AppointmentStatusCode;
import com.clinic.appointmentservice.dto.CancelAppointmentRequest;
import com.clinic.appointmentservice.dto.CreateAppointmentRequest;
import com.clinic.appointmentservice.dto.RequesterRole;
import com.clinic.appointmentservice.dto.UpdateAppointmentStatusRequest;
import com.clinic.appointmentservice.exception.CancellationNotAllowedException;
import com.clinic.appointmentservice.exception.InvalidAppointmentStateException;
import com.clinic.appointmentservice.exception.RemoteServiceException;
import com.clinic.appointmentservice.repository.AppointmentAuditRepository;
import com.clinic.appointmentservice.repository.AppointmentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.*;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AppointmentServiceTest {

    @Mock
    private AppointmentRepository appointmentRepository;
    @Mock
    private AppointmentStatusService appointmentStatusService;
    @Mock
    private AppointmentAuditRepository appointmentAuditRepository;
    @Mock
    private PatientServiceClient patientServiceClient;
    @Mock
    private DoctorServiceClient doctorServiceClient;
    @Mock
    private NotificationServiceClient notificationServiceClient;

    private AppointmentProperties appointmentProperties;
    private Clock fixedClock;

    @InjectMocks
    private AppointmentService appointmentService;

    @BeforeEach
    void setUp() {
        appointmentProperties = new AppointmentProperties();
        appointmentProperties.setCancellationCutoffHours(24);
        fixedClock = Clock.fixed(Instant.parse("2025-01-01T10:00:00Z"), ZoneOffset.UTC);
        appointmentService = new AppointmentService(
                appointmentRepository,
                appointmentStatusService,
                appointmentAuditRepository,
                patientServiceClient,
                doctorServiceClient,
                notificationServiceClient,
                appointmentProperties,
                fixedClock
        );
    }

    @Test
    void createAppointment_autoConfirm_setsConfirmedStatus() {
        CreateAppointmentRequest request = new CreateAppointmentRequest();
        request.setPatientId(1L);
        request.setDoctorId(2L);
        request.setAppointmentTime(LocalDateTime.of(2025, 1, 2, 9, 0));
        request.setDurationMinutes(30);

        when(patientServiceClient.getPatient(1L)).thenReturn(new PatientProfile(1L, true, "ACTIVE"));
        when(doctorServiceClient.verifyAvailability(2L, request.getAppointmentTime(), 30))
                .thenReturn(new DoctorAvailability(2L, true, true));

        AppointmentStatus confirmedStatus = new AppointmentStatus(AppointmentStatusCode.CONFIRMED, "Confirmed");
        when(appointmentStatusService.getStatus(AppointmentStatusCode.CONFIRMED)).thenReturn(confirmedStatus);

        when(appointmentRepository.existsByDoctorIdAndAppointmentTime(2L, request.getAppointmentTime())).thenReturn(false);
        when(appointmentRepository.save(any(Appointment.class))).thenAnswer(invocation -> {
            Appointment entity = invocation.getArgument(0);
            ReflectionTestUtils.setField(entity, "id", 99L);
            ReflectionTestUtils.setField(entity, "createdAt", Instant.parse("2025-01-01T10:00:00Z"));
            ReflectionTestUtils.setField(entity, "updatedAt", Instant.parse("2025-01-01T10:00:00Z"));
            return entity;
        });

        var response = appointmentService.createAppointment(request);

        assertThat(response.status()).isEqualTo("CONFIRMED");
        verify(notificationServiceClient, times(1)).sendNotification(any());
        verify(appointmentAuditRepository, times(2)).save(any());
    }

    @Test
    void createAppointment_notificationFailure_doesNotRollback() {
        CreateAppointmentRequest request = new CreateAppointmentRequest();
        request.setPatientId(1L);
        request.setDoctorId(2L);
        request.setAppointmentTime(LocalDateTime.of(2025, 1, 2, 9, 0));
        request.setDurationMinutes(30);

        when(patientServiceClient.getPatient(1L)).thenReturn(new PatientProfile(1L, true, "ACTIVE"));
        when(doctorServiceClient.verifyAvailability(2L, request.getAppointmentTime(), 30))
                .thenReturn(new DoctorAvailability(2L, true, true));

        AppointmentStatus confirmedStatus = new AppointmentStatus(AppointmentStatusCode.CONFIRMED, "Confirmed");
        when(appointmentStatusService.getStatus(AppointmentStatusCode.CONFIRMED)).thenReturn(confirmedStatus);

        when(appointmentRepository.existsByDoctorIdAndAppointmentTime(2L, request.getAppointmentTime())).thenReturn(false);
        when(appointmentRepository.save(any(Appointment.class))).thenAnswer(invocation -> {
            Appointment entity = invocation.getArgument(0);
            ReflectionTestUtils.setField(entity, "id", 100L);
            ReflectionTestUtils.setField(entity, "createdAt", Instant.parse("2025-01-01T10:00:00Z"));
            ReflectionTestUtils.setField(entity, "updatedAt", Instant.parse("2025-01-01T10:00:00Z"));
            return entity;
        });

        doThrow(new RemoteServiceException("downstream unreachable"))
                .when(notificationServiceClient)
                .sendNotification(any());

        var response = appointmentService.createAppointment(request);

        assertThat(response.status()).isEqualTo("CONFIRMED");
        verify(appointmentRepository, times(1)).save(any(Appointment.class));
        verify(appointmentAuditRepository, times(2)).save(any());
        verify(notificationServiceClient, times(1)).sendNotification(any());
    }

    @Test
    void cancelAppointment_afterCutoff_throwsException() {
        Appointment appointment = buildAppointment(1L, 2L, AppointmentStatusCode.PENDING, LocalDateTime.of(2025, 1, 1, 12, 0));
        when(appointmentRepository.findById(10L)).thenReturn(Optional.of(appointment));

        CancelAppointmentRequest request = new CancelAppointmentRequest();
        request.setRequesterId(1L);
        request.setRequesterRole(RequesterRole.PATIENT);
        request.setReason("Busy");

        assertThatThrownBy(() -> appointmentService.cancelAppointment(10L, request))
                .isInstanceOf(CancellationNotAllowedException.class);

        verify(notificationServiceClient, never()).sendNotification(any());
    }

    @Test
    void updateStatus_fromCancelledToConfirmed_isInvalid() {
        Appointment appointment = buildAppointment(1L, 2L, AppointmentStatusCode.CANCELLED, LocalDateTime.of(2025, 2, 1, 10, 0));
        when(appointmentRepository.findById(10L)).thenReturn(Optional.of(appointment));

        UpdateAppointmentStatusRequest request = new UpdateAppointmentStatusRequest();
        request.setRequesterId(2L);
        request.setRequesterRole(RequesterRole.DOCTOR);
        request.setStatus("CONFIRMED");

        assertThatThrownBy(() -> appointmentService.updateStatus(10L, request))
                .isInstanceOf(InvalidAppointmentStateException.class);
    }

    private Appointment buildAppointment(Long patientId, Long doctorId, AppointmentStatusCode statusCode, LocalDateTime time) {
        Appointment appointment = Appointment.create();
        appointment.setPatientId(patientId);
        appointment.setDoctorId(doctorId);
        appointment.setAppointmentTime(time);
        appointment.setStatus(new AppointmentStatus(statusCode, statusCode.name()));
        appointment.setDurationMinutes(30);
        ReflectionTestUtils.setField(appointment, "id", 10L);
        ReflectionTestUtils.setField(appointment, "createdAt", Instant.parse("2024-12-31T10:00:00Z"));
        ReflectionTestUtils.setField(appointment, "updatedAt", Instant.parse("2024-12-31T10:00:00Z"));
        return appointment;
    }
}
