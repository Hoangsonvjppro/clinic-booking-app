package com.clinic.auth.repo;

import com.clinic.auth.model.RefreshToken;
import com.clinic.auth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

/**
 * Repository for working with {@link RefreshToken} records.
 */
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByToken(String token);

    @Query("""
            SELECT r FROM RefreshToken r
            WHERE r.user = :user
              AND r.revoked = false
              AND r.expiryDate > CURRENT_TIMESTAMP
            """)
    List<RefreshToken> findAllValidTokenByUser(@Param("user") User user);

    @Modifying
    @Query("UPDATE RefreshToken r SET r.revoked = true WHERE r.user = :user AND r.revoked = false")
    void revokeAllUserTokens(@Param("user") User user);

    @Modifying
    @Query("DELETE FROM RefreshToken r WHERE r.expiryDate < :now")
    void deleteAllExpiredTokens(@Param("now") Instant now);
}
