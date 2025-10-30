/*
 * Dịch vụ xác thực trung tâm cho auth-service. Lớp này điều phối toàn bộ luồng đăng ký, đăng nhập,
 * cấp/đổi mới/thu hồi token, đăng xuất, đổi mật khẩu và quy trình đặt lại mật khẩu qua email. Mục tiêu
 * là gom mọi quy ước bảo mật (JWT, TTL, rotation refresh token, audit) về một nơi, để controller và
 * các lớp khác có thể gọi các API mức cao, không cần xử lý chi tiết.
 *
 * Kiến trúc tổng quát:
 *  - Đăng ký (register): kiểm tra trùng email, gán vai trò mặc định, mã hóa mật khẩu, lưu user, ghi audit.
 *  - Đăng nhập (login): xác thực thông tin, phát hành access token + refresh token (rotation), ghi audit.
 *  - Làm mới token (refreshToken): kiểm tra refresh token hợp lệ, phát hành cặp token mới (rotation).
 *  - Đăng xuất (logout): thu hồi toàn bộ refresh token của người dùng, ghi audit.
 *  - Đổi mật khẩu (changePassword): xác minh mật khẩu hiện tại, cập nhật mật khẩu, thu hồi refresh tokens, ghi audit.
 *  - Quên mật khẩu (requestPasswordReset → resetPassword): tạo token đặt lại mật khẩu, gửi email, xác nhận và đổi mật khẩu.
 *  - Dọn dẹp (cleanupExpiredTokens): xóa refresh/reset token đã hết hạn theo lịch.
 *
 * Lớp dùng @Transactional để đảm bảo tính nhất quán dữ liệu, AuditService để kích hoạt cơ chế ghi nhận sự kiện,
 * và tận dụng AppProps để đọc TTL/token, issuer, và các cấu hình cần thiết khác.
 */
package com.clinic.auth.service;

import com.clinic.auth.model.RefreshToken; // Thực thể refresh token
import com.clinic.auth.model.Role; // Thực thể vai trò
import com.clinic.auth.model.User; // Thực thể người dùng
import com.clinic.auth.repo.RefreshTokenRepository; // Repository cho refresh token
import com.clinic.auth.repo.RoleRepository; // Repository cho vai trò
import com.clinic.auth.repo.UserRepository; // Repository cho người dùng
import com.clinic.auth.security.JwtService; // Dịch vụ phát hành/xác thực JWT
import com.clinic.auth.web.dto.AuthResponse; // DTO phản hồi sau đăng nhập/refresh
import com.clinic.auth.web.dto.LoginRequest; // DTO yêu cầu đăng nhập
import com.clinic.auth.web.dto.RegisterRequest; // DTO yêu cầu đăng ký
import com.clinic.auth.web.dto.TokenRefreshRequest; // DTO yêu cầu refresh token
import com.clinic.auth.web.dto.ChangePasswordRequest; // DTO đổi mật khẩu
import com.clinic.auth.web.dto.ForgotPasswordRequest; // DTO yêu cầu đặt lại mật khẩu
import com.clinic.auth.web.dto.ResetPasswordRequest; // DTO thực hiện đặt lại mật khẩu
import com.clinic.auth.repo.PasswordResetTokenRepository; // Repository token đặt lại mật khẩu
import lombok.RequiredArgsConstructor; // Tự sinh constructor cho các field final
import org.springframework.scheduling.annotation.Scheduled; // Lập lịch dọn dẹp
import org.springframework.security.authentication.AuthenticationManager; // Xác thực đăng nhập
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken; // Token xác thực username/password
import org.springframework.security.crypto.password.PasswordEncoder; // Mã hóa mật khẩu
import org.springframework.stereotype.Service; // Đánh dấu service
import org.springframework.transaction.annotation.Transactional; // Quản lý giao dịch

import java.time.Instant; // Mốc thời gian
import java.util.List; // Danh sách
import java.util.Set; // Tập hợp
import org.springframework.http.HttpStatus; // Mã HTTP cho ApiException
import com.clinic.auth.exception.DuplicateResourceException; // Ngoại lệ trùng dữ liệu
import com.clinic.auth.exception.ResourceNotFoundException; // Ngoại lệ không tìm thấy
import com.clinic.auth.exception.ApiException; // Ngoại lệ API tổng quát
import com.clinic.auth.exception.InvalidCredentialsException; // Ngoại lệ thông tin đăng nhập sai
import com.clinic.auth.exception.InvalidTokenException; // Ngoại lệ token không hợp lệ
import com.clinic.auth.model.PasswordResetToken; // Thực thể token đặt lại mật khẩu
import java.util.UUID; // Sinh chuỗi ngẫu nhiên cho token

@Service // Đăng ký bean dịch vụ
@RequiredArgsConstructor // Inject các dependency final qua constructor
public class AuthService {

    private final AuthenticationManager authManager; // Thành phần xác thực đăng nhập
    private final PasswordEncoder passwordEncoder; // Mã hóa/so khớp mật khẩu
    private final UserRepository userRepo; // Truy cập dữ liệu người dùng
    private final RoleRepository roleRepo; // Truy cập dữ liệu vai trò
    private final RefreshTokenRepository refreshTokenRepo; // Truy cập refresh token
    private final PasswordResetTokenRepository resetTokenRepo; // Truy cập reset token
    private final JwtService jwtService; // Phát hành/xác thực JWT
    private final EmailService emailService; // Gửi email đặt lại mật khẩu
    private final AuditService auditService; // Ghi nhận sự kiện audit
    private final com.clinic.auth.config.AppProps appProps; // Cấu hình ứng dụng (TTL, issuer, URL, ...)

    /**
     * Đăng ký người dùng mới: chống trùng email, gán vai trò mặc định (USER nếu không truyền),
     * mã hóa mật khẩu và lưu vào DB. Ghi một bản audit mô tả sự kiện đăng ký thành công.
     *
     * Pseudocode ngắn:
     *  - if email đã tồn tại -> DUPLICATE_RESOURCE
     *  - lấy role theo defaultRole (hoặc USER)
     *  - build User(email, encodedPassword, roles)
     *  - save user
     *  - audit “USER_REGISTRATION”
     */
    @Transactional // Một giao dịch cho toàn bộ quá trình đăng ký
    public void register(RegisterRequest req) {
        if (userRepo.existsByEmail(req.getEmail())) { // Kiểm tra trùng email
            throw new DuplicateResourceException("Email already in use"); // 409 CONFLICT
        }

        String defaultRole = req.getDefaultRole() == null ? "USER" : req.getDefaultRole(); // Chọn role mặc định
        Role role = roleRepo.findByName(defaultRole) // Tìm role theo tên
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + defaultRole)); // 404 nếu không có

        User user = User.builder()
                .email(req.getEmail()) // Gán email
                .password(passwordEncoder.encode(req.getPassword())) // Mã hóa mật khẩu
                .roles(Set.of(role)) // Gán tập vai trò
                .enabled(true) // Kích hoạt tài khoản
                .build();
        userRepo.save(user); // Lưu người dùng mới

        auditService.logEvent(
                "USER_REGISTRATION",
                "USER",
                req.getEmail(),
                String.format("New user registered with role: %s", defaultRole)
        ); // Ghi audit chi tiết
    }

    /**
     * Xử lý đăng nhập: xác thực thông tin, tạo access token + refresh token (rotation),
     * ghi nhận audit thành công và trả về AuthResponse cho client.
     *
     * Pseudocode:
     *  - authenticate(email, password)
     *  - load user, lấy roles
     *  - access = jwtService.generateToken(...)
     *  - refresh = createRefreshToken(user)
     *  - audit “USER_LOGIN”
     *  - return AuthResponse(access, refresh)
     */
    @Transactional
    public AuthResponse login(LoginRequest req) {
        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()); // Tạo token xác thực form
        authManager.authenticate(authentication); // Ủy quyền cho AuthenticationManager xác thực

        User user = userRepo.findByEmail(req.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found")); // Lấy user đã tồn tại
        user.setLastLoginAt(Instant.now());
        userRepo.save(user);
        AuthResponse response = issueTokensForUser(user); // Phát hành cặp token JWT + refresh

        auditService.logEvent(
                "USER_LOGIN",
                "USER",
                user.getEmail(),
                "User logged in successfully"
        ); // Ghi audit đăng nhập

        return response;
    }

    /**
     * Phát hành cặp access/refresh token cho người dùng đã được xác thực.
     * Được tái sử dụng cho cả luồng đăng nhập truyền thống và OAuth2 (Google).
     */
    @Transactional
    public AuthResponse issueTokensForUser(User user) {
        List<String> roles = user.getRoles().stream().map(Role::getName).toList(); // Rút trích tên vai trò
        long accessTtl = appProps.getAccessTokenTtlMinutes() * 60; // TTL access token (giây)
        String accessToken = jwtService.generateToken(user.getEmail(), roles, accessTtl); // Phát hành access token
        RefreshToken refreshToken = createRefreshToken(user); // Rotation refresh token

        return AuthResponse.builder()
                .accessToken(accessToken) // JWT truy cập
                .tokenType("Bearer") // Kiểu token
                .refreshToken(refreshToken.getToken()) // Refresh token mới
                .build();
    }

    /**
     * Sau khi Google OAuth2 xác thực thành công, phương thức này phát hành token và ghi audit.
     */
    @Transactional
    public AuthResponse loginWithOAuth(User user, String provider) {
        user.setLastLoginAt(Instant.now());
        userRepo.save(user);
        AuthResponse response = issueTokensForUser(user);
        auditService.logEvent(
                "OAUTH_LOGIN",
                "USER",
                user.getEmail(),
                "User logged in via provider: " + provider
        );
        return response;
    }

    // Hàm kiểm tra độ phức tạp mật khẩu (chưa sử dụng trong luồng chính, để sẵn phục vụ chính sách bảo mật)
    private boolean isPasswordComplex(String password) {
        if (password == null) return false; // Null là không hợp lệ
        if (password.length() < 8 || password.length() > 16) return false; // Độ dài tối thiểu/tối đa
        boolean hasUpper = false, hasLower = false, hasDigit = false, hasSpecial = false; // Cờ kiểm tra thành phần
        for (char c : password.toCharArray()) { // Duyệt từng ký tự
            if (Character.isUpperCase(c)) hasUpper = true; // Có chữ hoa
            else if (Character.isLowerCase(c)) hasLower = true; // Có chữ thường
            else if (Character.isDigit(c)) hasDigit = true; // Có chữ số
            else if ("!@#$%^&*()-_=+[]{}|;:'\",.<>?/`~".indexOf(c) >= 0) hasSpecial = true; // Có ký tự đặc biệt
        }
        return hasUpper && hasLower && hasDigit && hasSpecial; // Tối thiểu 4 nhóm ký tự
    }

    /**
     * Tạo refresh token mới cho người dùng theo chiến lược rotation:
     * thu hồi toàn bộ token cũ và phát hành token mới có hạn dùng theo cấu hình.
     */
    @Transactional
    public RefreshToken createRefreshToken(User user) {
        // Revoke any existing refresh tokens for this user
        refreshTokenRepo.revokeAllUserTokens(user); // Thu hồi toàn bộ token đang hoạt động

        RefreshToken refreshToken = RefreshToken.builder()
                .user(user) // Gán chủ sở hữu token
                .token(UUID.randomUUID().toString()) // Sinh chuỗi token ngẫu nhiên
                .issuedAt(Instant.now()) // Thời điểm phát hành
                .expiryDate(Instant.now().plusSeconds(appProps.getRefreshTokenTtlDays() * 24 * 60 * 60)) // Hạn dùng
                .build();

        return refreshTokenRepo.save(refreshToken); // Lưu và trả về token mới
    }

    /**
     * Làm mới cặp token: xác thực refresh token, nếu hợp lệ thì phát hành access token mới
     * và xoay refresh token (rotation) để giảm nguy cơ bị lộ/đánh cắp token.
     *
     * Pseudocode:
     *  - load refreshToken by value
     *  - if invalid -> delete & throw
     *  - build new access token (from roles)
     *  - newRefresh = createRefreshToken(user)
     *  - return AuthResponse(access, newRefresh)
     */
    @Transactional
    public AuthResponse refreshToken(TokenRefreshRequest request) {
        RefreshToken refreshToken = refreshTokenRepo.findByToken(request.getRefreshToken())
                .orElseThrow(() -> new InvalidTokenException("Refresh token not found")); // Không tồn tại

        if (!refreshToken.isValid()) { // Hết hạn hoặc bị thu hồi
            refreshTokenRepo.delete(refreshToken); // Xóa token cũ để dọn dẹp
            throw new InvalidTokenException("Refresh token was expired or revoked"); // Báo lỗi client
        }

        User user = refreshToken.getUser(); // Chủ sở hữu token
        List<String> roles = user.getRoles().stream().map(Role::getName).toList(); // Rút trích vai trò

        // Generate new access token
        long accessTtl = appProps.getAccessTokenTtlMinutes() * 60; // TTL access token
        String accessToken = jwtService.generateToken(user.getEmail(), roles, accessTtl); // Phát hành access JWT

        // Generate new refresh token (rotation)
        RefreshToken newRefreshToken = createRefreshToken(user); // Thu hồi cũ + tạo mới

        return AuthResponse.builder()
                .accessToken(accessToken) // JWT truy cập mới
                .tokenType("Bearer")
                .refreshToken(newRefreshToken.getToken()) // Refresh token mới
                .build();
    }

    /**
     * Đăng xuất người dùng: thu hồi toàn bộ refresh token của người dùng này, ghi bản ghi audit mô tả hành động.
     */
    @Transactional
    public void logout(String userEmail) {
        User user = userRepo.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found")); // Không tồn tại
        refreshTokenRepo.revokeAllUserTokens(user); // Thu hồi toàn bộ refresh token

        auditService.logEvent(
                "USER_LOGOUT",
                "USER",
                userEmail,
                "User logged out and all refresh tokens revoked"
        ); // Ghi audit đăng xuất
    }

    /**
     * Đổi mật khẩu: xác nhận mật khẩu hiện tại, cập nhật mật khẩu mới (mã hóa), thu hồi refresh token,
     * và ghi audit thành công/thất bại. Nếu mật khẩu xác nhận không khớp, ném ApiException 400.
     */
    @Transactional
    public void changePassword(String userEmail, ChangePasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) { // Kiểm tra trùng khớp
            throw new ApiException("New passwords do not match", "PASSWORD_MISMATCH", HttpStatus.BAD_REQUEST); // 400
        }

        User user = userRepo.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found")); // 404

        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) { // Sai mật khẩu hiện tại
            auditService.logEvent(
                    "PASSWORD_CHANGE_FAILED",
                    "USER",
                    userEmail,
                    "Password change failed due to incorrect current password"
            ); // Ghi audit thất bại
            throw new InvalidCredentialsException("Current password is incorrect"); // 401
        }

        // Update password
        user.setPassword(passwordEncoder.encode(request.getNewPassword())); // Mã hóa và cập nhật
        userRepo.save(user); // Lưu thay đổi

        // Revoke all refresh tokens when password changes
        refreshTokenRepo.revokeAllUserTokens(user); // Thu hồi refresh tokens sau khi đổi mật khẩu

        auditService.logEvent(
                "PASSWORD_CHANGED",
                "USER",
                userEmail,
                "Password changed successfully"
        ); // Audit thành công
    }

    /**
     * Yêu cầu đặt lại mật khẩu: nếu người dùng tồn tại và chưa có token hợp lệ, tạo token mới (30 phút),
     * lưu vào DB và gửi email kèm đường link đặt lại mật khẩu đến địa chỉ đã đăng ký.
     */
    @Transactional
    public void requestPasswordReset(ForgotPasswordRequest request) {
        userRepo.findByEmail(request.getEmail()).ifPresent(user -> {
            resetTokenRepo.findByUserAndUsedFalseAndExpiryDateAfter(user, Instant.now())
                    .ifPresent(token -> {
                        throw new ApiException(
                                "A password reset request is already active",
                                "PASSWORD_RESET_PENDING",
                                HttpStatus.TOO_MANY_REQUESTS
                        ); // Ngan spam
                    });

            // Create new reset token
            String token = UUID.randomUUID().toString(); // Sinh ma token ng?u nhi?n
            PasswordResetToken resetToken = PasswordResetToken.builder()
                    .token(token)
                    .user(user)
                    .expiryDate(Instant.now().plusSeconds(1800)) // 30 minutes
                    .build();
            resetTokenRepo.save(resetToken); // Luu token

            // Send email with reset link
            String resetLink = appProps.getFrontendUrl() + "/reset-password?token=" + token; // T?o link cho FE
            emailService.sendPasswordResetEmail(user.getEmail(), resetLink); // G?i email hu?ng d?n
        });
    }

    /**
     * Đặt lại mật khẩu: xác thực token, kiểm tra hợp lệ, cập nhật mật khẩu mới (mã hóa),
     * đánh dấu token đã sử dụng và thu hồi toàn bộ refresh token của người dùng.
     */
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) { // Kiểm tra trùng khớp
            throw new ApiException("New passwords do not match", "PASSWORD_MISMATCH", HttpStatus.BAD_REQUEST); // 400
        }

        PasswordResetToken resetToken = resetTokenRepo.findByToken(request.getToken())
                .orElseThrow(() -> new InvalidTokenException("Invalid reset token")); // Token không tồn tại

        if (!resetToken.isValid()) { // Hết hạn hoặc đã dùng
            throw new InvalidTokenException("Reset token is expired or has been used"); // 401/400 tùy mapping
        }

        User user = resetToken.getUser(); // Lấy người dùng gắn với token
        user.setPassword(passwordEncoder.encode(request.getNewPassword())); // Đặt mật khẩu mới
        userRepo.save(user); // Lưu thay đổi

        // Mark token as used
        resetToken.setUsed(true);
        resetToken.setUsedAt(Instant.now()); // Đánh dấu đã dùng
        resetTokenRepo.save(resetToken); // Lưu trạng thái

        // Revoke all refresh tokens when password changes
        refreshTokenRepo.revokeAllUserTokens(user); // Thu hồi refresh token cũ để bảo mật
    }

    /**
     * Tác vụ dọn dẹp theo lịch (chạy mỗi 12 giờ): xóa refresh token và reset token đã hết hạn.
     * Giữ cho cơ sở dữ liệu gọn nhẹ và tránh tồn dư dữ liệu vô ích.
     */
    @Scheduled(cron = "0 0 */12 * * *") // Run every 12 hours
    @Transactional
    public void cleanupExpiredTokens() {
        refreshTokenRepo.deleteAllExpiredTokens(Instant.now()); // Xóa refresh token hết hạn
        resetTokenRepo.deleteAllExpiredTokens(Instant.now()); // Xóa reset token hết hạn
    }
}
