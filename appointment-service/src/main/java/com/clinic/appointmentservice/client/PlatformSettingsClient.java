package com.clinic.appointmentservice.client;

import com.clinic.appointmentservice.exception.RemoteServiceException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.Map;

@Component
public class PlatformSettingsClient {

    private static final Logger log = LoggerFactory.getLogger(PlatformSettingsClient.class);
    private static final BigDecimal DEFAULT_COMMISSION_RATE = BigDecimal.TEN; // 10%

    private final RestTemplate restTemplate;
    private final String authServiceUrl;

    public PlatformSettingsClient(RestTemplate restTemplate,
                                  @Value("${services.auth.url:http://localhost:8081}") String authServiceUrl) {
        this.restTemplate = restTemplate;
        this.authServiceUrl = authServiceUrl;
    }

    /**
     * Get current commission rate from platform settings
     */
    public BigDecimal getCommissionRate() {
        try {
            String url = authServiceUrl + "/api/v1/auth/settings/commission-rate";
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Object rate = response.getBody().get("commissionRate");
                if (rate != null) {
                    return new BigDecimal(rate.toString());
                }
            }
            log.warn("Could not get commission rate from auth service, using default: {}", DEFAULT_COMMISSION_RATE);
            return DEFAULT_COMMISSION_RATE;
        } catch (RestClientException e) {
            log.warn("Failed to get commission rate from auth service: {}. Using default: {}", 
                    e.getMessage(), DEFAULT_COMMISSION_RATE);
            return DEFAULT_COMMISSION_RATE;
        }
    }

    /**
     * Get all platform settings
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> getAllSettings() {
        try {
            String url = authServiceUrl + "/api/v1/auth/settings";
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody();
            }
            return Map.of("commission_rate", DEFAULT_COMMISSION_RATE);
        } catch (RestClientException e) {
            log.warn("Failed to get platform settings: {}", e.getMessage());
            return Map.of("commission_rate", DEFAULT_COMMISSION_RATE);
        }
    }

    /**
     * Calculate service fee based on consultation fee
     */
    public BigDecimal calculateServiceFee(BigDecimal consultationFee) {
        BigDecimal commissionRate = getCommissionRate();
        return consultationFee.multiply(commissionRate).divide(BigDecimal.valueOf(100));
    }
}
