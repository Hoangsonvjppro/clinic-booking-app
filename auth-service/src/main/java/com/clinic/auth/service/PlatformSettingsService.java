package com.clinic.auth.service;

import com.clinic.auth.model.PlatformSettings;
import com.clinic.auth.repository.PlatformSettingsRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class PlatformSettingsService {

    private final PlatformSettingsRepository repository;

    // Setting keys constants
    public static final String COMMISSION_RATE = "commission_rate";
    public static final String MIN_COMMISSION_RATE = "min_commission_rate";
    public static final String MAX_COMMISSION_RATE = "max_commission_rate";
    public static final String DEFAULT_CONSULTATION_FEE = "default_consultation_fee";
    public static final String CURRENCY = "currency";

    public PlatformSettingsService(PlatformSettingsRepository repository) {
        this.repository = repository;
    }

    public List<PlatformSettings> getAllSettings() {
        return repository.findAll();
    }

    public Map<String, Object> getSettingsMap() {
        Map<String, Object> map = new HashMap<>();
        repository.findAll().forEach(s -> {
            // Try to parse numeric values
            try {
                if (s.getSettingKey().contains("rate") || s.getSettingKey().contains("fee")) {
                    map.put(s.getSettingKey(), new BigDecimal(s.getSettingValue()));
                } else {
                    map.put(s.getSettingKey(), s.getSettingValue());
                }
            } catch (NumberFormatException e) {
                map.put(s.getSettingKey(), s.getSettingValue());
            }
        });
        return map;
    }

    public PlatformSettings getSetting(String key) {
        return repository.findBySettingKey(key)
                .orElseThrow(() -> new RuntimeException("Setting not found: " + key));
    }

    public String getSettingValue(String key, String defaultValue) {
        return repository.findBySettingKey(key)
                .map(PlatformSettings::getSettingValue)
                .orElse(defaultValue);
    }

    public BigDecimal getCommissionRate() {
        String value = getSettingValue(COMMISSION_RATE, "10");
        return new BigDecimal(value);
    }

    public BigDecimal getDefaultConsultationFee() {
        String value = getSettingValue(DEFAULT_CONSULTATION_FEE, "300000");
        return new BigDecimal(value);
    }

    @Transactional
    public PlatformSettings updateSetting(String key, String value, UUID updatedBy) {
        PlatformSettings setting = repository.findBySettingKey(key)
                .orElseGet(() -> {
                    PlatformSettings newSetting = new PlatformSettings();
                    newSetting.setSettingKey(key);
                    return newSetting;
                });
        
        setting.setSettingValue(value);
        setting.setUpdatedBy(updatedBy);
        return repository.save(setting);
    }

    @Transactional
    public void updateMultipleSettings(Map<String, String> settings, UUID updatedBy) {
        settings.forEach((key, value) -> updateSetting(key, value, updatedBy));
    }

    /**
     * Calculate service fee based on consultation fee and commission rate
     */
    public BigDecimal calculateServiceFee(BigDecimal consultationFee) {
        BigDecimal commissionRate = getCommissionRate();
        return consultationFee.multiply(commissionRate).divide(BigDecimal.valueOf(100));
    }
}
