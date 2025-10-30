-- Align identifier columns with BIGINT expected by JPA entities
ALTER TABLE appointment_status
    ALTER COLUMN id TYPE BIGINT,
    ALTER COLUMN id SET DEFAULT nextval('appointment_status_id_seq'::regclass);

ALTER TABLE appointments
    ALTER COLUMN appointment_id TYPE BIGINT,
    ALTER COLUMN appointment_id SET DEFAULT nextval('appointments_appointment_id_seq'::regclass);

ALTER TABLE appointment_audit
    ALTER COLUMN audit_id TYPE BIGINT,
    ALTER COLUMN audit_id SET DEFAULT nextval('appointment_audit_audit_id_seq'::regclass);
