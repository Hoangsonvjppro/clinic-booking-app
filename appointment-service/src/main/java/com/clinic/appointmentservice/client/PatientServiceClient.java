package com.clinic.appointmentservice.client;

import com.clinic.appointmentservice.client.dto.PatientProfile;
import com.clinic.appointmentservice.config.ExternalServiceProperties;
import com.clinic.appointmentservice.exception.PatientNotFoundException;
import com.clinic.appointmentservice.exception.RemoteServiceException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

@Component
public class PatientServiceClient {

    private final RestTemplate restTemplate;
    private final ExternalServiceProperties properties;

    public PatientServiceClient(RestTemplate restTemplate, ExternalServiceProperties properties) {
        this.restTemplate = restTemplate;
        this.properties = properties;
    }

    public PatientProfile getPatient(Long patientId) {
        String baseUrl = properties.getPatientService().getBaseUrl();
        if (baseUrl == null) {
            throw new RemoteServiceException("Patient service base URL is not configured");
        }

        String url = String.format("%s/api/patients/%d", baseUrl, patientId);

        try {
            PatientProfile profile = restTemplate.getForObject(url, PatientProfile.class);
            if (profile == null) {
                throw new RemoteServiceException("Patient service returned empty response for patientId=" + patientId);
            }
            return profile;
        } catch (HttpClientErrorException.NotFound ex) {
            throw new PatientNotFoundException(patientId);
        } catch (HttpClientErrorException ex) {
            if (ex.getStatusCode() == HttpStatus.LOCKED) {
                throw new RemoteServiceException("Patient account is locked");
            }
            throw new RemoteServiceException("Error calling patient service: " + ex.getMessage(), ex);
        } catch (Exception ex) {
            throw new RemoteServiceException("Patient service is unavailable", ex);
        }
    }
}
