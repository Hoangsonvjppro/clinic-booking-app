/*
 * Lớp cấu hình bảo mật trung tâm cho auth-service. Mục tiêu của lớp này là thiết lập chuỗi filter
 * của Spring Security theo hướng stateless: mọi yêu cầu đi vào sẽ đi qua bộ lọc JWT để trích xuất
 * và xác thực token, phiên (session) HTTP truyền thống bị vô hiệu hóa, và chỉ một số endpoint công
 * khai (đăng ký/đăng nhập, health check) mới được phép truy cập không cần xác thực. Ngoài ra, lớp
 * còn định nghĩa các bean cần thiết như PasswordEncoder, AuthenticationManager, DaoAuthenticationProvider
 * và CORS filter để kiểm soát nguồn gốc (origin) phía frontend.
 *
 * Triết lý ở đây là “API không trạng thái”: mỗi request tự mang theo bằng chứng (JWT) để chứng minh danh tính.
 * Cách tiếp cận này giúp dịch vụ dễ mở rộng theo chiều ngang (scale-out), tránh phụ thuộc vào session server-side
 * và tạo biên tách rõ ràng giữa các microservice.
 */
package com.clinic.auth.config;

import com.clinic.auth.security.JwtAuthenticationFilter; // Filter tự viết để đọc, kiểm tra và gắn Authentication từ JWT
import com.clinic.auth.security.oauth.CustomOAuth2UserService;
import com.clinic.auth.security.oauth.CustomOidcUserService;
import com.clinic.auth.security.oauth.HttpCookieOAuth2AuthorizationRequestRepository;
import com.clinic.auth.security.oauth.OAuth2AuthenticationFailureHandler;
import com.clinic.auth.security.oauth.OAuth2AuthenticationSuccessHandler;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor; // Tự sinh constructor cho các field final, phục vụ DI gọn gàng
import org.springframework.context.annotation.Bean; // Đánh dấu phương thức trả về bean cho Spring IoC
import org.springframework.context.annotation.Configuration; // Đánh dấu lớp cấu hình
import org.springframework.http.HttpMethod; // Hằng số HTTP method (GET/POST/...)
import org.springframework.security.authentication.AuthenticationManager; // Điểm điều phối quá trình xác thực
import org.springframework.web.cors.CorsConfigurationSource;

import org.springframework.security.authentication.dao.DaoAuthenticationProvider; // Provider xác thực dựa trên UserDetailsService + PasswordEncoder
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration; // Cung cấp AuthenticationManager mặc định
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity; // Bật @PreAuthorize/@PostAuthorize ở cấp method
import org.springframework.security.config.annotation.web.builders.HttpSecurity; // API cấu hình HTTP security
import org.springframework.security.config.http.SessionCreationPolicy; // Chính sách tạo session (STATELESS/STATEFUL)
import org.springframework.security.core.userdetails.UserDetailsService; // Hợp đồng cung cấp thông tin người dùng
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; // Thuật toán băm mật khẩu BCrypt
import org.springframework.security.crypto.password.PasswordEncoder; // Abstraction cho cơ chế mã hóa mật khẩu
import org.springframework.security.web.SecurityFilterChain; // Đại diện chuỗi filter cuối cùng
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter; // Vị trí chuẩn để chèn filter JWT trước bước xác thực form
import org.springframework.web.cors.CorsConfiguration; // Cấu hình CORS
import org.springframework.web.cors.UrlBasedCorsConfigurationSource; // Ánh xạ đường dẫn -> cấu hình CORS
import org.springframework.web.filter.CorsFilter; // Filter thực thi CORS

import java.util.Arrays; // Tiện ích tạo danh sách phương thức cho CORS
import java.util.List; // Danh sách origin/header cho CORS

@Configuration // Cho Spring biết đây là lớp cấu hình
@EnableMethodSecurity(prePostEnabled = true) // Kích hoạt bảo mật ở cấp method (ví dụ @PreAuthorize)
@RequiredArgsConstructor // Sinh constructor nhận vào các field final bên dưới
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter; // Bộ lọc đọc/kiểm tra JWT và gắn Authentication vào SecurityContext
    private final UserDetailsService userDetailsService; // Nguồn dữ liệu người dùng (tải bởi username) cho quá trình xác thực
    private final AppProps appProps; // Cấu hình ứng dụng (nguồn origin CORS, v.v.)

    /**
     * Định nghĩa chuỗi filter của Spring Security cho ứng dụng. Cấu hình này tắt CSRF vì ta chạy REST stateless,
     * buộc chính sách phiên là STATELESS, nới lỏng truy cập cho các endpoint công khai và chèn JwtAuthenticationFilter
     * trước UsernamePasswordAuthenticationFilter để ưu tiên xác thực bằng JWT cho mọi request.
     *
     * Pseudocode (rút gọn):
     * <pre>
     *   http.csrf.disable()
     *       .sessionManagement(STATELESS)
     *       .authorizeHttpRequests:
     *           - permit /api/v1/auth/**
     *           - permit GET /actuator/health
     *           - require auth cho mọi request khác
     *       .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter)
     *   return http.build()
     * </pre>
     */
    @Bean // Expose SecurityFilterChain cho Spring sử dụng
    public SecurityFilterChain filterChain(
            HttpSecurity http,
            CustomOAuth2UserService customOAuth2UserService,
            OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler,
            OAuth2AuthenticationFailureHandler oAuth2AuthenticationFailureHandler,
            HttpCookieOAuth2AuthorizationRequestRepository authorizationRequestRepository,
            CustomOidcUserService customOidcUserService
    ) throws Exception {
        http
                // 1️⃣ Tắt CSRF vì REST API là stateless
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(request -> {
                CorsConfiguration cfg = new CorsConfiguration();
                cfg.setAllowedOrigins(Arrays.asList("http://localhost:5173", "http://localhost:3000")); // Cho phép Frontend gọi vào
                cfg.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                cfg.setAllowedHeaders(Arrays.asList("*"));
                cfg.setAllowCredentials(true);
                return cfg;
                }))
        
                // 2️⃣ Bảo đảm không tạo session (hoặc có)
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // 3️⃣ Quy tắc phân quyền endpoint
                .authorizeHttpRequests(auth -> auth
                        // Các endpoint public (không cần token)
                        .requestMatchers(
                                "/api/v1/auth/register",
                                "/api/v1/auth/login",
                                "/api/v1/auth/refresh",
                                "/api/v1/auth/google",
                                "/api/v1/auth/forgot-password",
                                "/api/v1/auth/reset-password",
                                "/oauth2/authorization/**",
                                "/login/oauth2/**"
                        ).permitAll()
                        .requestMatchers(HttpMethod.GET, "/actuator/health").permitAll()
                        .requestMatchers(HttpMethod.GET, "/actuator/prometheus").permitAll()
                        // Mọi request khác đều yêu cầu xác thực
                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth -> oauth
                        .authorizationEndpoint(authorization -> authorization
                                .authorizationRequestRepository(authorizationRequestRepository)
                        )
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(customOAuth2UserService)
                                .oidcUserService(customOidcUserService)
                        )
                        .successHandler(oAuth2AuthenticationSuccessHandler)
                        .failureHandler(oAuth2AuthenticationFailureHandler)
                )
                /**
                 🧠 Giải thích:
                 401 (Unauthorized): người dùng chưa xác thực thành công (ví dụ: sai username/password).
                 403 (Forbidden): người dùng đã xác thực nhưng thiếu quyền để truy cập endpoint.
                 Mặc định, nếu không có authenticationEntryPoint, Spring sẽ trả 403 cho mọi lỗi security → gây nhầm lẫn khi test login.

                 ⚙️ Kiểm tra lại flow Login:
                 Khi gọi /api/v1/auth/login với mật khẩu đúng → trả 200, sinh JWT.
                 Khi gọi mật khẩu sai → BadCredentialsException → authenticationEntryPoint → 401 Unauthorized.
                 Khi gọi API yêu cầu quyền cao hơn (vd. /api/v1/admin/...) với token user thường → 403 Forbidden.

                 👉 Sau khi bạn thêm đoạn exceptionHandling này và build lại container (mvn clean package && docker compose up -d --build), hãy test lại Postman:
                 Sai mật khẩu → 401
                 Đúng mật khẩu → 200
                 Token không đủ quyền → 403

                 */
                .exceptionHandling(ex -> ex
                        // Khi xác thực thất bại (ví dụ sai mật khẩu) → trả về 401
                        .authenticationEntryPoint((req, res, e) -> {
                            res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            res.setContentType("application/json");
                            res.getWriter().write("""
                    {"error":"unauthorized","message":"Thông tin đăng nhập không hợp lệ"}
                """);
                        })
                        // Khi người dùng đã đăng nhập nhưng không đủ quyền → 403
                        .accessDeniedHandler((req, res, e) -> {
                            res.setStatus(HttpServletResponse.SC_FORBIDDEN);
                            res.setContentType("application/json");
                            res.getWriter().write("""
                    {"error":"forbidden","message":"Bạn không có quyền truy cập tài nguyên này"}
                """);
                        })
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class); // Chèn filter JWT trước filter xác thực username/password

        return http.build(); // Kết xuất chuỗi filter hoàn chỉnh
    }

    /**
     * PasswordEncoder sử dụng BCrypt, một thuật toán “salted & adaptive” phù hợp để lưu trữ mật khẩu an toàn.
     * Có thể tinh chỉnh strength (work factor) nếu cần cân bằng giữa bảo mật và hiệu năng.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // Mặc định work factor hợp lý cho đa số trường hợp
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}

