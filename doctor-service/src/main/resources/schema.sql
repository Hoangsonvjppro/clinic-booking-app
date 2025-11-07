TABLE doctor (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  full_name VARCHAR(100),
  phone VARCHAR(20),
  hospital_name VARCHAR(100),
  hospital_address TEXT,
  auto_accept_patients BOOLEAN DEFAULT FALSE,
  payment_method VARCHAR(20), -- CASH|CREDIT|BOTH
  certificate_url TEXT,
  status VARCHAR(20) DEFAULT 'PENDING', -- PENDING|APPROVED|REJECTED
  created_at TIMESTAMP DEFAULT NOW()
);
