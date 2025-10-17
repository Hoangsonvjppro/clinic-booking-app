package com.clinic.auth.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "external-services")
public class ExternalServiceProperties {

    private final ServiceConfig patientService = new ServiceConfig();

    public ServiceConfig getPatientService() {
        return patientService;
    }

    public static class ServiceConfig {
        /**
         * Base URL (protocol + host + port) của patient-service.
         */
        private String baseUrl;

        public String getBaseUrl() {
            return baseUrl;
        }

        public void setBaseUrl(String baseUrl) {
            this.baseUrl = baseUrl;
        }
    }
}

