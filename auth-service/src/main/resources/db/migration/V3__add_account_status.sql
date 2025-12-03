-- V3: Add account status and suspension columns to users table
-- This migration adds support for account moderation (warnings, suspensions, bans)

-- Add account_status column
ALTER TABLE users ADD COLUMN IF NOT EXISTS account_status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE';

-- Add suspension-related columns
ALTER TABLE users ADD COLUMN IF NOT EXISTS suspension_reason TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS suspended_until TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS banned_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS banned_by UUID;

-- Create index for account_status queries
CREATE INDEX IF NOT EXISTS idx_users_account_status ON users(account_status);

-- Add check constraint for valid account statuses
ALTER TABLE users ADD CONSTRAINT chk_account_status 
    CHECK (account_status IN ('ACTIVE', 'WARNED', 'SUSPENDED', 'BANNED'));

-- Comment for documentation
COMMENT ON COLUMN users.account_status IS 'Account status: ACTIVE, WARNED, SUSPENDED, BANNED';
COMMENT ON COLUMN users.suspension_reason IS 'Reason for suspension or ban';
COMMENT ON COLUMN users.suspended_until IS 'Timestamp when suspension expires (NULL for permanent ban)';
COMMENT ON COLUMN users.banned_at IS 'Timestamp when account was banned';
COMMENT ON COLUMN users.banned_by IS 'Admin user ID who banned this account';
