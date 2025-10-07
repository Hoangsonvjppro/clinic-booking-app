/*
 * Dịch vụ JWT tập trung cho auth-service. Nhiệm vụ của lớp này là phát hành (sign) và kiểm tra (verify)
 * JSON Web Token dùng thuật toán đối xứng HS256. Khi phát hành token, lớp sẽ xây dựng phần claim một cách
 * nhất quán (issuer, issue time, expiry, roles) và ký bằng khóa bí mật lấy từ cấu hình. Khi xác thực,
 * lớp phân tách token, kiểm tra chữ ký, kiểm tra hạn và trả về tập claim để tầng bảo mật sử dụng.
 *
 * Thiết kế này giúp các thành phần khác (filter, controller, service) không cần bận tâm đến chi tiết
 * mã hóa/ký số; chỉ cần gọi generateToken(...) để tạo token mới, hoặc validateAndParse(...) để xác thực
 * và đọc thông tin người dùng. Mọi quy ước (tên claim, thuật toán, issuer, TTL) đều tập trung ở đây.
 */
package com.clinic.auth.security;

import com.nimbusds.jose.JWSAlgorithm;              // Thuật toán ký (ở đây dùng HS256)
import com.nimbusds.jose.crypto.MACSigner;          // Ký JWT với khóa đối xứng (HMAC)
import com.nimbusds.jose.crypto.MACVerifier;        // Xác minh chữ ký HMAC
import com.nimbusds.jwt.SignedJWT;                  // Đối tượng JWT đã ký
import com.nimbusds.jose.JOSEObjectType;            // Kiểu đối tượng JOSE (JWT)
import com.nimbusds.jose.JWSHeader;                 // Header JWS (chứa thuật toán, kiểu)
import com.nimbusds.jwt.JWTClaimsSet;               // Tập claim của JWT
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;              // Tự sinh constructor cho trường final
import org.springframework.stereotype.Service;      // Đánh dấu bean Service cho Spring

import java.nio.charset.StandardCharsets;
import java.time.Instant;                           // Mốc thời gian phát hành/hết hạn
import java.util.Date;                              // Kiểu thời gian legacy cho thư viện Nimbus
import java.util.List;                              // Danh sách roles
import java.util.Map;                               // (Import sẵn nếu muốn mở rộng claim động)

@Service                                            // Đăng ký bean dịch vụ với Spring
@RequiredArgsConstructor                            // Sinh constructor nhận AppProps (final)
public class JwtService {

    private final com.clinic.auth.config.AppProps appProps; // Cấu hình JWT: issuer, secret, TTL mặc định

    /**
     * Hàm chạy ngay sau khi Spring inject bean xong.
     * Dùng để kiểm tra điều kiện của khóa bí mật JWT.
     */
    @PostConstruct
    private void validateSecretKey() {
        byte[] keyBytes = appProps.getJwtSecret().getBytes(StandardCharsets.UTF_8);
        if (keyBytes.length < 32) { // 32 bytes = 256 bit cho HS256
            throw new IllegalArgumentException(
                    String.format(
                            "⚠️ JWT secret key quá ngắn: chỉ %d bytes. HS256 yêu cầu tối thiểu 32 bytes (256 bits). " +
                                    "Hãy đặt app.jwt.secret dài hơn, ví dụ 32–64 ký tự.",
                            keyBytes.length
                    )
            );
        }
    }
    /**
     * Phát hành một JWT đã ký (HS256) cho subject chỉ định, kèm danh sách vai trò và thời hạn tùy ý.
     * Phương thức xử lý:
     *  - Tạo bộ claim chuẩn (iss, sub, iat, exp) và chèn "roles".
     *  - Tạo header HS256 + type JWT.
     *  - Ký bằng khóa bí mật lấy từ cấu hình.
     *  - Trả về chuỗi token dạng compact (header.payload.signature).
     *
     * Pseudocode:
     * <pre>
     * now = Instant.now()
     * claims = buildClaims(sub=subject, iss=issuer, iat=now, exp=now+ttl, roles=roles)
     * header = JWSHeader(alg=HS256, type=JWT)
     * jwt = SignedJWT(header, claims)
     * jwt.sign(MACSigner(secretBytes))
     * return jwt.serialize()
     * </pre>
     *
     * @param subject    danh tính người dùng (thường là email/username)
     * @param roles      danh sách vai trò để nhúng vào claim "roles"
     * @param ttlSeconds thời gian sống của token (giây)
     * @return chuỗi JWT đã ký, sẵn sàng đưa vào header Authorization: Bearer &lt;token&gt;
     */
    public String generateToken(String subject, List<String> roles, long ttlSeconds) {
        try {
            Instant now = Instant.now(); // Thời điểm phát hành
            JWTClaimsSet claims = new JWTClaimsSet.Builder()
                    .subject(subject)                                  // sub
                    .issuer(appProps.getIssuer())                      // iss
                    .issueTime(Date.from(now))                         // iat
                    .expirationTime(Date.from(now.plusSeconds(ttlSeconds))) // exp
                    .claim("roles", roles)                             // claim tùy biến
                    .build();

            JWSHeader header = new JWSHeader.Builder(JWSAlgorithm.HS256) // Dùng HMAC-SHA256
                    .type(JOSEObjectType.JWT)                            // Kiểu JWT
                    .build();

            SignedJWT signedJWT = new SignedJWT(header, claims);          // Ghép header + claims
            signedJWT.sign(new MACSigner(appProps.getJwtSecret().getBytes())); // Ký bằng secret đối xứng
            return signedJWT.serialize();                                 // Trả về token dạng chuỗi compact
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate JWT", e);      // Đóng gói lỗi phát hành token
        }
    }

    /**
     * Kiểm tra tính hợp lệ của JWT và trả về tập claim nếu hợp lệ.
     * Các bước gồm:
     *  - parse chuỗi token thành SignedJWT;
     *  - verify chữ ký bằng MACVerifier (HS256 với secret cấu hình);
     *  - kiểm tra hạn dùng (exp);
     *  - trả về JWTClaimsSet để bên gọi đọc subject/roles.
     *
     * Pseudocode:
     * <pre>
     * jwt = SignedJWT.parse(token)
     * if !jwt.verify(MACVerifier(secretBytes)) -> throw "Invalid signature"
     * if jwt.exp &lt; now -> throw "Token expired"
     * return jwt.getJWTClaimsSet()
     * </pre>
     *
     * @param token chuỗi JWT cần xác thực
     * @return JWTClaimsSet đã kiểm chứng, chứa subject/roles/issuer/iat/exp...
     * @throws RuntimeException nếu chữ ký sai, token hết hạn hoặc token không hợp lệ
     */
    public JWTClaimsSet validateAndParse(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);                               // Phân tích token compact
            boolean verified = signedJWT.verify(new MACVerifier(appProps.getJwtSecret().getBytes())); // Xác minh HMAC
            if (!verified) throw new RuntimeException("Invalid signature");             // Chữ ký không khớp

            Date exp = signedJWT.getJWTClaimsSet().getExpirationTime();                 // Lấy hạn dùng
            if (exp.before(new Date())) throw new RuntimeException("Token expired");    // Hết hạn

            return signedJWT.getJWTClaimsSet();                                         // Hợp lệ: trả về claims
        } catch (Exception e) {
            throw new RuntimeException("Invalid JWT: " + e.getMessage(), e);            // Gói lỗi xác thực/parse
        }
    }
}
