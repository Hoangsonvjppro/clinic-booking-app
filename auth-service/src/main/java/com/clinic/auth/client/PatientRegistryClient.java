package com.clinic.auth.client;

import com.clinic.auth.config.ExternalServiceProperties;
import com.clinic.auth.client.dto.PatientStatusUpdateRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.client.HttpClientErrorException.NotFound;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Component
public class PatientRegistryClient {

    private static final Logger log = LoggerFactory.getLogger(PatientRegistryClient.class);

    private final RestTemplate restTemplate;
    private final ExternalServiceProperties properties;

    public PatientRegistryClient(RestTemplate restTemplate, ExternalServiceProperties properties) {
        this.restTemplate = restTemplate;
        this.properties = properties;
    }

    /**
     * Đồng bộ trạng thái hoạt động của bệnh nhân với patient-service.
     * Nếu base URL chưa được cấu hình hoặc dịch vụ không phản hồi, phương thức chỉ ghi log
     * và không chặn luồng chính.
     */
    public void updatePatientStatus(PatientStatusUpdateRequest request) {
        String baseUrl = properties.getPatientService().getBaseUrl();
        if (!StringUtils.hasText(baseUrl)) {
            log.debug("Skip patient status sync because patient-service base URL is not configured");
            return;
        }

        String url = UriComponentsBuilder.fromHttpUrl(baseUrl)
                .path("/internal/patients/status")
                .toUriString();

        try {
            restTemplate.put(url, request);
        } catch (NotFound ex) {
            log.warn("Patient service returned 404 when updating status for email={}", request.email());
        } catch (RestClientException ex) {
            log.error("Failed to call patient-service to update status for email={}: {}", request.email(), ex.getMessage());
        }
    }
}

