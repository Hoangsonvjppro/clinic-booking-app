-- V3: Create warnings table for user warnings
-- Warnings are issued by admins to users who violate platform rules

CREATE TABLE warnings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Recipient information
    user_id UUID NOT NULL,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('PATIENT', 'DOCTOR')),
    
    -- Warning details
    warning_type VARCHAR(50) NOT NULL CHECK (warning_type IN ('WARNING', 'FINAL_WARNING', 'PENALTY_NOTICE')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    
    -- Link to report (if applicable)
    report_id UUID REFERENCES reports(id) ON DELETE SET NULL,
    
    -- Admin who issued the warning
    issued_by UUID NOT NULL,
    
    -- Read status
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    
    -- Expiration (if applicable)
    expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamp
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_warnings_user ON warnings(user_id, user_type);
CREATE INDEX idx_warnings_unread ON warnings(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_warnings_report ON warnings(report_id);
CREATE INDEX idx_warnings_created ON warnings(created_at DESC);

-- Comments
COMMENT ON TABLE warnings IS 'Warnings issued by admins to users for rule violations';
COMMENT ON COLUMN warnings.warning_type IS 'Severity level: WARNING, FINAL_WARNING, PENALTY_NOTICE';
COMMENT ON COLUMN warnings.issued_by IS 'Admin user ID who issued the warning';
COMMENT ON COLUMN warnings.expires_at IS 'When the warning expires (NULL = permanent record)';
