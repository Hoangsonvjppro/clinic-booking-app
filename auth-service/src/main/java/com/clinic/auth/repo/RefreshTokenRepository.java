/*
 * Repository này cung cấp các phương thức thao tác với bảng `refresh_tokens` trong cơ sở dữ liệu.
 * RefreshTokenRepository đóng vai trò trung gian giữa tầng service và JPA, cho phép truy xuất,
 * thu hồi (revoke) hoặc dọn dẹp các token đã hết hạn mà không cần viết SQL thủ công.
 *
 * Trong hệ thống xác thực JWT, refresh token cho phép người dùng lấy access token mới sau khi token
 * cũ hết hạn mà không cần đăng nhập lại. Repository này giúp quản lý vòng đời của refresh token:
 * - Lưu trữ và truy xuất token theo chuỗi.
 * - Tìm tất cả token hợp lệ (chưa bị thu hồi) của một người dùng.
 * - Thu hồi toàn bộ token đang hoạt động của người dùng (khi đăng xuất hoặc bảo mật bị ảnh hưởng).
 * - Dọn dẹp token đã hết hạn để giữ cơ sở dữ liệu gọn nhẹ.
 *
 * Spring Data JPA sẽ tự động sinh phần hiện thực dựa trên quy ước đặt tên phương thức hoặc @Query.
 */
package com.clinic.auth.repo;

import com.clinic.auth.model.RefreshToken; // Thực thể ánh xạ bảng refresh_tokens
import com.clinic.auth.model.User; // Thực thể người dùng sở hữu token
import org.springframework.data.jpa.repository.JpaRepository; // Giao diện cơ sở cho CRUD
import org.springframework.data.jpa.repository.Modifying; // Đánh dấu truy vấn ghi (UPDATE/DELETE)
import org.springframework.data.jpa.repository.Query; // Cho phép định nghĩa câu JPQL tùy chỉnh

import java.time.Instant; // Mốc thời gian để so sánh hạn token
import java.util.List; // Danh sách kết quả trả về
import java.util.Optional; // Gói kết quả an toàn null

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    /**
     * Tìm một refresh token cụ thể bằng chuỗi token.
     *
     * @param token Chuỗi refresh token cần tìm.
     * @return Optional chứa RefreshToken nếu tồn tại, ngược lại là rỗng.
     */
    Optional<RefreshToken> findByToken(String token);

    /**
     * Lấy danh sách tất cả refresh token hợp lệ của một người dùng.
     * Phương thức này được đặt tên theo quy ước nhưng cần hiện thực thêm nếu muốn lọc cụ thể
     * (ví dụ: `r.revoked = false` và `r.expiryDate > now`).
     *
     * @param user Người dùng cần lấy token.
     * @return Danh sách token hợp lệ thuộc về người dùng.
     */
    List<RefreshToken> findAllValidTokenByUser(User user);

    /**
     * Thu hồi toàn bộ refresh token đang hoạt động (revoked=false) của một người dùng.
     * Dùng khi người dùng đăng xuất hoặc cần hủy phiên cũ.
     *
     * @param user Người dùng cần thu hồi token.
     */
    @Modifying
    @Query("UPDATE RefreshToken r SET r.revoked = true WHERE r.user = :user AND r.revoked = false")
    void revokeAllUserTokens(User user);

    /**
     * Xóa tất cả refresh token đã hết hạn khỏi cơ sở dữ liệu.
     * Giúp giảm dung lượng lưu trữ và loại bỏ dữ liệu cũ.
     *
     * @param now Thời điểm hiện tại; mọi token có expiryDate < now sẽ bị xóa.
     */
    @Modifying
    @Query("DELETE FROM RefreshToken r WHERE r.expiryDate < :now")
    void deleteAllExpiredTokens(Instant now);
}
