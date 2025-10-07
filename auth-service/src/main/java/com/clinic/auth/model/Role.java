/*
 * Lớp thực thể (Entity) Role ánh xạ tới bảng `roles` trong cơ sở dữ liệu và đại diện cho vai trò (quyền hạn)
 * của người dùng trong hệ thống, chẳng hạn như ADMIN, DOCTOR, hay PATIENT. Mỗi vai trò được định danh duy nhất
 * bởi thuộc tính `name` — là chuỗi viết hoa, có thể chứa dấu gạch dưới, tuân theo quy ước đặt tên rõ ràng.
 *
 * Lớp này giúp hệ thống quản lý phân quyền (authorization) một cách linh hoạt. Các vai trò được gắn cho người dùng
 * để xác định phạm vi truy cập và thao tác mà họ được phép thực hiện. Ví dụ, ADMIN có thể xem và chỉnh sửa mọi dữ liệu,
 * trong khi DOCTOR chỉ xem được thông tin bệnh nhân của mình.
 *
 * Các annotation validation (như @NotBlank, @Pattern, @Size) được sử dụng để bảo đảm dữ liệu hợp lệ
 * ngay từ tầng entity, tránh lỗi khi lưu vào cơ sở dữ liệu.
 */
package com.clinic.auth.model;

import jakarta.persistence.*; // Cung cấp các annotation JPA cho entity, cột, khóa chính
import jakarta.validation.constraints.NotBlank; // Đảm bảo chuỗi không rỗng
import jakarta.validation.constraints.Pattern; // Ràng buộc định dạng chuỗi theo biểu thức chính quy
import jakarta.validation.constraints.Size; // Giới hạn độ dài chuỗi
import lombok.*; // Tự sinh getter/setter, builder, constructor

@Entity // Đánh dấu đây là một entity trong JPA
@Table(name = "roles") // Ánh xạ với bảng "roles" trong DB
@Getter @Setter // Lombok sinh sẵn getter và setter
@NoArgsConstructor @AllArgsConstructor @Builder // Sinh constructor rỗng, đầy đủ và builder pattern
public class Role {

    @Id // Đánh dấu khóa chính
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Sử dụng ID tự tăng trong DB
    private Long id; // Mã định danh duy nhất cho từng vai trò

    @Column(unique = true, nullable = false) // Tên vai trò là duy nhất và bắt buộc
    @NotBlank(message = "Role name is required") // Không được để trống
    @Pattern(regexp = "^[A-Z_]+$", message = "Role name must contain only uppercase letters and underscores") // Định dạng viết hoa + gạch dưới
    @Size(min = 2, max = 50, message = "Role name must be between 2 and 50 characters") // Giới hạn độ dài hợp lý
    private String name; // Tên vai trò, ví dụ: ADMIN, DOCTOR, PATIENT

    @Size(max = 255, message = "Description cannot exceed 255 characters") // Giới hạn độ dài phần mô tả
    private String description; // Mô tả chi tiết vai trò, giúp dễ hiểu khi quản trị
}
