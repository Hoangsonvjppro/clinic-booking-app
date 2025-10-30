package com.clinic.appointmentservice.client;

import com.clinic.appointmentservice.client.dto.DoctorAvailability;
import com.clinic.appointmentservice.config.ExternalServiceProperties;
import com.clinic.appointmentservice.exception.DoctorUnavailableException;
import com.clinic.appointmentservice.exception.RemoteServiceException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDateTime;

@Component
public class DoctorServiceClient {

    private final RestTemplate restTemplate;
    private final ExternalServiceProperties properties;

    public DoctorServiceClient(RestTemplate restTemplate, ExternalServiceProperties properties) {
        this.restTemplate = restTemplate;
        this.properties = properties;
    }

    public DoctorAvailability verifyAvailability(Long doctorId, LocalDateTime appointmentTime, Integer durationMinutes) {
        String baseUrl = properties.getDoctorService().getBaseUrl();
        if (baseUrl == null) {
            throw new RemoteServiceException("Doctor service base URL is not configured");
        }

        String url = UriComponentsBuilder
                .fromHttpUrl(baseUrl + "/api/doctors/{doctorId}/availability")
                .queryParam("appointmentTime", appointmentTime)
                .queryParam("durationMinutes", durationMinutes)
                .buildAndExpand(doctorId)
                .toUriString();

        try {
            DoctorAvailability availability = restTemplate.getForObject(url, DoctorAvailability.class);
            if (availability == null) {
                throw new RemoteServiceException("Doctor availability response is empty");
            }
            if (!availability.available()) {
                throw new DoctorUnavailableException(doctorId);
            }
            return availability;
        } catch (HttpClientErrorException.NotFound ex) {
            throw new DoctorUnavailableException(doctorId, "Doctor not found");
        } catch (HttpClientErrorException ex) {
            if (ex.getStatusCode() == HttpStatus.CONFLICT) {
                throw new DoctorUnavailableException(doctorId, "Doctor is not available at the requested time");
            }
            throw new RemoteServiceException("Error calling doctor service: " + ex.getMessage(), ex);
        } catch (Exception ex) {
            throw new RemoteServiceException("Doctor service is unavailable", ex);
        }
    }
}
