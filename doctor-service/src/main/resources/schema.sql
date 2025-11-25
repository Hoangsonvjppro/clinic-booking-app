CREATE TABLE IF NOT EXISTS doctor (
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
  consultation_fee DECIMAL(10,2) DEFAULT 0,
  bio TEXT,
  experience_years INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS specialties (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS doctor_specialties (
  doctor_id UUID NOT NULL REFERENCES doctor(id),
  specialty_id INTEGER NOT NULL REFERENCES specialties(id),
  PRIMARY KEY (doctor_id, specialty_id)
);
