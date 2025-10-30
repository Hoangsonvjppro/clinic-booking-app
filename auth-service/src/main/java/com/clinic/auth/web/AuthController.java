/*
 * AuthController là REST Controller trung tâm của hệ thống xác thực,
 * chịu trách nhiệm định nghĩa các endpoint liên quan đến quản lý người dùng và bảo mật:
 *
 *  - /register        → Đăng ký tài khoản mới
 *  - /login           → Đăng nhập, trả về cặp token (access + refresh)
 *  - /me              → Truy vấn thông tin người dùng hiện tại (dựa trên token JWT)
 *  - /refresh         → Làm mới token khi access token hết hạn
 *  - /logout          → Đăng xuất, thu hồi refresh token của người dùng
 *  - /change-password → Đổi mật khẩu cho người dùng đã đăng nhập
 *  - /forgot-password → Gửi email đặt lại mật khẩu
 *  - /reset-password  → Đặt lại mật khẩu bằng token từ email
 *
 * Controller này không xử lý logic nghiệp vụ trực tiếp, mà ủy quyền cho AuthService.
 * Mỗi endpoint đều có validation đầu vào (@Valid),
 * và phản hồi chuẩn RESTful dưới dạng ResponseEntity với mã trạng thái phù hợp.
 */
package com.clinic.auth.web;

import com.clinic.auth.model.User;                       // Thực thể người dùng
import com.clinic.auth.repo.UserRepository;              // Repository truy vấn người dùng
import com.clinic.auth.service.AuthService;              // Dịch vụ xác thực chính
import com.clinic.auth.service.UserAccountService;
import com.clinic.auth.web.dto.*;                        // Các DTO request/response
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.Valid;                         // Kiểm tra tính hợp lệ của dữ liệu đầu vào
import lombok.RequiredArgsConstructor;                   // Tự động sinh constructor cho các trường final
import org.springframework.http.ResponseEntity;           // Gói phản hồi HTTP
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal; // Lấy thông tin người dùng hiện tại
import org.springframework.web.bind.annotation.*;         // Annotation REST
import java.util.Map;                                     // Dùng để trả về phản hồi ngắn gọn
import java.net.URI;

@CrossOrigin("https://hoofed-alfonzo-conclusional.ngrok-free.dev")
@RestController // Đánh dấu lớp là REST Controller
@RequestMapping("/api/v1/auth") // Tiền tố chung cho tất cả endpoint
@RequiredArgsConstructor // Tự động inject AuthService, UserRepository
public class AuthController {

    private final AuthService authService; // Xử lý nghiệp vụ xác thực
    private final UserRepository userRepository; // Dự phòng thao tác với User (chủ yếu cho /me)
    private final UserAccountService userAccountService;

    /**
     * API: POST /register
     * Đăng ký tài khoản mới.
     *
     * @param request thông tin đăng ký (email, password, defaultRole)
     * @return HTTP 200 nếu đăng ký thành công
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request); // Gọi dịch vụ đăng ký
        return ResponseEntity.ok().build(); // Trả về HTTP 200 OK (không có body)
    }

    /**
     * API: POST /login
     * Đăng nhập người dùng, trả về access token và refresh token.
     *
     * @param request thông tin đăng nhập (email, password)
     * @return AuthResponse chứa accessToken, refreshToken, tokenType
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request)); // Trả về token
    }

    /**
     * API: GET /google
     * Khởi tạo luồng đăng nhập OAuth2 với Google.
     * Trả về phản hồi 302 để trình duyệt chuyển hướng tới endpoint OAuth2 mặc định của Spring Security.
     */
    @GetMapping("/google")
    public ResponseEntity<Void> redirectToGoogleOAuth() {
        return ResponseEntity.status(HttpStatus.FOUND)
                .location(URI.create("/oauth2/authorization/google"))
                .build();
    }

    /**
     * API: GET /me
     * Trả về thông tin người dùng hiện tại (dựa trên token JWT).
     *
     * @param user đối tượng User hiện tại được Spring Security inject
     * @return User đã xác thực
     */
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    @JsonIgnore
    public ResponseEntity<User> getCurrentUser(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(user);
    }

    /**
     * API: POST /refresh
     * Làm mới cặp token khi access token hết hạn.
     *
     * @param request chứa refreshToken hợp lệ
     * @return AuthResponse với accessToken và refreshToken mới
     */
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@Valid @RequestBody TokenRefreshRequest request) {
        return ResponseEntity.ok(authService.refreshToken(request));
    }

    /**
     * API: POST /logout
     * Đăng xuất người dùng hiện tại, thu hồi tất cả refresh token.
     *
     * @param user đối tượng User hiện tại
     * @return HTTP 200 OK
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@AuthenticationPrincipal User user) {
        authService.logout(user.getEmail());
        return ResponseEntity.ok().build();
    }

    /**
     * API: POST /change-password
     * Cho phép người dùng đã đăng nhập đổi mật khẩu của chính mình.
     *
     * @param user người dùng hiện tại (được inject từ JWT)
     * @param request DTO chứa mật khẩu hiện tại, mới, và xác nhận
     * @return HTTP 200 OK nếu đổi mật khẩu thành công
     */
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody ChangePasswordRequest request) {
        authService.changePassword(user.getEmail(), request);
        return ResponseEntity.ok().build();
    }

    /**
     * API: POST /forgot-password
     * Gửi email chứa đường dẫn đặt lại mật khẩu cho người dùng.
     * Dù email không tồn tại, hệ thống vẫn trả về phản hồi giống nhau để bảo mật.
     *
     * @param request DTO chứa email người dùng
     * @return Thông báo phản hồi chung
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.requestPasswordReset(request);
        return ResponseEntity.ok()
                .body(Map.of("message", "If an account exists with that email, you will receive password reset instructions"));
    }

    /**
     * API: POST /reset-password
     * Đặt lại mật khẩu bằng token hợp lệ (được gửi qua email).
     *
     * @param request DTO chứa token, mật khẩu mới và xác nhận
     * @return Thông báo đặt lại thành công
     */
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok()
                .body(Map.of("message", "Password has been reset successfully"));
    }

    @PutMapping("/users/{userId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUserStatus(
            @PathVariable("userId") Long userId,
            @Valid @RequestBody UpdateUserStatusRequest request
    ) {
        userAccountService.updateUserStatus(userId, request);
        return ResponseEntity.ok().build();
    }

}



