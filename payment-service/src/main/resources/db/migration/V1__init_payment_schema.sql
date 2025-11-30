-- Payment Service Schema Initialization
-- Enable PostgreSQL UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Invoices table
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID NOT NULL UNIQUE, -- Logical reference to Appointment Service
    amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
    status VARCHAR(20) NOT NULL CHECK (status IN ('UNPAID', 'PAID', 'REFUNDED')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Transactions table
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL,
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('MOMO', 'BANK_TRANSFER', 'VISA')),
    transaction_code VARCHAR(255) NOT NULL, -- Reference code from payment gateway
    gateway_response JSONB, -- Store full gateway response logs
    paid_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    -- Foreign key constraint (same database)
    CONSTRAINT fk_transactions_invoice 
        FOREIGN KEY (invoice_id) 
        REFERENCES invoices(id) 
        ON DELETE CASCADE
);

-- Indexes for better query performance
CREATE INDEX idx_invoices_appointment ON invoices(appointment_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_created_at ON invoices(created_at);
CREATE INDEX idx_transactions_invoice ON transactions(invoice_id);
CREATE INDEX idx_transactions_paid_at ON transactions(paid_at);
CREATE INDEX idx_transactions_code ON transactions(transaction_code);

-- Comments for documentation
COMMENT ON TABLE invoices IS 'Stores invoice records for appointments';
COMMENT ON TABLE transactions IS 'Stores payment transaction details linked to invoices';
COMMENT ON COLUMN invoices.appointment_id IS 'Logical reference to appointment in Appointment Service';
COMMENT ON COLUMN transactions.gateway_response IS 'Full JSON response from payment gateway for audit trail';
