CREATE TABLE IF NOT EXISTS email_verification_tokens (
  id          BIGSERIAL PRIMARY KEY,
  token       VARCHAR(255) NOT NULL UNIQUE,
  user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  issued_at   TIMESTAMP NOT NULL DEFAULT NOW(),
  expiry_date TIMESTAMP NOT NULL,
  used_at     TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_emailverify_user ON email_verification_tokens(user_id);
