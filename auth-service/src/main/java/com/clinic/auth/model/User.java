/*
 * Lớp thực thể (Entity) User đại diện cho bảng `users` trong cơ sở dữ liệu, lưu trữ thông tin tài khoản người dùng
 * của hệ thống. Lớp này đồng thời hiện thực giao diện `UserDetails` của Spring Security, cho phép framework
 * sử dụng nó trực tiếp trong quy trình xác thực (authentication) và phân quyền (authorization).
 *
 * Mỗi người dùng có email duy nhất (được dùng làm username), mật khẩu đã mã hóa, trạng thái hoạt động (enabled)
 * và danh sách các vai trò (roles). Cấu trúc nhiều-nhiều giữa User và Role được ánh xạ thông qua bảng phụ `user_roles`.
 *
 * Thông qua việc triển khai `UserDetails`, Spring Security có thể dễ dàng kiểm tra quyền truy cập,
 * tự động gán các GrantedAuthority (ROLE_ADMIN, ROLE_DOCTOR, ROLE_PATIENT, …) cho người dùng.
 *
 * Các annotation kiểm tra dữ liệu đầu vào (@Email, @NotBlank, @Size) giúp đảm bảo tính hợp lệ của dữ liệu
 * trước khi ghi xuống cơ sở dữ liệu.
 */
package com.clinic.auth.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*; // Các annotation JPA như @Entity, @Id, @Column, @ManyToMany, ...
import jakarta.validation.constraints.Email; // Xác thực định dạng email
import jakarta.validation.constraints.NotBlank; // Không cho phép chuỗi trống/null
import jakarta.validation.constraints.Size; // Ràng buộc độ dài chuỗi
import lombok.*; // Sinh tự động getter/setter, constructor, builder pattern
import org.springframework.security.core.GrantedAuthority; // Đại diện cho quyền truy cập (authority)
import org.springframework.security.core.userdetails.UserDetails; // Hợp đồng của Spring Security cho đối tượng người dùng

import java.util.Collection; // Danh sách các quyền
import java.util.Set; // Bộ vai trò của người dùng
import java.util.stream.Collectors; // Chuyển đổi Set<Role> thành Set<GrantedAuthority>

@Entity // Đánh dấu lớp này là entity JPA
@Table(name = "users") // Ánh xạ với bảng "users"
@Getter @Setter // Lombok tự sinh getter/setter
@NoArgsConstructor @AllArgsConstructor @Builder // Lombok sinh constructor mặc định, đầy đủ và builder
public class User implements UserDetails { // Triển khai UserDetails để tích hợp Spring Security

    @Id // Khóa chính
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Tự tăng ID trong DB
    private Long id; // Mã định danh duy nhất cho người dùng

    @Column(name = "email", unique = true, nullable = false) // Email duy nhất và bắt buộc
    @NotBlank(message = "Email is required") // Không cho phép để trống
    @Email(message = "Invalid email format") // Kiểm tra định dạng email hợp lệ
    @Size(max = 255, message = "Email cannot exceed 255 characters") // Giới hạn độ dài tối đa 255 ký tự
    private String email; // Email người dùng, đồng thời là username đăng nhập

    @JsonIgnore
    @Column(name = "password_hash", nullable = false) // Bắt buộc phải có mật khẩu
    @NotBlank(message = "Password is required") // Không được để trống
    @Size(min = 8, max = 255, message = "Password must be between 8 and 255 characters") // Độ dài tối thiểu 8 ký tự
    private String password; // Mật khẩu được lưu ở dạng mã hóa (BCrypt)

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "phone")
    private String phone;

    @Column(name = "email_verified_at")
    private java.time.Instant emailVerifiedAt;

    @Column(name = "last_login_at")
    private java.time.Instant lastLoginAt;

    @Builder.Default
    private boolean enabled = true; // Trạng thái hoạt động của tài khoản (true = có thể đăng nhập)

    @Column(name = "created_at", updatable = false, insertable = false)
    private java.time.Instant createdAt;

    @Column(name = "updated_at", insertable = false)
    private java.time.Instant updatedAt;

    @ManyToMany(fetch = FetchType.EAGER) // Một user có thể có nhiều vai trò, load ngay khi lấy user
    @JoinTable(
            name = "user_roles", // Tên bảng trung gian ánh xạ giữa user và role
            joinColumns = @JoinColumn(name = "user_id"), // Khóa ngoại trỏ tới bảng users
            inverseJoinColumns = @JoinColumn(name = "role_id") // Khóa ngoại trỏ tới bảng roles
    )
    private Set<Role> roles; // Tập hợp vai trò mà người dùng được gán

    /**
     * Trả về danh sách quyền (GrantedAuthority) tương ứng với các vai trò của người dùng.
     * Mỗi vai trò sẽ được chuyển thành quyền có tiền tố “ROLE_”, ví dụ: ROLE_ADMIN, ROLE_DOCTOR.
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream() // Duyệt qua từng Role
                .map(r -> (GrantedAuthority) () -> "ROLE_" + r.getName()) // Tạo authority từ tên role
                .collect(Collectors.toSet()); // Gom thành tập hợp quyền
    }

    /**
     * Trả về username được dùng cho xác thực (ở đây chính là email).
     */
    @Override
    public String getUsername() {
        return email;
    }

    /**
     * Tài khoản luôn được coi là chưa hết hạn trong hệ thống này.
     */
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    /**
     * Tài khoản luôn được coi là không bị khóa.
     */
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    /**
     * Mật khẩu của tài khoản được coi là luôn còn hạn (chưa hết hạn).
     */
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    /**
     * Trả về trạng thái kích hoạt của tài khoản, xác định xem người dùng có được phép đăng nhập không.
     */
    @Override
    public boolean isEnabled() {
        return enabled;
    }
}
