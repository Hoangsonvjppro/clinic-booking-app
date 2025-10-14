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

import java.util.Map;
import java.util.Optional;
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
                .map(this::validateExistingUser)
                .orElseGet(() -> registerNewUser(email, attributes));
    }

    @Transactional
    public void syncAccount(User user,
                            String provider,
                            String providerUserId,
                            OAuth2AccessToken accessToken,
                            OAuth2RefreshToken refreshToken) {
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

        oAuthAccountRepository.save(account);
    }

    private User validateExistingUser(User user) {
        if (!user.isEnabled()) {
            throw new OAuth2AuthenticationException(new OAuth2Error("user_disabled"),
                    "User account has been disabled");
        }
        return user;
    }

    private User registerNewUser(String email, Map<String, Object> attributes) {
        Role defaultRole = roleRepository.findByName(appProps.getOauth2DefaultRole())
                .orElseThrow(() -> new OAuth2AuthenticationException(new OAuth2Error("role_not_found"),
                        "Default role not found: " + appProps.getOauth2DefaultRole()));

        String fullName = Optional.ofNullable(attributes.get("name"))
                .map(Object::toString)
                .orElse(null);

        User user = User.builder()
                .email(email)
                .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                .fullName(fullName)
                .enabled(true)
                .roles(Set.of(defaultRole))
                .build();
        return userRepository.save(user);
    }
}
