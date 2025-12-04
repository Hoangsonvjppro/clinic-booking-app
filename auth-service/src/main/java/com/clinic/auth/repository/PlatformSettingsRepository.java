package com.clinic.auth.repository;

import com.clinic.auth.model.PlatformSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PlatformSettingsRepository extends JpaRepository<PlatformSettings, UUID> {
    Optional<PlatformSettings> findBySettingKey(String settingKey);
}
