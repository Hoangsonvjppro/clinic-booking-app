package com.clinic.appointmentservice.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "appointment-service")
public class AppointmentProperties {

    /**
     * Minimum number of hours before the appointment start that cancellation is permitted.
     */
    private int cancellationCutoffHours = 24;

    public int getCancellationCutoffHours() {
        return cancellationCutoffHours;
    }

    public void setCancellationCutoffHours(int cancellationCutoffHours) {
        this.cancellationCutoffHours = cancellationCutoffHours;
    }
}
