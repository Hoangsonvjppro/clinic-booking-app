/*
 * Bộ lọc bảo mật (Security Filter) này chịu trách nhiệm xác thực người dùng thông qua JWT (JSON Web Token)
 * cho mọi request đi vào hệ thống. Nó được kế thừa từ OncePerRequestFilter — nghĩa là Spring sẽ đảm bảo
 * filter này chỉ chạy đúng một lần cho mỗi request.
 *
 * Cơ chế hoạt động:
 *  1. Mỗi request được gửi đến sẽ được kiểm tra phần header “Authorization”.
 *  2. Nếu header tồn tại và bắt đầu bằng “Bearer ”, filter sẽ tách token ra và nhờ JwtService xác thực.
 *  3. Khi token hợp lệ, filter lấy thông tin username và danh sách vai trò (roles) từ phần claim của token.
 *  4. Hệ thống sẽ tải thông tin người dùng tương ứng qua UserDetailsService để xây dựng đối tượng Authentication.
 *  5. Cuối cùng, Authentication được gắn vào SecurityContextHolder — từ đó Spring Security biết rằng request này
 *     đã được xác thực và có thể truy cập tài nguyên tương ứng.
 *
 * Nếu có lỗi trong quá trình xác thực (token không hợp lệ, hết hạn, v.v.), filter sẽ “im lặng” bỏ qua —
 * request sẽ tiếp tục đi qua chuỗi filter nhưng không có Authentication (nghĩa là người dùng chưa đăng nhập).
 *
 * Việc triển khai theo hướng này giúp tách biệt hoàn toàn logic xác thực JWT khỏi phần controller,
 * đồng thời đảm bảo tính stateless cho toàn bộ API.
 */
package com.clinic.auth.security;

import com.nimbusds.jwt.JWTClaimsSet; // Đại diện cho payload (claims) của JWT
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor; // Sinh constructor cho các trường final (jwtService, userDetailsService)
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken; // Đại diện cho thông tin xác thực
import org.springframework.security.core.authority.SimpleGrantedAuthority; // Đối tượng quyền hạn cơ bản trong Spring Security
import org.springframework.security.core.context.SecurityContextHolder; // Lưu trữ Authentication cho luồng hiện tại
import org.springframework.security.core.userdetails.UserDetails; // Thông tin người dùng
import org.springframework.security.core.userdetails.UserDetailsService; // Service tải thông tin người dùng
import org.springframework.stereotype.Component; // Đăng ký bean filter vào Spring container
import org.springframework.web.filter.OncePerRequestFilter; // Đảm bảo filter chạy 1 lần mỗi request

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors; // Chuyển đổi danh sách role thành danh sách quyền

@Component // Đăng ký bean vào Spring container
@RequiredArgsConstructor // Lombok tạo constructor tự động cho các trường final
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService; // Dịch vụ chịu trách nhiệm xác thực và giải mã JWT
    private final UserDetailsService userDetailsService; // Dịch vụ tải thông tin người dùng từ database

    /**
     * Phương thức chính xử lý logic xác thực JWT cho mỗi request.
     * Nếu token hợp lệ, phương thức sẽ thiết lập Authentication trong SecurityContext.
     *
     * @param request     đối tượng HttpServletRequest chứa thông tin request hiện tại
     * @param response    đối tượng HttpServletResponse dùng để phản hồi
     * @param filterChain chuỗi filter của Spring Security
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        // Lấy header Authorization từ request
        String authHeader = request.getHeader("Authorization");

        // Kiểm tra định dạng “Bearer <token>”
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7); // Cắt bỏ tiền tố "Bearer " để lấy phần token thực tế

            try {
                // Xác thực và giải mã JWT
                JWTClaimsSet claims = jwtService.validateAndParse(token); // Nếu token không hợp lệ -> ném exception

                // Lấy username (subject) từ claim
                String username = claims.getSubject();

                // Lấy danh sách vai trò (roles) từ claim, có thể null nếu token không chứa trường này
                @SuppressWarnings("unchecked")
                List<String> roles = (List<String>) claims.getClaim("roles");

                // Tải thông tin người dùng từ database
                UserDetails user = userDetailsService.loadUserByUsername(username);

                // Tạo danh sách quyền hạn từ roles hoặc lấy từ user nếu roles null
                var authorities = (roles == null)
                        ? user.getAuthorities().stream()
                        .map(a -> new SimpleGrantedAuthority(a.getAuthority()))
                        .collect(Collectors.toList())
                        : roles.stream()
                        .map(r -> new SimpleGrantedAuthority("ROLE_" + r))
                        .collect(Collectors.toList());

                // Tạo đối tượng Authentication chứa thông tin người dùng và quyền hạn
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(user, null, authorities);

                // Đưa Authentication vào SecurityContext để Spring nhận biết người dùng đã xác thực
                SecurityContextHolder.getContext().setAuthentication(authentication);

            } catch (Exception ex) {
                // Nếu token không hợp lệ, hết hạn hoặc lỗi khác -> bỏ qua, request coi như chưa xác thực
            }
        }

        // Tiếp tục luồng filter cho request
        filterChain.doFilter(request, response);
    }
}
