-- Notification Service Schema Initialization
-- Enable PostgreSQL UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Notification Templates table
CREATE TABLE notification_templates (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE, -- e.g., 'BOOKING_SUCCESS', 'PAYMENT_COMPLETED'
    title_template TEXT NOT NULL,
    body_template TEXT NOT NULL,
    channel VARCHAR(20) NOT NULL CHECK (channel IN ('EMAIL', 'SMS')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Notification Logs table
CREATE TABLE notification_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient VARCHAR(255) NOT NULL, -- Email or phone number
    template_code VARCHAR(50) NOT NULL, -- Reference to template code used
    content TEXT NOT NULL, -- The actual message sent
    status VARCHAR(20) NOT NULL CHECK (status IN ('SENT', 'FAILED')),
    related_entity_id UUID, -- Logical reference (user_id or appointment_id from other services)
    sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    error_message TEXT -- Store error details if status is FAILED
);

-- Indexes for better query performance
CREATE INDEX idx_notification_templates_code ON notification_templates(code);
CREATE INDEX idx_notification_templates_channel ON notification_templates(channel);
CREATE INDEX idx_notification_logs_recipient ON notification_logs(recipient);
CREATE INDEX idx_notification_logs_template_code ON notification_logs(template_code);
CREATE INDEX idx_notification_logs_status ON notification_logs(status);
CREATE INDEX idx_notification_logs_sent_at ON notification_logs(sent_at);
CREATE INDEX idx_notification_logs_related_entity ON notification_logs(related_entity_id);

-- Insert default notification templates
INSERT INTO notification_templates (code, title_template, body_template, channel) VALUES
('BOOKING_SUCCESS', 'Appointment Confirmed', 'Dear {{patient_name}}, your appointment with Dr. {{doctor_name}} on {{appointment_date}} has been confirmed.', 'EMAIL'),
('BOOKING_REMINDER', 'Appointment Reminder', 'This is a reminder for your appointment with Dr. {{doctor_name}} on {{appointment_date}}.', 'SMS'),
('PAYMENT_SUCCESS', 'Payment Received', 'Thank you for your payment of {{amount}}. Your invoice #{{invoice_id}} has been marked as paid.', 'EMAIL'),
('APPOINTMENT_CANCELLED', 'Appointment Cancelled', 'Your appointment on {{appointment_date}} has been cancelled. Reason: {{reason}}', 'EMAIL');

-- Comments for documentation
COMMENT ON TABLE notification_templates IS 'Stores reusable notification templates for different channels';
COMMENT ON TABLE notification_logs IS 'Audit log of all notifications sent through the system';
COMMENT ON COLUMN notification_templates.code IS 'Unique identifier for template lookup';
COMMENT ON COLUMN notification_templates.body_template IS 'Template body with placeholders like {{variable}}';
COMMENT ON COLUMN notification_logs.related_entity_id IS 'Logical reference to user/appointment in other services';
