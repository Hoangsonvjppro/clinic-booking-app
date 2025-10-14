CREATE TABLE IF NOT EXISTS audit_logs (
  id         BIGSERIAL PRIMARY KEY,
  action     VARCHAR(80) NOT NULL,       -- 'LOGIN_SUCCESS','LOGIN_FAIL','PASSWORD_CHANGED','OAUTH_LINKED',...
  user_id    BIGINT REFERENCES users(id) ON DELETE SET NULL,
  subject    VARCHAR(120),               -- email/jti/provider_user_id...
  details    JSONB,
  ip_address VARCHAR(45),
  user_agent VARCHAR(255),
  status     VARCHAR(30) NOT NULL DEFAULT 'SUCCESS',
  error_msg  TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_audit_user   ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action);
