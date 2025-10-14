/*
 * Lớp thực thể (Entity) đại diện cho bảng `audit_logs` trong cơ sở dữ liệu. Mỗi bản ghi tương ứng với một sự kiện
 * audit được tạo ra bởi hệ thống khi người dùng hoặc service thực hiện một hành động quan trọng như đăng ký, đăng nhập,
 * cập nhật thông tin, hoặc thay đổi dữ liệu. Mục tiêu của lớp này là cung cấp cấu trúc lưu trữ thống nhất cho các
 * sự kiện audit, bao gồm thông tin về người thực hiện, loại hành động, thời điểm, và kết quả (thành công hoặc lỗi).
 *
 * Lớp được chú thích bằng các annotation JPA để ánh xạ trực tiếp với bảng trong database. Hibernate sẽ tự động
 * tạo và cập nhật dữ liệu khi các bản ghi mới được thêm vào. Ngoài ra, @CreationTimestamp giúp tự động điền thời gian
 * tạo bản ghi, còn Lombok được dùng để giảm mã lặp (tự sinh getter/setter, builder, constructor, v.v.).
 */
package com.clinic.auth.model;

import jakarta.persistence.*; // Cung cấp annotation JPA như @Entity, @Id, @Column, @Table, ...
import lombok.*; // Sinh tự động getter/setter, constructor, builder
import org.hibernate.annotations.CreationTimestamp; // Ghi lại thời điểm tạo bản ghi
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant; // Lưu trữ mốc thời gian chính xác (UTC)
import java.util.Map;

@Entity // Đánh dấu lớp này là một thực thể JPA
@Table(name = "audit_logs") // Liên kết thực thể này với bảng "audit_logs" trong DB
@Getter @Setter // Lombok tự sinh getter và setter cho toàn bộ thuộc tính
@NoArgsConstructor @AllArgsConstructor @Builder // Tự động sinh constructor rỗng, đầy đủ và builder pattern
public class AuditLog {

    @Id // Đánh dấu trường này là khóa chính
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Sử dụng cơ chế auto-increment của DB
    private Long id; // Mã định danh duy nhất cho mỗi bản ghi audit

    @Column(nullable = false) // Cột bắt buộc, lưu hành động được thực hiện (vd: LOGIN, REGISTER)
    private String action;

    @Column(name = "entity_type", nullable = false) // Lưu loại thực thể liên quan (vd: USER, ROLE)
    private String entityType;

    @Column(name = "entity_id") // ID của thực thể bị tác động (vd: userId, roleId)
    private String entityId;

    @Column(name = "user_id") // ID người dùng thực hiện hành động (nếu có)
    private Long userId;

    @Column(name = "user_email") // Email của người dùng thực hiện hành động
    private String userEmail;

    @Column(name = "ip_address") // Địa chỉ IP của người thực hiện
    private String ipAddress;

    @Column(name = "user_agent") // Thông tin thiết bị hoặc trình duyệt từ header User-Agent
    private String userAgent;

    @CreationTimestamp // Hibernate tự động gán thời gian hiện tại khi bản ghi được tạo
    @Column(name = "created_at", nullable = false, updatable = false) // Không cho phép cập nhật sau khi tạo
    private Instant createdAt;

    @Column(name = "status", nullable = false) // Trạng thái thực thi của hành động (SUCCESS/FAILURE)
    @Builder.Default // Khi dùng builder, nếu không gán giá trị thì mặc định là "SUCCESS"
    private String status = "SUCCESS";

    @Column(name = "error_message") // Thông báo lỗi nếu hành động thất bại
    private String errorMessage;

    @Column(name = "details", columnDefinition = "jsonb", nullable = false)
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Object> details; // hoặc JsonNode
}
