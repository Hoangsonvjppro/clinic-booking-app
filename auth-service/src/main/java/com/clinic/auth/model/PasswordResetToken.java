/*
 * Thực thể (Entity) PasswordResetToken đại diện cho bảng `password_reset_tokens` trong cơ sở dữ liệu,
 * chịu trách nhiệm lưu trữ các mã token được cấp cho người dùng khi họ yêu cầu đặt lại mật khẩu.
 * Mỗi bản ghi tương ứng với một yêu cầu reset, có liên kết một-một (hoặc nhiều) với User thông qua khóa ngoại.
 *
 * Token này có thời hạn nhất định (expiryDate) và chỉ được sử dụng một lần (cờ `used`). Hai phương thức
 * tiện ích isExpired() và isValid() giúp kiểm tra trạng thái của token một cách nhanh chóng: token hết hạn
 * hoặc đã dùng sẽ không còn hợp lệ. Cơ chế này đảm bảo an toàn cho quy trình khôi phục mật khẩu, tránh
 * việc tái sử dụng link cũ hoặc truy cập trái phép.
 */
package com.clinic.auth.model;

import jakarta.persistence.*; // Các annotation JPA cho entity, khóa chính, quan hệ, v.v.
import lombok.*; // Tự sinh getter, setter, builder, constructor
import java.time.Instant; // Lưu thời điểm hết hạn của token

@Entity // Đánh dấu lớp này là một thực thể JPA
@Table(name = "password_reset_tokens") // Liên kết với bảng "password_reset_tokens" trong database
@Getter @Setter // Lombok sinh tự động getter và setter
@NoArgsConstructor @AllArgsConstructor @Builder // Sinh constructor mặc định, đầy đủ và builder pattern
public class PasswordResetToken {

    @Id // Khóa chính
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Tự tăng giá trị ID theo DB
    private Long id; // Định danh duy nhất cho mỗi token

    @Column(nullable = false, unique = true) // Token là duy nhất và bắt buộc
    private String token; // Chuỗi mã dùng để xác thực yêu cầu đặt lại mật khẩu

    @ManyToOne // Mối quan hệ nhiều token có thể thuộc về một người dùng
    @JoinColumn(name = "user_id", nullable = false) // Khóa ngoại liên kết tới bảng users
    private User user; // Người dùng được gán token reset mật khẩu

    @Column(nullable = false) // Thời hạn hiệu lực của token (sau thời điểm này sẽ không hợp lệ)
    private Instant expiryDate;

    @Column(nullable = false) // Đánh dấu token đã được sử dụng hay chưa
    private boolean used = false;

    /**
     * Kiểm tra xem token đã hết hạn hay chưa.
     *
     * @return true nếu thời điểm hiện tại đã vượt quá thời hạn expiryDate.
     */
    public boolean isExpired() {
        return expiryDate.isBefore(Instant.now()); // So sánh thời điểm hết hạn với thời điểm hiện tại
    }

    /**
     * Kiểm tra token còn hợp lệ không (chưa dùng và chưa hết hạn).
     *
     * @return true nếu token vẫn có thể sử dụng để reset mật khẩu.
     */
    public boolean isValid() {
        return !used && !isExpired(); // Hợp lệ khi chưa dùng và chưa hết hạn
    }
}
