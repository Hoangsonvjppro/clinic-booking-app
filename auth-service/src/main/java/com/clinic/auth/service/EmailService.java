/*
 * Dịch vụ EmailService chịu trách nhiệm gửi các email hệ thống — trong đó quan trọng nhất là
 * email chứa liên kết đặt lại mật khẩu (password reset link) cho người dùng. Việc gửi email được
 * thực hiện không đồng bộ (@Async) nhằm tránh làm chậm phản hồi HTTP của API chính.
 *
 * Cơ chế hoạt động:
 *  1. Khi người dùng yêu cầu đặt lại mật khẩu, AuthService sẽ tạo một token reset và gọi hàm này.
 *  2. EmailService tạo đối tượng SimpleMailMessage với các thông tin cơ bản:
 *     - Người gửi (From): lấy từ cấu hình appProps.mailFrom.
 *     - Người nhận (To): địa chỉ email người dùng.
 *     - Tiêu đề (Subject): “Password Reset Request”.
 *     - Nội dung (Text): hướng dẫn cùng đường link chứa token đặt lại mật khẩu.
 *  3. Cuối cùng, JavaMailSender sẽ gửi email qua máy chủ SMTP đã cấu hình.
 *
 * Nếu việc gửi email thất bại, Spring sẽ ghi log lỗi; tuy nhiên ứng dụng chính vẫn tiếp tục chạy,
 * nhờ vào việc phương thức được chạy trên luồng riêng (@Async).
 */
package com.clinic.auth.service;

import lombok.RequiredArgsConstructor; // Tự sinh constructor cho các trường final
import org.springframework.mail.SimpleMailMessage; // Đối tượng email cơ bản (văn bản thuần)
import org.springframework.mail.javamail.JavaMailSender; // Thành phần gửi email qua SMTP
import org.springframework.scheduling.annotation.Async; // Đánh dấu chạy không đồng bộ
import org.springframework.stereotype.Service; // Đăng ký bean dịch vụ cho Spring

@Service // Cho phép Spring quản lý bean này
@RequiredArgsConstructor // Inject mailSender và appProps qua constructor
public class EmailService {

    private final JavaMailSender mailSender; // Thành phần gửi email thực tế (SMTP client)
    private final com.clinic.auth.config.AppProps appProps; // Cấu hình ứng dụng (địa chỉ gửi mail mặc định, v.v.)

    /**
     * Gửi email đặt lại mật khẩu cho người dùng. Phương thức này chạy bất đồng bộ để không
     * ảnh hưởng đến tốc độ phản hồi API.
     *
     * @param to        địa chỉ email người nhận
     * @param resetLink đường link chứa token để đặt lại mật khẩu
     */
    @Async
    public void sendPasswordResetEmail(String to, String resetLink) {
        // Tạo đối tượng email văn bản đơn giản
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(appProps.getMailFrom()); // Địa chỉ người gửi (lấy từ cấu hình)
        message.setTo(to); // Người nhận
        message.setSubject("Password Reset Request"); // Tiêu đề thư

        // Soạn nội dung thư với định dạng rõ ràng và có chèn link đặt lại mật khẩu
        message.setText(String.format("""
            Hello,
            
            You have requested to reset your password. Please click on the link below to reset your password:
            
            %s
            
            If you did not request a password reset, please ignore this email.
            
            This link will expire in 30 minutes.
            
            Best regards,
            Clinic Booking Team
            """, resetLink));

        // Gửi email qua SMTP
        try {
            mailSender.send(message);
        } catch (Exception ex) {
            System.err.println("Failed to send password reset email: " + ex.getMessage());
        }
    }
}

