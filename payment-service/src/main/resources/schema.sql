-- Create database
CREATE DATABASE IF NOT EXISTS clinic_payment_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE clinic_payment_db;

CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL UNIQUE,
    request_id VARCHAR(50) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    order_info TEXT,
    request_type VARCHAR(20),
    trans_id VARCHAR(50),
    result_code INTEGER,
    message TEXT,
    pay_type VARCHAR(20),
    response_time BIGINT,
    extra_data TEXT,
    signature VARCHAR(255),
    user_id VARCHAR(36), -- UUID from Auth Service
    status VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_momo_trans_id ON payments(trans_id);

CREATE TABLE IF NOT EXISTS payment_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    payment_id BIGINT NOT NULL,
    momo_response JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payment_log FOREIGN KEY (payment_id)
        REFERENCES payments(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;
