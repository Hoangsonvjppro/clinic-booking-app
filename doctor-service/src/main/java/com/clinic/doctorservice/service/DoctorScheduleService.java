package com.clinic.doctorservice.service;

import com.clinic.doctorservice.dto.ScheduleRequest;
import com.clinic.doctorservice.exception.ApplicationException;
import com.clinic.doctorservice.model.Doctor;
import com.clinic.doctorservice.model.DoctorSchedule;
import com.clinic.doctorservice.repository.DoctorRepository;
import com.clinic.doctorservice.repository.DoctorScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorScheduleService {

    private final DoctorScheduleRepository doctorScheduleRepository;
    private final DoctorRepository doctorRepository;

    @Transactional
    public List<DoctorSchedule> updateSchedules(UUID userId, List<ScheduleRequest> requests) {
        Doctor doctor = doctorRepository.findByUserId(userId)
                .orElseThrow(() -> new ApplicationException("Doctor not found for user id: " + userId));

        validateSchedules(requests);

        // Delete existing schedules
        List<DoctorSchedule> existingSchedules = doctorScheduleRepository.findByDoctorId(doctor.getId());
        doctorScheduleRepository.deleteAll(existingSchedules);

        // Create new schedules
        List<DoctorSchedule> newSchedules = requests.stream()
                .map(request -> DoctorSchedule.builder()
                        .doctor(doctor)
                        .dayOfWeek(request.getDayOfWeek())
                        .startTime(request.getStartTime())
                        .endTime(request.getEndTime())
                        .isAvailable(true)
                        .build())
                .collect(Collectors.toList());

        return doctorScheduleRepository.saveAll(newSchedules);
    }

    public List<DoctorSchedule> getSchedulesByDoctorId(UUID doctorId) {
        return doctorScheduleRepository.findByDoctorId(doctorId);
    }

    private void validateSchedules(List<ScheduleRequest> requests) {
        // Group by day
        Map<DayOfWeek, List<ScheduleRequest>> requestsByDay = requests.stream()
                .collect(Collectors.groupingBy(ScheduleRequest::getDayOfWeek));

        for (Map.Entry<DayOfWeek, List<ScheduleRequest>> entry : requestsByDay.entrySet()) {
            List<ScheduleRequest> dayRequests = entry.getValue();
            
            // Sort by start time
            dayRequests.sort(Comparator.comparing(ScheduleRequest::getStartTime));

            for (int i = 0; i < dayRequests.size(); i++) {
                ScheduleRequest current = dayRequests.get(i);

                // Validate start < end
                if (!current.getStartTime().isBefore(current.getEndTime())) {
                    throw new ApplicationException("Start time must be before end time for day: " + current.getDayOfWeek());
                }

                // Check overlap with next schedule
                if (i < dayRequests.size() - 1) {
                    ScheduleRequest next = dayRequests.get(i + 1);
                    if (current.getEndTime().isAfter(next.getStartTime())) {
                        throw new ApplicationException("Overlapping schedules detected for day: " + current.getDayOfWeek());
                    }
                }
            }
        }
    }
}
