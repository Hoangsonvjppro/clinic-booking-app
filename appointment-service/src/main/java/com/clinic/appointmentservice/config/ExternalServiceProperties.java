package com.clinic.appointmentservice.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "external-services")
public class ExternalServiceProperties {

    private ServiceConfig patientService = new ServiceConfig();
    private ServiceConfig doctorService = new ServiceConfig();
    private ServiceConfig notificationService = new ServiceConfig();

    public ServiceConfig getPatientService() {
        return patientService;
    }

    public ServiceConfig getDoctorService() {
        return doctorService;
    }

    public ServiceConfig getNotificationService() {
        return notificationService;
    }

    public static class ServiceConfig {
        private String baseUrl;

        public String getBaseUrl() {
            return baseUrl;
        }

        public void setBaseUrl(String baseUrl) {
            this.baseUrl = baseUrl;
        }
    }
}
