CREATE TABLE IF NOT EXISTS oauth_accounts (
  id               BIGSERIAL PRIMARY KEY,
  user_id          BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider         VARCHAR(50) NOT NULL,             -- 'google','zalo',...
  provider_user_id VARCHAR(191) NOT NULL,            -- sub/openid hoặc id Zalo
  access_token     TEXT,
  refresh_token    TEXT,
  token_expires_at TIMESTAMP,
  created_at       TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (provider, provider_user_id)
);
CREATE INDEX IF NOT EXISTS idx_oauth_user ON oauth_accounts(user_id);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_oauth_updated') THEN
    CREATE TRIGGER trg_oauth_updated
    BEFORE UPDATE ON oauth_accounts
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
END $$;
