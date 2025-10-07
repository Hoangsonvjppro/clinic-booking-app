/*
 * Lớp thực thể (Entity) RefreshToken ánh xạ tới bảng `refresh_tokens` trong cơ sở dữ liệu.
 * Mỗi bản ghi tương ứng với một mã refresh token được phát hành cho người dùng sau khi đăng nhập thành công.
 * Refresh token có nhiệm vụ cho phép người dùng lấy access token mới khi access token cũ hết hạn,
 * mà không cần nhập lại thông tin đăng nhập.
 *
 * Refresh token có thời hạn (expiryDate), có thể bị thu hồi (revoked), và được gắn với thời điểm phát hành (issuedAt).
 * Các phương thức isValid() và onPersist() giúp đảm bảo tính toàn vẹn của dữ liệu:
 * - isValid(): kiểm tra token còn hợp lệ (chưa bị thu hồi và chưa hết hạn).
 * - onPersist(): tự động điền thời gian phát hành khi token được lưu lần đầu tiên.
 *
 * Cấu trúc này giúp hệ thống duy trì an toàn xác thực nhiều phiên (multi-session) và cho phép quản lý
 * từng token riêng biệt (thu hồi, gia hạn, theo dõi hoạt động đăng nhập).
 */
package com.clinic.auth.model;

import jakarta.persistence.*; // Cung cấp các annotation JPA
import lombok.*; // Tự động sinh getter, setter, builder, constructor
import java.time.Instant; // Lưu thời gian phát hành và hết hạn token

@Entity // Đánh dấu đây là một entity JPA
@Table(name = "refresh_tokens") // Liên kết entity này với bảng refresh_tokens
@Getter @Setter // Lombok sinh sẵn getter/setter
@NoArgsConstructor @AllArgsConstructor @Builder // Sinh constructor mặc định, đầy đủ và builder pattern
public class RefreshToken {

    @Id // Khóa chính
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Tự động tăng ID theo DB
    private Long id; // Mã định danh duy nhất cho mỗi refresh token

    @Column(nullable = false, unique = true) // Token phải duy nhất và không được null
    private String token; // Chuỗi token (JWT hoặc random string) dùng để làm mới access token

    @ManyToOne // Nhiều refresh token có thể thuộc về một user
    @JoinColumn(name = "user_id", nullable = false) // Khóa ngoại liên kết với bảng user
    private User user; // Người dùng sở hữu token này

    @Column(nullable = false) // Thời điểm token hết hạn
    private Instant expiryDate;

    @Column(nullable = false) // Cờ xác định token đã bị thu hồi hay chưa
    private boolean revoked = false;

    @Column(nullable = false) // Thời điểm phát hành token
    private Instant issuedAt;

    /**
     * Kiểm tra xem refresh token có còn hợp lệ hay không.
     * Token hợp lệ khi chưa bị thu hồi và chưa hết hạn.
     *
     * @return true nếu token còn hợp lệ.
     */
    public boolean isValid() {
        return !revoked && expiryDate.isAfter(Instant.now()); // Token hợp lệ khi chưa revoked và chưa hết hạn
    }

    /**
     * Phương thức callback được gọi trước khi entity được lưu (persist) hoặc cập nhật (update).
     * Dùng để tự động đặt giá trị issuedAt nếu chưa có, đảm bảo mọi token đều có thời điểm phát hành.
     */
    @PrePersist
    @PreUpdate
    protected void onPersist() {
        if (this.issuedAt == null) {
            this.issuedAt = Instant.now(); // Gán thời gian phát hành nếu chưa có
        }
    }
}
