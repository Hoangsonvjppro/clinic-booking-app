-- Seed representative patient records covering key status combinations
INSERT INTO patients (
    id,
    first_name,
    last_name,
    patient_code,
    email,
    phone,
    date_of_birth,
    gender,
    address_line,
    city,
    state,
    postal_code,
    country,
    is_active,
    status,
    created_at,
    updated_at
)
VALUES
    (
        1001,
        'Alice',
        'Nguyen',
        'PT-ACTIVE-1001',
        'alice.active@clinic.test',
        '0900000001',
        DATE '1990-04-12',
        'FEMALE',
        '101 Nguyen Trai',
        'Ho Chi Minh City',
        'HCM',
        '700000',
        'Vietnam',
        TRUE,
        'ACTIVE',
        NOW() - INTERVAL '90 days',
        NOW() - INTERVAL '1 day'
    ),
    (
        1002,
        'Bob',
        'Tran',
        'PT-SUSP-1002',
        'bob.suspended@clinic.test',
        '0900000002',
        DATE '1985-09-03',
        'MALE',
        '202 Le Loi',
        'Ho Chi Minh City',
        'HCM',
        '700000',
        'Vietnam',
        FALSE,
        'SUSPENDED',
        NOW() - INTERVAL '120 days',
        NOW() - INTERVAL '5 days'
    ),
    (
        1003,
        'Chi',
        'Le',
        'PT-INACT-1003',
        'chi.inactive@clinic.test',
        '0900000003',
        DATE '1995-01-22',
        'OTHER',
        '12 Nguyen Hue',
        'Da Nang',
        'DN',
        '550000',
        'Vietnam',
        FALSE,
        'INACTIVE',
        NOW() - INTERVAL '45 days',
        NOW() - INTERVAL '2 days'
    )
ON CONFLICT (id) DO NOTHING;

-- Keep the sequence in sync with the largest seeded identifier
SELECT setval('patients_id_seq', COALESCE((SELECT MAX(id) FROM patients), 1));
