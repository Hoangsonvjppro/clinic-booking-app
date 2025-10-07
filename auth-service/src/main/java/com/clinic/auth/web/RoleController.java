/*
 * RoleController là REST Controller dùng cho các thao tác quản trị liên quan đến vai trò (Role) của người dùng.
 * Nó cung cấp các endpoint cho phép tạo mới vai trò và gán vai trò cho người dùng cụ thể.
 * Các thao tác này được bảo vệ bằng phân quyền — chỉ người dùng có quyền ADMIN mới được phép thực hiện.
 *
 * Các endpoint chính:
 *  - POST   /api/v1/roles           → Tạo mới một vai trò.
 *  - PUT    /api/v1/roles/users/{id} → Gán vai trò cụ thể cho người dùng dựa trên ID.
 *
 * Để đảm bảo bảo mật, tất cả các endpoint trong controller này đều được đánh dấu @PreAuthorize("hasRole('ADMIN')"),
 * nghĩa là chỉ những tài khoản có vai trò ADMIN mới được phép thao tác.
 *
 * Controller này thao tác trực tiếp với RoleRepository và UserRepository để thực hiện các thay đổi,
 * đồng thời trả về phản hồi RESTful thông qua ResponseEntity.
 */
package com.clinic.auth.web;

import com.clinic.auth.model.Role;             // Thực thể vai trò
import com.clinic.auth.model.User;             // Thực thể người dùng
import com.clinic.auth.repo.RoleRepository;    // Repository thao tác với bảng roles
import com.clinic.auth.repo.UserRepository;    // Repository thao tác với bảng users
import jakarta.validation.constraints.NotBlank; // Ràng buộc validation: chuỗi không rỗng
import lombok.RequiredArgsConstructor;          // Tự động sinh constructor cho các trường final
import org.springframework.http.ResponseEntity; // Dùng để trả về phản hồi HTTP
import org.springframework.security.access.prepost.PreAuthorize; // Kiểm soát quyền truy cập
import org.springframework.web.bind.annotation.*; // Annotation REST controller

import java.util.Set; // Tập hợp roles

@RestController // Đánh dấu đây là controller RESTful
@RequestMapping("/api/v1/roles") // Đặt tiền tố chung cho các API liên quan đến vai trò
@RequiredArgsConstructor // Lombok inject các repository qua constructor
public class RoleController {

    private final RoleRepository roleRepo; // Repository truy xuất dữ liệu vai trò
    private final UserRepository userRepo; // Repository truy xuất dữ liệu người dùng

    /**
     * API: POST /api/v1/roles
     * Tạo mới một vai trò trong hệ thống.
     * Chỉ người có vai trò ADMIN mới được phép gọi endpoint này.
     *
     * Ví dụ request:
     * POST /api/v1/roles?name=DOCTOR
     *
     * @param name tên vai trò (phải là chữ in hoa, ví dụ: ADMIN, DOCTOR, PATIENT)
     * @return Vai trò vừa được tạo
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')") // Chỉ ADMIN được phép tạo vai trò mới
    public ResponseEntity<Role> createRole(@RequestParam @NotBlank String name) {
        Role role = roleRepo.save(Role.builder().name(name).build()); // Tạo và lưu role mới
        return ResponseEntity.ok(role); // Trả về role vừa tạo
    }

    /**
     * API: PUT /api/v1/roles/users/{userId}
     * Gán vai trò cho người dùng cụ thể dựa trên ID.
     * Endpoint này ghi đè toàn bộ vai trò cũ của người dùng bằng vai trò mới truyền vào.
     *
     * Ví dụ request:
     * PUT /api/v1/roles/users/5?role=ADMIN
     *
     * @param userId ID của người dùng cần gán vai trò
     * @param role   tên vai trò (ví dụ: ADMIN, DOCTOR)
     * @return HTTP 200 OK nếu gán thành công
     */
    @PutMapping("/users/{userId}")
    @PreAuthorize("hasRole('ADMIN')") // Chỉ ADMIN được phép thay đổi vai trò người khác
    public ResponseEntity<?> assignRoles(@PathVariable Long userId, @RequestParam String role) {
        User user = userRepo.findById(userId).orElseThrow(); // Tìm người dùng theo ID, nếu không có -> NoSuchElementException
        Role r = roleRepo.findByName(role).orElseThrow();    // Tìm vai trò theo tên, nếu không có -> NoSuchElementException
        user.setRoles(Set.of(r));                            // Gán vai trò mới (ghi đè tất cả vai trò cũ)
        userRepo.save(user);                                 // Lưu người dùng sau khi cập nhật
        return ResponseEntity.ok().build();                  // Trả về HTTP 200 OK, không có body
    }
}
