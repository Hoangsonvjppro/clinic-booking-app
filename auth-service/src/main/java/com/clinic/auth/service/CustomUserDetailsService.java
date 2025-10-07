/*
 * Lớp CustomUserDetailsService hiện thực giao diện UserDetailsService của Spring Security,
 * chịu trách nhiệm tải thông tin người dùng từ cơ sở dữ liệu dựa trên tên đăng nhập (username).
 * Trong hệ thống này, username chính là địa chỉ email của người dùng.
 *
 * Khi một request cần xác thực (authentication) đi qua chuỗi filter của Spring Security,
 * framework sẽ gọi đến phương thức loadUserByUsername(...) để truy xuất dữ liệu người dùng.
 * Nếu tìm thấy, đối tượng User (đã triển khai UserDetails) sẽ được trả về và Spring tự động
 * kiểm tra mật khẩu, quyền hạn (authorities), trạng thái tài khoản, v.v.
 *
 * Nếu người dùng không tồn tại trong hệ thống, một ngoại lệ UsernameNotFoundException sẽ được ném ra,
 * dẫn đến phản hồi HTTP 401 (UNAUTHORIZED) ở tầng controller hoặc filter.
 */
package com.clinic.auth.service;

import com.clinic.auth.repo.UserRepository; // Repository truy xuất dữ liệu người dùng
import lombok.RequiredArgsConstructor; // Tự động sinh constructor cho trường final
import org.springframework.security.core.userdetails.UserDetails; // Giao diện mô tả thông tin người dùng
import org.springframework.security.core.userdetails.UserDetailsService; // Hợp đồng tải người dùng cho Spring Security
import org.springframework.security.core.userdetails.UsernameNotFoundException; // Ngoại lệ khi không tìm thấy user
import org.springframework.stereotype.Service; // Đăng ký bean dịch vụ cho Spring

@Service // Đánh dấu lớp là service để Spring quản lý
@RequiredArgsConstructor // Inject UserRepository qua constructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository; // Repository thao tác với bảng users

    /**
     * Tải thông tin người dùng dựa trên tên đăng nhập (username).
     * Trong hệ thống này, username được hiểu là email.
     *
     * @param username địa chỉ email của người dùng
     * @return đối tượng UserDetails nếu tìm thấy người dùng
     * @throws UsernameNotFoundException nếu không tồn tại người dùng có email tương ứng
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByEmail(username) // Truy vấn theo email
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username)); // Nếu không có -> ném lỗi
    }
}
