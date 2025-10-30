package com.clinic.auth.security.oauth;

import com.clinic.auth.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Collections;
import java.util.Map;

/**
 * Custom OAuth2 principal that keeps a reference to the local {@link User} entity
 * while still exposing the raw attributes returned by the provider.
 */
public class CustomOAuth2User implements OAuth2User {

    private final User user;
    private final Map<String, Object> attributes;
    private final String nameAttributeKey;

    public CustomOAuth2User(User user, Map<String, Object> attributes, String nameAttributeKey) {
        this.user = user;
        this.attributes = attributes != null ? Collections.unmodifiableMap(attributes) : Map.of();
        this.nameAttributeKey = nameAttributeKey;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return user.getAuthorities();
    }

    @Override
    public String getName() {
        Object name = attributes.get(nameAttributeKey);
        return name != null ? String.valueOf(name) : user.getEmail();
    }

    public User getUser() {
        return user;
    }
}
