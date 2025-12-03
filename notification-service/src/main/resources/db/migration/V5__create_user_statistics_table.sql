-- V5: Create user_statistics table for tracking user metrics
-- Statistics are maintained for both patients and doctors

CREATE TABLE user_statistics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- User identification (unique per user)
    user_id UUID NOT NULL UNIQUE,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('PATIENT', 'DOCTOR')),
    
    -- Appointment statistics
    total_appointments INT NOT NULL DEFAULT 0,
    completed_appointments INT NOT NULL DEFAULT 0,
    cancelled_appointments INT NOT NULL DEFAULT 0,
    no_show_count INT NOT NULL DEFAULT 0,
    
    -- Rating statistics
    average_rating DECIMAL(3,2) DEFAULT 0,
    total_ratings INT NOT NULL DEFAULT 0,
    
    -- Warning and violation statistics
    warning_count INT NOT NULL DEFAULT 0,
    penalty_count INT NOT NULL DEFAULT 0,
    report_count INT NOT NULL DEFAULT 0,
    reports_filed_count INT NOT NULL DEFAULT 0,
    
    -- Timestamps for important events
    last_appointment_at TIMESTAMP WITH TIME ZONE,
    last_warning_at TIMESTAMP WITH TIME ZONE,
    
    -- Record timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE UNIQUE INDEX idx_user_stats_user ON user_statistics(user_id);
CREATE INDEX idx_user_stats_type ON user_statistics(user_type);
CREATE INDEX idx_user_stats_no_show ON user_statistics(no_show_count DESC);
CREATE INDEX idx_user_stats_rating ON user_statistics(average_rating DESC);
CREATE INDEX idx_user_stats_warnings ON user_statistics(warning_count DESC);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_user_statistics_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_user_statistics_updated
BEFORE UPDATE ON user_statistics
FOR EACH ROW EXECUTE FUNCTION update_user_statistics_updated_at();

-- Comments
COMMENT ON TABLE user_statistics IS 'Aggregated statistics for users (patients and doctors)';
COMMENT ON COLUMN user_statistics.no_show_count IS 'Number of times user did not show up for appointments';
COMMENT ON COLUMN user_statistics.report_count IS 'Number of times user has been reported';
COMMENT ON COLUMN user_statistics.reports_filed_count IS 'Number of reports user has filed against others';
