package com.clinic.appointmentservice.service;

import com.clinic.appointmentservice.client.DoctorServiceClient;
import com.clinic.appointmentservice.client.NotificationServiceClient;
import com.clinic.appointmentservice.client.PatientServiceClient;
import com.clinic.appointmentservice.client.dto.DoctorAvailability;
import com.clinic.appointmentservice.client.dto.NotificationRequest;
import com.clinic.appointmentservice.client.dto.PatientProfile;
import com.clinic.appointmentservice.config.AppointmentProperties;
import com.clinic.appointmentservice.domain.Appointment;
import com.clinic.appointmentservice.domain.AppointmentAudit;
import com.clinic.appointmentservice.domain.AppointmentStatus;
import com.clinic.appointmentservice.domain.AppointmentStatusCode;
import com.clinic.appointmentservice.dto.*;
import com.clinic.appointmentservice.exception.*;
import com.clinic.appointmentservice.mapper.AppointmentMapper;
import com.clinic.appointmentservice.repository.AppointmentAuditRepository;
import com.clinic.appointmentservice.repository.AppointmentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.Objects;

@Service
public class AppointmentService {

    private static final Logger log = LoggerFactory.getLogger(AppointmentService.class);
    private static final DateTimeFormatter MESSAGE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    private final AppointmentRepository appointmentRepository;
    private final AppointmentStatusService appointmentStatusService;
    private final AppointmentAuditRepository appointmentAuditRepository;
    private final PatientServiceClient patientServiceClient;
    private final DoctorServiceClient doctorServiceClient;
    private final NotificationServiceClient notificationServiceClient;
    private final AppointmentProperties appointmentProperties;
    private final Clock clock;

    public AppointmentService(AppointmentRepository appointmentRepository,
                              AppointmentStatusService appointmentStatusService,
                              AppointmentAuditRepository appointmentAuditRepository,
                              PatientServiceClient patientServiceClient,
                              DoctorServiceClient doctorServiceClient,
                              NotificationServiceClient notificationServiceClient,
                              AppointmentProperties appointmentProperties,
                              Clock clock) {
        this.appointmentRepository = appointmentRepository;
        this.appointmentStatusService = appointmentStatusService;
        this.appointmentAuditRepository = appointmentAuditRepository;
        this.patientServiceClient = patientServiceClient;
        this.doctorServiceClient = doctorServiceClient;
        this.notificationServiceClient = notificationServiceClient;
        this.appointmentProperties = appointmentProperties;
        this.clock = clock;
    }

    @Transactional
    public AppointmentResponse createAppointment(CreateAppointmentRequest request) {
        PatientProfile patient = patientServiceClient.getPatient(request.getPatientId());
        if (!patient.active()) {
            throw new PatientInactiveException(request.getPatientId());
        }

        DoctorAvailability doctorAvailability =
                doctorServiceClient.verifyAvailability(request.getDoctorId(), request.getAppointmentTime(), request.getDurationMinutes());

        ensureNoConflict(request.getDoctorId(), request.getAppointmentTime());

        Appointment appointment = Appointment.create();
        appointment.setPatientId(request.getPatientId());
        appointment.setDoctorId(request.getDoctorId());
        appointment.setAppointmentTime(request.getAppointmentTime());
        appointment.setDurationMinutes(request.getDurationMinutes());
        appointment.setNotes(request.getNotes());

        AppointmentStatus initialStatus = doctorAvailability.autoAccept()
                ? appointmentStatusService.getStatus(AppointmentStatusCode.CONFIRMED)
                : appointmentStatusService.getStatus(AppointmentStatusCode.PENDING);

        appointment.setStatus(initialStatus);

        try {
            appointment = appointmentRepository.save(appointment);
        } catch (DataIntegrityViolationException ex) {
            throw new AppointmentConflictException(request.getDoctorId(), request.getAppointmentTime().toString());
        }

        String performedBy = "PATIENT_" + request.getPatientId();
        appointmentAuditRepository.save(new AppointmentAudit(appointment, "CREATED", performedBy, request.getNotes()));

        if (doctorAvailability.autoAccept()) {
            appointmentAuditRepository.save(new AppointmentAudit(appointment, "AUTO_CONFIRMED", "SYSTEM", null));
        }

        sendCreationNotification(appointment);

        return AppointmentMapper.toResponse(appointment);
    }

    @Transactional
    public AppointmentResponse cancelAppointment(Long appointmentId, CancelAppointmentRequest request) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppointmentNotFoundException(appointmentId));

        validateRequesterForAppointment(appointment, request.getRequesterId(), request.getRequesterRole());

        AppointmentStatusCode currentStatus = appointment.getStatus().getCode();
        if (currentStatus == AppointmentStatusCode.CANCELLED) {
            throw new InvalidAppointmentStateException(appointmentId, currentStatus, AppointmentStatusCode.CANCELLED);
        }
        if (currentStatus == AppointmentStatusCode.COMPLETED) {
            throw new CancellationNotAllowedException("Cannot cancel a completed appointment");
        }

        ensureCancellationWindow(appointment.getAppointmentTime(), request.getRequesterRole());

        AppointmentStatus cancelledStatus = appointmentStatusService.getStatus(AppointmentStatusCode.CANCELLED);
        appointment.setStatus(cancelledStatus);
        appointment.setCancelledReason(request.getReason());

        Appointment updated = appointmentRepository.save(appointment);
        String performedBy = buildPerformer(request.getRequesterRole(), request.getRequesterId());
        appointmentAuditRepository.save(new AppointmentAudit(updated, "CANCELLED", performedBy, request.getReason()));

        sendCancellationNotification(updated, request.getReason());

        return AppointmentMapper.toResponse(updated);
    }

    @Transactional
    public AppointmentResponse updateStatus(Long appointmentId, UpdateAppointmentStatusRequest request) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppointmentNotFoundException(appointmentId));

        AppointmentStatusCode targetStatus = parseStatus(request.getStatus());
        AppointmentStatusCode currentStatus = appointment.getStatus().getCode();

        validateStatusTransition(appointment, targetStatus, request.getRequesterRole(), request.getRequesterId());

        AppointmentStatus status = appointmentStatusService.getStatus(targetStatus);
        appointment.setStatus(status);
        if (targetStatus != AppointmentStatusCode.CANCELLED) {
            appointment.setCancelledReason(null);
        }
        if (request.getNotes() != null && !request.getNotes().isBlank()) {
            appointment.setNotes(request.getNotes());
        }

        Appointment updated = appointmentRepository.save(appointment);

        String performedBy = buildPerformer(request.getRequesterRole(), request.getRequesterId());
        appointmentAuditRepository.save(new AppointmentAudit(updated, "STATUS_" + targetStatus.name(), performedBy, request.getNotes()));

        sendStatusChangeNotification(updated, targetStatus);

        return AppointmentMapper.toResponse(updated);
    }

    @Transactional(readOnly = true)
    public AppointmentResponse getAppointment(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppointmentNotFoundException(appointmentId));
        return AppointmentMapper.toResponse(appointment);
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponse> getAppointmentsByPatient(Long patientId) {
        return appointmentRepository.findAllByPatientId(patientId).stream()
                .map(AppointmentMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponse> getAppointmentsByDoctor(Long doctorId) {
        return appointmentRepository.findAllByDoctorId(doctorId).stream()
                .map(AppointmentMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponse> getAllAppointments() {
        return appointmentRepository.findAll().stream()
                .map(AppointmentMapper::toResponse)
                .toList();
    }

    private void ensureNoConflict(Long doctorId, LocalDateTime appointmentTime) {
        if (appointmentRepository.existsByDoctorIdAndAppointmentTime(doctorId, appointmentTime)) {
            throw new AppointmentConflictException(doctorId, appointmentTime.toString());
        }
    }

    private void ensureCancellationWindow(LocalDateTime appointmentTime, RequesterRole requesterRole) {
        int cutoffHours = appointmentProperties.getCancellationCutoffHours();
        if (requesterRole == RequesterRole.ADMIN || requesterRole == RequesterRole.SYSTEM) {
            return;
        }
        LocalDateTime deadline = appointmentTime.minusHours(cutoffHours);
        if (LocalDateTime.now(clock).isAfter(deadline)) {
            throw new CancellationNotAllowedException("Cancellations must be requested at least " + cutoffHours + " hours before the appointment time");
        }
    }

    private void validateRequesterForAppointment(Appointment appointment, Long requesterId, RequesterRole role) {
        if (role == RequesterRole.PATIENT && !Objects.equals(appointment.getPatientId(), requesterId)) {
            throw new UnauthorizedActionException("Patient cannot modify another patient's appointment");
        }
        if (role == RequesterRole.DOCTOR && !Objects.equals(appointment.getDoctorId(), requesterId)) {
            throw new UnauthorizedActionException("Doctor cannot modify another doctor's appointment");
        }
    }

    private void validateStatusTransition(Appointment appointment,
                                          AppointmentStatusCode targetStatus,
                                          RequesterRole requesterRole,
                                          Long requesterId) {
        AppointmentStatusCode currentStatus = appointment.getStatus().getCode();

        if (currentStatus == targetStatus) {
            throw new InvalidAppointmentStateException(appointment.getId(), currentStatus, targetStatus);
        }

        switch (targetStatus) {
            case CONFIRMED -> {
                ensureRoleIsDoctorOrAdmin(appointment, requesterRole, requesterId);
                if (currentStatus != AppointmentStatusCode.PENDING) {
                    throw new InvalidAppointmentStateException(appointment.getId(), currentStatus, targetStatus);
                }
            }
            case CANCELLED -> {
                validateRequesterForAppointment(appointment, requesterId, requesterRole);
                if (currentStatus == AppointmentStatusCode.COMPLETED) {
                    throw new InvalidAppointmentStateException(appointment.getId(), currentStatus, targetStatus);
                }
                ensureCancellationWindow(appointment.getAppointmentTime(), requesterRole);
            }
            case COMPLETED -> {
                ensureRoleIsDoctorOrAdmin(appointment, requesterRole, requesterId);
                if (currentStatus != AppointmentStatusCode.CONFIRMED) {
                    throw new InvalidAppointmentStateException(appointment.getId(), currentStatus, targetStatus);
                }
            }
            case PENDING -> throw new InvalidAppointmentStateException(appointment.getId(), currentStatus, targetStatus);
        }
    }

    private void ensureRoleIsDoctorOrAdmin(Appointment appointment, RequesterRole role, Long requesterId) {
        if (role == RequesterRole.DOCTOR && Objects.equals(appointment.getDoctorId(), requesterId)) {
            return;
        }
        if (role == RequesterRole.ADMIN || role == RequesterRole.SYSTEM) {
            return;
        }
        throw new UnauthorizedActionException("Only the owning doctor or admin can perform this action");
    }

    private AppointmentStatusCode parseStatus(String status) {
        try {
            return AppointmentStatusCode.valueOf(status.toUpperCase(Locale.US));
        } catch (IllegalArgumentException ex) {
            throw new UnsupportedAppointmentStatusException(status);
        }
    }

    private void sendCreationNotification(Appointment appointment) {
        String subject = "Appointment request received";
        String status = appointment.getStatus().getCode().name();
        String time = formatTime(appointment.getAppointmentTime());

        String message = status.equals(AppointmentStatusCode.CONFIRMED.name())
                ? "Your appointment on %s has been confirmed."
                : "Your appointment on %s has been received and is pending confirmation.";

        NotificationRequest notification = new NotificationRequest(
                appointment.getPatientId(),
                appointment.getDoctorId(),
                appointment.getId(),
                subject,
                message.formatted(time),
                "EMAIL"
        );
        dispatchNotification("creation", notification);
    }

    private void sendCancellationNotification(Appointment appointment, String reason) {
        String message = "Appointment on %s has been cancelled.".formatted(formatTime(appointment.getAppointmentTime()));
        if (reason != null && !reason.isBlank()) {
            message = message + " Reason: " + reason;
        }
        NotificationRequest notification = new NotificationRequest(
                appointment.getPatientId(),
                appointment.getDoctorId(),
                appointment.getId(),
                "Appointment cancelled",
                message,
                "EMAIL"
        );
        dispatchNotification("cancellation", notification);
    }

    private void sendStatusChangeNotification(Appointment appointment, AppointmentStatusCode status) {
        String subject = "Appointment status updated";
        String message = switch (status) {
            case CONFIRMED -> "Your appointment on %s has been confirmed by the doctor."
                    .formatted(formatTime(appointment.getAppointmentTime()));
            case COMPLETED -> "Appointment on %s has been marked as completed."
                    .formatted(formatTime(appointment.getAppointmentTime()));
            case CANCELLED -> "Appointment on %s has been cancelled."
                    .formatted(formatTime(appointment.getAppointmentTime()));
            case PENDING -> "Appointment on %s is pending confirmation."
                    .formatted(formatTime(appointment.getAppointmentTime()));
        };

        NotificationRequest notification = new NotificationRequest(
                appointment.getPatientId(),
                appointment.getDoctorId(),
                appointment.getId(),
                subject,
                message,
                "EMAIL"
        );
        dispatchNotification("status change", notification);
    }

    private String formatTime(LocalDateTime time) {
        return MESSAGE_TIME_FORMATTER.format(time);
    }

    private void dispatchNotification(String context, NotificationRequest notification) {
        try {
            notificationServiceClient.sendNotification(notification);
        } catch (RuntimeException ex) {
            log.warn("Failed to send {} notification for appointmentId={}, patientId={}, doctorId={}",
                    context,
                    notification.appointmentId(),
                    notification.patientId(),
                    notification.doctorId(),
                    ex);
        }
    }

    private String buildPerformer(RequesterRole role, Long id) {
        return role.name() + "_" + id;
    }
}
