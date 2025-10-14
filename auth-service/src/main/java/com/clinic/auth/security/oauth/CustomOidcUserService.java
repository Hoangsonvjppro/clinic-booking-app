package com.clinic.auth.security.oauth;

import com.clinic.auth.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class CustomOidcUserService extends OidcUserService {

    private final OAuthUserProcessor oAuthUserProcessor;

    @Override
    @Transactional
    public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {
        OidcUser oidcUser = super.loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        if (!"google".equals(registrationId)) {
            throw new OAuth2AuthenticationException(new OAuth2Error("unsupported_provider"),
                    "Unsupported OAuth2 provider: " + registrationId);
        }

        Map<String, Object> attributes = oidcUser.getAttributes();
        String email = oidcUser.getEmail();
        if (email == null || email.isBlank()) {
            email = oidcUser.getPreferredUsername();
        }
        if (email == null || email.isBlank()) {
            email = oidcUser.getUserInfo() != null ? oidcUser.getUserInfo().getEmail() : null;
        }

        String providerUserId = oidcUser.getSubject();
        if (providerUserId == null || providerUserId.isBlank()) {
            throw new OAuth2AuthenticationException(new OAuth2Error("provider_user_id_not_found"),
                    "Google response does not contain a subject identifier");
        }

        User user = oAuthUserProcessor.ensureUser(email, attributes);
        oAuthUserProcessor.syncAccount(
                user,
                registrationId,
                providerUserId,
                userRequest.getAccessToken(),
                null
        );

        return oidcUser;
    }
}
