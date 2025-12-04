package com.clinic.auth.web;

import com.clinic.auth.model.PlatformSettings;
import com.clinic.auth.service.PlatformSettingsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/auth/settings")
public class PlatformSettingsController {

    private final PlatformSettingsService settingsService;

    public PlatformSettingsController(PlatformSettingsService settingsService) {
        this.settingsService = settingsService;
    }

    /**
     * Get all platform settings (public - for frontend to get commission rate)
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllSettings() {
        return ResponseEntity.ok(settingsService.getSettingsMap());
    }

    /**
     * Get all settings as list (admin view)
     */
    @GetMapping("/list")
    public ResponseEntity<List<PlatformSettings>> getAllSettingsList() {
        return ResponseEntity.ok(settingsService.getAllSettings());
    }

    /**
     * Get specific setting by key
     */
    @GetMapping("/{key}")
    public ResponseEntity<PlatformSettings> getSetting(@PathVariable String key) {
        return ResponseEntity.ok(settingsService.getSetting(key));
    }

    /**
     * Get commission rate specifically
     */
    @GetMapping("/commission-rate")
    public ResponseEntity<Map<String, Object>> getCommissionRate() {
        BigDecimal rate = settingsService.getCommissionRate();
        return ResponseEntity.ok(Map.of(
            "commissionRate", rate,
            "description", "Platform commission rate in percentage (%)"
        ));
    }

    /**
     * Update a single setting (admin only)
     */
    @PutMapping("/{key}")
    public ResponseEntity<PlatformSettings> updateSetting(
            @PathVariable String key,
            @RequestBody Map<String, String> body,
            @RequestHeader(value = "X-User-Id", required = false) String userId
    ) {
        String value = body.get("value");
        UUID updatedBy = userId != null ? UUID.fromString(userId) : null;
        return ResponseEntity.ok(settingsService.updateSetting(key, value, updatedBy));
    }

    /**
     * Update multiple settings at once (admin only)
     */
    @PutMapping
    public ResponseEntity<Map<String, String>> updateMultipleSettings(
            @RequestBody Map<String, String> settings,
            @RequestHeader(value = "X-User-Id", required = false) String userId
    ) {
        UUID updatedBy = userId != null ? UUID.fromString(userId) : null;
        settingsService.updateMultipleSettings(settings, updatedBy);
        return ResponseEntity.ok(Map.of("message", "Settings updated successfully"));
    }

    /**
     * Calculate service fee for a given consultation fee
     */
    @GetMapping("/calculate-fee")
    public ResponseEntity<Map<String, Object>> calculateFee(
            @RequestParam BigDecimal consultationFee
    ) {
        BigDecimal serviceFee = settingsService.calculateServiceFee(consultationFee);
        BigDecimal total = consultationFee.add(serviceFee);
        BigDecimal commissionRate = settingsService.getCommissionRate();
        
        return ResponseEntity.ok(Map.of(
            "consultationFee", consultationFee,
            "serviceFee", serviceFee,
            "commissionRate", commissionRate,
            "total", total
        ));
    }
}
