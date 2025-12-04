-- Platform settings table for admin configuration
CREATE TABLE platform_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    description TEXT,
    updated_by UUID,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default platform settings
INSERT INTO platform_settings (setting_key, setting_value, description) VALUES
('commission_rate', '10', 'Platform commission rate in percentage (%)'),
('min_commission_rate', '5', 'Minimum allowed commission rate (%)'),
('max_commission_rate', '30', 'Maximum allowed commission rate (%)'),
('default_consultation_fee', '300000', 'Default consultation fee in VND'),
('currency', 'VND', 'Default currency');

-- Create index
CREATE INDEX idx_platform_settings_key ON platform_settings(setting_key);
