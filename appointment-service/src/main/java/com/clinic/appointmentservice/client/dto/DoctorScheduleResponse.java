package com.clinic.appointmentservice.client.dto;

import java.time.DayOfWeek;
import java.time.LocalTime;

public record DoctorScheduleResponse(
    DayOfWeek dayOfWeek,
    LocalTime startTime,
    LocalTime endTime,
    Boolean isAvailable
) {}
