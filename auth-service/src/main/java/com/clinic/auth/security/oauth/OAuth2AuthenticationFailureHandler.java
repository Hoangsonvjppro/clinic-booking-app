package com.clinic.auth.security.oauth;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * Trả về phản hồi JSON khi đăng nhập OAuth2 thất bại.
 */
@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationFailureHandler implements AuthenticationFailureHandler {

    private final HttpCookieOAuth2AuthorizationRequestRepository authorizationRequestRepository;

    @Override
    public void onAuthenticationFailure(HttpServletRequest request,
                                        HttpServletResponse response,
                                        AuthenticationException exception) throws IOException, ServletException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        String message = exception.getMessage() == null ? "OAuth2 authentication failed" : exception.getMessage();
        response.getWriter().write("""
                {"error":"oauth_authentication_failed","message":"%s"}
                """.formatted(message.replace("\"", "\\\"")));

        authorizationRequestRepository.removeAuthorizationRequestCookies(request, response);
    }
}
