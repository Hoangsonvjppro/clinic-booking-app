/*
 * Dịch vụ RoleService quản lý vòng đời vai trò (Role) cũng như việc gán/bỏ vai trò cho người dùng.
 * Lớp này cung cấp các thao tác mức cao cho controller: tạo mới vai trò, liệt kê toàn bộ vai trò,
 * cập nhật tập vai trò của một người dùng, và truy vấn vai trò hiện tại của họ. Mục tiêu là tập trung
 * toàn bộ quy ước nghiệp vụ liên quan đến phân quyền ở một nơi: kiểm tra trùng tên vai trò, xác nhận
 * vai trò tồn tại trước khi gán, và trả về DTO đã chuẩn hoá cho phía client.
 *
 * Về mặt giao dịch, các thao tác ghi (createRole, updateUserRoles) chạy trong @Transactional ghi,
 * còn các thao tác đọc (getAllRoles, getUserRoles) dùng @Transactional(readOnly = true) để tối ưu.
 * Lớp chỉ làm nhiệm vụ điều phối và kiểm tra ràng buộc; việc truy vấn/persist do các repository đảm nhiệm.
 */
package com.clinic.auth.service;

import com.clinic.auth.model.Role; // Thực thể vai trò
import com.clinic.auth.model.User; // Thực thể người dùng
import com.clinic.auth.repo.RoleRepository; // Truy cập dữ liệu roles
import com.clinic.auth.repo.UserRepository; // Truy cập dữ liệu users
import com.clinic.auth.web.dto.CreateRoleRequest; // DTO tạo vai trò
import com.clinic.auth.web.dto.UpdateUserRolesRequest; // DTO cập nhật vai trò người dùng
import com.clinic.auth.web.dto.UserRolesResponse; // DTO phản hồi thông tin vai trò người dùng
import lombok.RequiredArgsConstructor; // Tự sinh constructor cho các trường final
import org.springframework.stereotype.Service; // Đăng ký bean dịch vụ
import org.springframework.transaction.annotation.Transactional; // Quản lý giao dịch

import java.util.List; // Danh sách
import java.util.Set; // Tập hợp
import java.util.stream.Collectors; // Biến đổi stream

@Service // Bean dịch vụ Spring
@RequiredArgsConstructor // Inject roleRepo, userRepo qua constructor
public class RoleService {

    private final RoleRepository roleRepo; // Kho truy cập/bảo dưỡng vai trò
    private final UserRepository userRepo; // Kho truy cập người dùng

    /**
     * Tạo mới một vai trò trong hệ thống. Trước khi lưu, phương thức kiểm tra tên vai trò đã tồn tại
     * để tránh trùng lặp. Nếu hợp lệ, Role mới sẽ được persist và trả về cho caller.
     *
     * Pseudocode:
     * <pre>
     * if roleRepo.existsByName(req.name) -> throw IllegalArgumentException
     * role = Role(name=req.name, description=req.description)
     * return roleRepo.save(role)
     * </pre>
     *
     * @param request CreateRoleRequest chứa name và description
     * @return Role vừa được lưu trong cơ sở dữ liệu
     */
    @Transactional
    public Role createRole(CreateRoleRequest request) {
        if (roleRepo.existsByName(request.getName())) { // Chặn trùng tên vai trò
            throw new IllegalArgumentException("Role already exists: " + request.getName());
        }

        Role role = Role.builder()
                .name(request.getName()) // Tên vai trò (duy nhất)
                .description(request.getDescription()) // Mô tả vai trò
                .build();

        return roleRepo.save(role); // Persist và trả về bản ghi tạo mới
    }

    /**
     * Truy vấn toàn bộ các vai trò hiện có. Phương thức chỉ đọc nên đánh dấu readOnly để tối ưu hoá.
     *
     * @return danh sách tất cả Role
     */
    @Transactional(readOnly = true)
    public List<Role> getAllRoles() {
        return roleRepo.findAll(); // Lấy toàn bộ vai trò
    }

    /**
     * Cập nhật tập vai trò cho một người dùng: xác nhận user tồn tại, xác nhận mọi vai trò
     * trong danh sách đều hợp lệ, gán lại tập roles và trả về DTO tóm tắt (email, roles, enabled).
     *
     * Pseudocode:
     * <pre>
     * user = userRepo.findByEmail(req.email) or throw
     * newRoles = req.roleNames.map(name -> roleRepo.findByName(name) or throw).toSet()
     * user.roles = newRoles
     * userRepo.save(user)
     * return mapToUserRolesResponse(user)
     * </pre>
     *
     * @param request DTO chứa email và danh sách tên vai trò mới
     * @return UserRolesResponse phản ánh trạng thái vai trò sau cập nhật
     */
    @Transactional
    public UserRolesResponse updateUserRoles(UpdateUserRolesRequest request) {
        User user = userRepo.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + request.getEmail())); // Không tồn tại user

        Set<Role> newRoles = request.getRoleNames().stream()
                .map(name -> roleRepo.findByName(name)
                        .orElseThrow(() -> new IllegalArgumentException("Role not found: " + name))) // Mọi role phải hợp lệ
                .collect(Collectors.toSet());

        user.setRoles(newRoles); // Gán tập vai trò mới
        user = userRepo.save(user); // Lưu thay đổi

        return mapToUserRolesResponse(user); // Chuẩn hoá DTO phản hồi
    }

    /**
     * Truy vấn tập vai trò hiện tại của một người dùng theo email.
     *
     * @param email địa chỉ email người dùng
     * @return UserRolesResponse gồm email, tập vai trò và trạng thái enabled
     */
    @Transactional(readOnly = true)
    public UserRolesResponse getUserRoles(String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email)); // Không tồn tại

        return mapToUserRolesResponse(user); // Trả về DTO tóm tắt
    }

    /**
     * Tiện ích nội bộ để chuyển đổi thực thể User sang DTO UserRolesResponse một cách nhất quán.
     */
    private UserRolesResponse mapToUserRolesResponse(User user) {
        UserRolesResponse response = new UserRolesResponse(); // Khởi tạo DTO rỗng
        response.setEmail(user.getEmail()); // Gán email
        response.setRoles(user.getRoles().stream().map(Role::getName).collect(Collectors.toSet())); // Lấy tập tên vai trò
        response.setEnabled(user.isEnabled()); // Trạng thái kích hoạt
        return response; // Trả về DTO
    }
}
