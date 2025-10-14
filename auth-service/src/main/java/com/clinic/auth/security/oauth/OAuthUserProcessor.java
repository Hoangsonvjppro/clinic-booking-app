package com.clinic.auth.security.oauth;

import com.clinic.auth.config.AppProps;
import com.clinic.auth.model.OAuthAccount;
import com.clinic.auth.model.Role;
import com.clinic.auth.model.User;
import com.clinic.auth.repo.OAuthAccountRepository;
import com.clinic.auth.repo.RoleRepository;
import com.clinic.auth.repo.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2RefreshToken;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class OAuthUserProcessor {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final OAuthAccountRepository oAuthAccountRepository;
    private final PasswordEncoder passwordEncoder;
    private final AppProps appProps;

    @Transactional
    public User ensureUser(String email, Map<String, Object> attributes) {
        if (email == null || email.isBlank()) {
            throw new OAuth2AuthenticationException(new OAuth2Error("email_not_found"),
                    "Google account does not expose an email address");
        }
        return userRepository.findByEmail(email)
                .map(existing -> updateExistingUser(existing, attributes))
                .orElseGet(() -> registerNewUser(email, attributes));
    }

    @Transactional
    public void syncAccount(User user,
                            String provider,
                            String providerUserId,
                            OAuth2AccessToken accessToken,
                            OAuth2RefreshToken refreshToken,
                            Map<String, Object> attributes) {
        OAuthAccount account = oAuthAccountRepository
                .findByProviderAndProviderUserId(provider, providerUserId)
                .orElseGet(() -> OAuthAccount.builder()
                        .provider(provider)
                        .providerUserId(providerUserId)
                        .build());

        account.setUser(user);
        if (accessToken != null) {
            account.setAccessToken(accessToken.getTokenValue());
            account.setTokenExpiresAt(accessToken.getExpiresAt());
        }
        account.setRefreshToken(refreshToken != null ? refreshToken.getTokenValue() : null);

        if (attributes != null) {
            account.setFullName(valueAsString(attributes.get("name")));
            account.setGivenName(valueAsString(attributes.get("given_name")));
            account.setFamilyName(valueAsString(attributes.get("family_name")));
            account.setEmail(valueAsString(attributes.getOrDefault("email", user.getEmail())));
            account.setPictureUrl(valueAsString(attributes.get("picture")));
            account.setLocale(valueAsString(attributes.get("locale")));
            account.setProfile(new LinkedHashMap<>(attributes));
        } else {
            account.setEmail(user.getEmail());
        }

        oAuthAccountRepository.save(account);
    }

    private User updateExistingUser(User user, Map<String, Object> attributes) {
        if (!user.isEnabled()) {
            throw new OAuth2AuthenticationException(new OAuth2Error("user_disabled"),
                    "User account has been disabled");
        }
        if (applyProfileToUser(user, attributes)) {
            return userRepository.save(user);
        }
        return user;
    }

    private User registerNewUser(String email, Map<String, Object> attributes) {
        Role defaultRole = roleRepository.findByName(appProps.getOauth2DefaultRole())
                .orElseThrow(() -> new OAuth2AuthenticationException(new OAuth2Error("role_not_found"),
                        "Default role not found: " + appProps.getOauth2DefaultRole()));

        User user = User.builder()
                .email(email)
                .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                .fullName(valueAsString(attributes != null ? attributes.get("name") : null))
                .enabled(true)
                .roles(Set.of(defaultRole))
                .build();
        applyProfileToUser(user, attributes);
        return userRepository.save(user);
    }

    private boolean applyProfileToUser(User user, Map<String, Object> attributes) {
        if (attributes == null) {
            return false;
        }
        boolean changed = false;
        String fullName = valueAsString(attributes.get("name"));
        if (fullName != null && !fullName.equals(user.getFullName())) {
            user.setFullName(fullName);
            changed = true;
        }
        Boolean emailVerified = parseBoolean(attributes, "email_verified");
        if (Boolean.TRUE.equals(emailVerified) && user.getEmailVerifiedAt() == null) {
            user.setEmailVerifiedAt(Instant.now());
            changed = true;
        }
        return changed;
    }

    private Boolean parseBoolean(Map<String, Object> attributes, String key) {
        if (attributes == null) {
            return null;
        }
        Object value = attributes.get(key);
        if (value instanceof Boolean bool) {
            return bool;
        }
        if (value instanceof String str) {
            if (str.isBlank()) return null;
            return Boolean.parseBoolean(str);
        }
        return null;
    }

    private String valueAsString(Object value) {
        if (value == null) {
            return null;
        }
        String str = value.toString();
        return str.isBlank() ? null : str;
    }
}
