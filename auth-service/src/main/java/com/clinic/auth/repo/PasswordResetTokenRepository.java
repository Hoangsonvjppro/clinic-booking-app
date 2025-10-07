/*
 * Repository này cung cấp các thao tác truy vấn dữ liệu (CRUD) cho bảng `password_reset_tokens`.
 * Đây là lớp trung gian giữa tầng service và cơ sở dữ liệu, cho phép truy xuất, tìm kiếm hoặc xóa
 * các token đặt lại mật khẩu mà không cần viết câu lệnh SQL thủ công.
 *
 * Các phương thức chính:
 *  - findByToken(): tìm một token cụ thể dựa trên chuỗi token.
 *  - findByUserAndUsedFalseAndExpiryDateAfter(): lấy token còn hiệu lực của một người dùng (chưa dùng, chưa hết hạn).
 *  - deleteAllExpiredTokens(): dọn dẹp các token đã hết hạn khỏi cơ sở dữ liệu để giảm dung lượng lưu trữ.
 *
 * Repository này kế thừa JpaRepository, vì vậy Spring Data JPA sẽ tự động sinh phần hiện thực (implementation)
 * dựa trên tên phương thức hoặc annotation @Query. Việc sử dụng Optional giúp xử lý an toàn với giá trị null.
 */
package com.clinic.auth.repo;

import com.clinic.auth.model.PasswordResetToken; // Thực thể ánh xạ bảng password_reset_tokens
import com.clinic.auth.model.User; // Người dùng sở hữu token
import org.springframework.data.jpa.repository.JpaRepository; // Cung cấp CRUD mặc định cho entity
import org.springframework.data.jpa.repository.Modifying; // Đánh dấu query có thay đổi dữ liệu (DELETE/UPDATE)
import org.springframework.data.jpa.repository.Query; // Cho phép viết câu lệnh JPQL tùy chỉnh

import java.time.Instant; // Mốc thời gian để so sánh hạn token
import java.util.Optional; // Gói kết quả có thể null một cách an toàn

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    /**
     * Tìm kiếm một token cụ thể dựa trên chuỗi token.
     *
     * @param token Chuỗi token cần tìm
     * @return Optional chứa PasswordResetToken nếu tồn tại, ngược lại là rỗng
     */
    Optional<PasswordResetToken> findByToken(String token);

    /**
     * Tìm token hợp lệ của người dùng (chưa được sử dụng và chưa hết hạn).
     *
     * @param user Người dùng cần kiểm tra
     * @param now  Thời điểm hiện tại (để so sánh với expiryDate)
     * @return Optional chứa token hợp lệ nếu có
     */
    Optional<PasswordResetToken> findByUserAndUsedFalseAndExpiryDateAfter(User user, Instant now);

    /**
     * Xóa tất cả token đã hết hạn khỏi cơ sở dữ liệu.
     * Annotation @Modifying cho biết đây là truy vấn ghi (DELETE).
     *
     * @param now Thời điểm hiện tại, mọi token có expiryDate nhỏ hơn giá trị này sẽ bị xóa
     */
    @Modifying
    @Query("DELETE FROM PasswordResetToken t WHERE t.expiryDate < :now")
    void deleteAllExpiredTokens(Instant now);
}
