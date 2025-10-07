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

import com.clinic.auth.model.User; // Thực thể ánh xạ bảng users
import org.springframework.data.jpa.repository.JpaRepository; // Giao diện CRUD mặc định của Spring Data JPA

import java.util.Optional; // Kiểu trả về an toàn, tránh NullPointerException

public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Tìm người dùng theo địa chỉ email.
     *
     * @param email Địa chỉ email của người dùng
     * @return Optional chứa đối tượng User nếu tồn tại, ngược lại là rỗng
     */
    Optional<User> findByEmail(String email);

    /**
     * Kiểm tra xem địa chỉ email đã được đăng ký trong hệ thống hay chưa.
     *
     * @param email Địa chỉ email cần kiểm tra
     * @return true nếu email đã tồn tại, false nếu chưa
     */
    boolean existsByEmail(String email);
}
