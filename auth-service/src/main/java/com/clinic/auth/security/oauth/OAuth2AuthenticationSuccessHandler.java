package com.clinic.auth.security.oauth;

import com.clinic.auth.config.AppProps;
import com.clinic.auth.model.User;
import com.clinic.auth.repo.UserRepository;
import com.clinic.auth.service.AuthService;
import com.clinic.auth.web.dto.AuthResponse;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

/**
 * Handles the post-authentication step of the OAuth2 login flow:
 *  - issue local JWT + refresh token pair
 *  - redirect về frontend với token trong URL parameters
 */
@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final AppProps appProps;
    private final HttpCookieOAuth2AuthorizationRequestRepository authorizationRequestRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        User user = resolveUser(authentication);
        if (user == null) {
            String errorRedirect = appProps.getOauth2FailureRedirect() + "?error=" +
                    URLEncoder.encode("Không thể đọc thông tin người dùng từ Google", StandardCharsets.UTF_8);
            authorizationRequestRepository.removeAuthorizationRequestCookies(request, response);
            response.sendRedirect(errorRedirect);
            return;
        }

        AuthResponse authResponse = authService.loginWithOAuth(user, "google");

        // Redirect về frontend với token trong URL
        String redirectUrl = appProps.getOauth2SuccessRedirect() +
                "?token=" + URLEncoder.encode(authResponse.getAccessToken(), StandardCharsets.UTF_8) +
                "&refreshToken=" + URLEncoder.encode(authResponse.getRefreshToken(), StandardCharsets.UTF_8);

        authorizationRequestRepository.removeAuthorizationRequestCookies(request, response);
        response.sendRedirect(redirectUrl);
    }

    private User resolveUser(Authentication authentication) {
        Object principal = authentication.getPrincipal();
        if (principal instanceof CustomOAuth2User custom) {
            return custom.getUser();
        }
        if (principal instanceof OAuth2User oauth2User) {
            String email = oauth2User.getAttribute("email");
            if (email == null || email.isBlank()) {
                email = authentication.getName();
            }
            if (email != null && !email.isBlank()) {
                return userRepository.findByEmail(email).orElse(null);
            }
        }
        return null;
    }
}
