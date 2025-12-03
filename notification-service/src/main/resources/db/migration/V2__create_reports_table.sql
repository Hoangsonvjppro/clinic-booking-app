-- V2: Create reports table for user violation reports
-- Reports can be filed by patients against doctors and vice versa

CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Reporter information
    reporter_id UUID NOT NULL,
    reporter_type VARCHAR(20) NOT NULL CHECK (reporter_type IN ('PATIENT', 'DOCTOR')),
    
    -- Reported user information
    reported_id UUID NOT NULL,
    reported_type VARCHAR(20) NOT NULL CHECK (reported_type IN ('PATIENT', 'DOCTOR')),
    
    -- Report details
    report_type VARCHAR(50) NOT NULL,
    appointment_id UUID,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    evidence_urls TEXT[],
    
    -- Processing status
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'REVIEWING', 'RESOLVED', 'DISMISSED')),
    
    -- Admin resolution
    admin_id UUID,
    admin_notes TEXT,
    resolution VARCHAR(50) CHECK (resolution IN ('WARNING', 'PENALTY', 'SUSPEND', 'BAN', 'DISMISS')),
    resolved_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX idx_reports_reporter ON reports(reporter_id, reporter_type);
CREATE INDEX idx_reports_reported ON reports(reported_id, reported_type);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_created ON reports(created_at DESC);
CREATE INDEX idx_reports_appointment ON reports(appointment_id);
CREATE INDEX idx_reports_admin ON reports(admin_id);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_reports_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_reports_updated
BEFORE UPDATE ON reports
FOR EACH ROW EXECUTE FUNCTION update_reports_updated_at();

-- Comments
COMMENT ON TABLE reports IS 'User violation reports between patients and doctors';
COMMENT ON COLUMN reports.reporter_type IS 'Type of user filing the report: PATIENT or DOCTOR';
COMMENT ON COLUMN reports.reported_type IS 'Type of user being reported: PATIENT or DOCTOR';
COMMENT ON COLUMN reports.report_type IS 'Specific violation type (e.g., NO_SHOW_PATIENT, POOR_SERVICE_QUALITY)';
COMMENT ON COLUMN reports.evidence_urls IS 'Array of URLs to evidence files (images, documents)';
COMMENT ON COLUMN reports.resolution IS 'Admin decision: WARNING, PENALTY, SUSPEND, BAN, or DISMISS';
