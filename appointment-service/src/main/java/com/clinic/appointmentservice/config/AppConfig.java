package com.clinic.appointmentservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Clock;

@Configuration
@org.springframework.boot.context.properties.EnableConfigurationProperties({AppointmentProperties.class, ExternalServiceProperties.class})
public class AppConfig {

    @Bean
    public Clock clock() {
        return Clock.systemUTC();
    }
}
