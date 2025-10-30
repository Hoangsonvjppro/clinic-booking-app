package com.clinic.auth.security.oauth;

import com.clinic.auth.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Optional;
import java.util.Optional;

/**
 * Customizes the default OAuth2 user service so that Google users are mapped to the local {@link User} entity.
 */
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final OAuthUserProcessor oAuthUserProcessor;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        if (!"google".equals(registrationId)) {
            throw new OAuth2AuthenticationException(new OAuth2Error("unsupported_provider"),
                    "Unsupported OAuth2 provider: " + registrationId);
        }

        Map<String, Object> attributes = oAuth2User.getAttributes();
        String email = Optional.ofNullable(attributes.get("email"))
                .map(Object::toString)
                .orElseThrow(() -> new OAuth2AuthenticationException(new OAuth2Error("email_not_found"),
                        "Google account does not expose an email address"));

        String providerUserId = Optional.ofNullable(attributes.get("sub"))
                .map(Object::toString)
                .orElseThrow(() -> new OAuth2AuthenticationException(new OAuth2Error("provider_user_id_not_found"),
                        "Google response does not contain a subject identifier"));

        String userNameAttributeName = userRequest.getClientRegistration()
                .getProviderDetails()
                .getUserInfoEndpoint()
                .getUserNameAttributeName();

        User user = oAuthUserProcessor.ensureUser(email, attributes);
        oAuthUserProcessor.syncAccount(
                user,
                registrationId,
                providerUserId,
                userRequest.getAccessToken(),
                null,
                attributes
        );

        return new CustomOAuth2User(user, attributes, userNameAttributeName);
    }
}
