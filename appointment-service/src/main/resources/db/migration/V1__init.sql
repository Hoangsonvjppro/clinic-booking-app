-- Tạo bảng trạng thái trước (Parent Table)
CREATE TABLE IF NOT EXISTS appointment_status (
    id SERIAL PRIMARY KEY, -- Dùng SERIAL (tự tăng Integer)
    code VARCHAR(32) NOT NULL UNIQUE,
    display_name VARCHAR(64) NOT NULL
);

-- Tạo bảng lịch hẹn (Child Table)
CREATE TABLE IF NOT EXISTS appointments (
    appointment_id UUID PRIMARY KEY, -- Chốt dùng UUID
    patient_id UUID NOT NULL,        -- UUID cho đồng bộ
    doctor_id UUID NOT NULL,         -- UUID cho đồng bộ
    appointment_time TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    duration_minutes INTEGER,
    
    -- 👇 ĐÂY LÀ CHỖ ĐÃ SỬA CHO KHỚP VỚI JAVA
    status_id INTEGER NOT NULL REFERENCES appointment_status (id), 
    
    notes TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    cancelled_reason TEXT,

    -- Các cột Snapshot (Dư thừa có chủ đích)
    doctor_name VARCHAR(255),
    patient_name VARCHAR(255),
    clinic_address TEXT
);

-- Bảng Audit
CREATE TABLE IF NOT EXISTS appointment_audit (
    audit_id SERIAL PRIMARY KEY,
    appointment_id UUID NOT NULL REFERENCES appointments (appointment_id),
    action VARCHAR(32) NOT NULL,
    performed_by VARCHAR(64) NOT NULL,
    details TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

-- Seed dữ liệu trạng thái ban đầu
INSERT INTO appointment_status (code, display_name) VALUES
    ('PENDING', 'Pending Confirmation'),
    ('CONFIRMED', 'Confirmed'),
    ('CANCELLED', 'Cancelled'),
    ('COMPLETED', 'Completed')
ON CONFLICT (code) DO NOTHING;