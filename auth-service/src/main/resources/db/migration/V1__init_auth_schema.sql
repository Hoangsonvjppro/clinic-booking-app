-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- USERS table with UUID primary key
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255),              -- null if only using OAuth
    full_name VARCHAR(150),
    phone VARCHAR(30),
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    email_verified_at TIMESTAMP,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_enabled ON users(enabled);
CREATE INDEX idx_users_last_login ON users(last_login_at);

-- Trigger for users table
CREATE TRIGGER trg_users_updated
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ROLES table
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    code VARCHAR(40) NOT NULL UNIQUE,    -- 'ADMIN','USER','DOCTOR','PATIENT'
    display_name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Trigger for roles table
CREATE TRIGGER trg_roles_updated
BEFORE UPDATE ON roles
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- USER_ROLES junction table (many-to-many)
CREATE TABLE user_roles (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

CREATE INDEX idx_user_roles_user ON user_roles(user_id);
CREATE INDEX idx_user_roles_role ON user_roles(role_id);

-- OAuth Accounts table for social login
CREATE TABLE oauth_accounts (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,           -- 'google', 'facebook', etc.
    provider_user_id VARCHAR(255) NOT NULL,  -- ID from OAuth provider
    access_token TEXT,
    refresh_token TEXT,
    expires_at TIMESTAMP,
    profile_picture VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (provider, provider_user_id)
);

CREATE INDEX idx_oauth_accounts_user ON oauth_accounts(user_id);
CREATE INDEX idx_oauth_accounts_provider ON oauth_accounts(provider, provider_user_id);

-- Seed default roles
INSERT INTO roles (code, display_name, description) VALUES
('USER', 'User', 'Regular user with basic permissions'),
('DOCTOR', 'Doctor', 'Medical professional who can manage appointments'),
('PATIENT', 'Patient', 'Patient who can book appointments'),
('ADMIN', 'Administrator', 'System administrator with full access')
ON CONFLICT (code) DO NOTHING;
