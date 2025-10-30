-- REFRESH TOKENS
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id          BIGSERIAL PRIMARY KEY,
  token       VARCHAR(255) NOT NULL UNIQUE,   -- jti/opaque
  user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  issued_at   TIMESTAMP NOT NULL DEFAULT NOW(),
  expiry_date TIMESTAMP NOT NULL,
  revoked     BOOLEAN NOT NULL DEFAULT FALSE,
  user_agent  VARCHAR(255),
  ip_address  VARCHAR(45)
);
CREATE INDEX IF NOT EXISTS idx_refresh_user    ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_expiry  ON refresh_tokens(expiry_date);
CREATE INDEX IF NOT EXISTS idx_refresh_revoked ON refresh_tokens(revoked);

-- PASSWORD RESET TOKENS
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id          BIGSERIAL PRIMARY KEY,
  token       VARCHAR(255) NOT NULL UNIQUE,
  user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  issued_at   TIMESTAMP NOT NULL DEFAULT NOW(),
  expiry_date TIMESTAMP NOT NULL,
  used_at     TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_pwdreset_user   ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_pwdreset_expiry ON password_reset_tokens(expiry_date);
