-- V4: Create user_penalties table for penalty management
-- Penalties can include booking fee multipliers, temporary bans, etc.

CREATE TABLE user_penalties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- User information
    user_id UUID NOT NULL,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('PATIENT', 'DOCTOR')),
    
    -- Penalty details
    penalty_type VARCHAR(50) NOT NULL CHECK (penalty_type IN (
        'DOUBLE_BOOKING_FEE',    -- Phí đặt lịch gấp đôi
        'TRIPLE_BOOKING_FEE',    -- Phí đặt lịch gấp ba
        'TEMPORARY_BAN',         -- Tạm khóa tài khoản
        'PERMANENT_BAN',         -- Khóa vĩnh viễn
        'RATING_PENALTY',        -- Trừ điểm rating
        'FEATURE_RESTRICTION'    -- Hạn chế tính năng
    )),
    description TEXT,
    multiplier DECIMAL(3,2) DEFAULT 1.0,
    
    -- Links
    report_id UUID REFERENCES reports(id) ON DELETE SET NULL,
    warning_id UUID REFERENCES warnings(id) ON DELETE SET NULL,
    
    -- Admin who applied the penalty
    issued_by UUID NOT NULL,
    
    -- Validity period
    effective_from TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    effective_until TIMESTAMP WITH TIME ZONE,
    
    -- Status
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Timestamp
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_penalties_user ON user_penalties(user_id, user_type);
CREATE INDEX idx_penalties_active ON user_penalties(user_id, is_active) WHERE is_active = TRUE;
CREATE INDEX idx_penalties_type ON user_penalties(penalty_type);
CREATE INDEX idx_penalties_report ON user_penalties(report_id);
CREATE INDEX idx_penalties_effective ON user_penalties(effective_from, effective_until);

-- Comments
COMMENT ON TABLE user_penalties IS 'Penalties applied to users for rule violations';
COMMENT ON COLUMN user_penalties.penalty_type IS 'Type of penalty applied';
COMMENT ON COLUMN user_penalties.multiplier IS 'Fee multiplier (e.g., 2.0 for double booking fee)';
COMMENT ON COLUMN user_penalties.effective_until IS 'When penalty expires (NULL = permanent)';
COMMENT ON COLUMN user_penalties.is_active IS 'Whether penalty is currently active';
