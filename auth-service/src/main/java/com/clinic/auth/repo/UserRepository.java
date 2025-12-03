/*
 * Repository này quản lý các thao tác truy vấn và lưu trữ dữ liệu của bảng `users`.
 * Nó là cầu nối giữa tầng service và cơ sở dữ liệu, giúp thao tác với đối tượng User
 * mà không cần viết câu lệnh SQL thủ công. Spring Data JPA sẽ tự động sinh phần hiện thực
 * dựa trên tên phương thức.
 *
 * Hai phương thức tuỳ chỉnh được định nghĩa cho các tình huống phổ biến trong xác thực:
 *
 * - findByEmail(String email): tìm người dùng theo địa chỉ email, trả về Optional<User>.
 *   Dùng trong quá trình đăng nhập hoặc xác thực token JWT.
 *
 * - existsByEmail(String email): kiểm tra nhanh xem một email đã được đăng ký hay chưa.
 *   Dùng trong bước đăng ký để tránh trùng lặp tài khoản.
 *
 * Repository này kế thừa JpaRepository, nên tự động có sẵn toàn bộ các thao tác CRUD cơ bản:
 * save(), findAll(), findById(), deleteById(), v.v.
 */
package com.clinic.auth.repo;

import com.clinic.auth.model.User;
import com.clinic.auth.model.enums.AccountStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, java.util.UUID> {

    /**
     * Tìm người dùng theo địa chỉ email.
     */
    Optional<User> findByEmail(String email);

    /**
     * Kiểm tra xem địa chỉ email đã được đăng ký trong hệ thống hay chưa.
     */
    boolean existsByEmail(String email);
    
    /**
     * Find users by account status.
     */
    Page<User> findByAccountStatus(AccountStatus accountStatus, Pageable pageable);
    
    /**
     * Find users by role name.
     */
    @Query("SELECT u FROM User u JOIN u.roles r WHERE r.name = :roleName")
    Page<User> findByRoleName(@Param("roleName") String roleName, Pageable pageable);
    
    /**
     * Find users by role name and account status.
     */
    @Query("SELECT u FROM User u JOIN u.roles r WHERE r.name = :roleName AND u.accountStatus = :status")
    Page<User> findByRoleNameAndAccountStatus(
            @Param("roleName") String roleName, 
            @Param("status") AccountStatus status, 
            Pageable pageable);
}
