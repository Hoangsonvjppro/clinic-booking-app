package com.clinic.appointmentservice.client;

import com.clinic.appointmentservice.client.dto.NotificationRequest;
import com.clinic.appointmentservice.config.ExternalServiceProperties;
import com.clinic.appointmentservice.exception.RemoteServiceException;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class NotificationServiceClient {

    private final RestTemplate restTemplate;
    private final ExternalServiceProperties properties;

    public NotificationServiceClient(RestTemplate restTemplate, ExternalServiceProperties properties) {
        this.restTemplate = restTemplate;
        this.properties = properties;
    }

    public void sendNotification(NotificationRequest request) {
        String baseUrl = properties.getNotificationService().getBaseUrl();
        if (baseUrl == null) {
            throw new RemoteServiceException("Notification service base URL is not configured");
        }

        String url = baseUrl + "/api/notifications";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<NotificationRequest> entity = new HttpEntity<>(request, headers);

        try {
            restTemplate.postForEntity(url, entity, Void.class);
        } catch (Exception ex) {
            throw new RemoteServiceException("Failed to send notification", ex);
        }
    }
}
