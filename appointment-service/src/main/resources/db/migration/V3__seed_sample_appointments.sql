-- Seed illustrative appointments spanning lifecycle states
INSERT INTO appointments (
    patient_id,
    doctor_id,
    appointment_time,
    duration_minutes,
    status_id,
    notes,
    cancelled_reason
)
SELECT 1001,
       2001,
       TIMESTAMP '2025-03-01 09:00:00',
       30,
       s.id,
       'Annual physical check-up request',
       NULL
FROM appointment_status s
WHERE s.code = 'PENDING'
  AND NOT EXISTS (
      SELECT 1 FROM appointments a
      WHERE a.patient_id = 1001
        AND a.doctor_id = 2001
        AND a.appointment_time = TIMESTAMP '2025-03-01 09:00:00'
  );

INSERT INTO appointments (
    patient_id,
    doctor_id,
    appointment_time,
    duration_minutes,
    status_id,
    notes,
    cancelled_reason
)
SELECT 1001,
       2001,
       TIMESTAMP '2025-03-02 10:30:00',
       45,
       s.id,
       'Follow-up consultation after lab results',
       NULL
FROM appointment_status s
WHERE s.code = 'CONFIRMED'
  AND NOT EXISTS (
      SELECT 1 FROM appointments a
      WHERE a.patient_id = 1001
        AND a.doctor_id = 2001
        AND a.appointment_time = TIMESTAMP '2025-03-02 10:30:00'
  );

INSERT INTO appointments (
    patient_id,
    doctor_id,
    appointment_time,
    duration_minutes,
    status_id,
    notes,
    cancelled_reason
)
SELECT 1002,
       2001,
       TIMESTAMP '2025-02-28 15:00:00',
       30,
       s.id,
       'Consultation regarding chronic migraine',
       'Patient requested to reschedule due to travel'
FROM appointment_status s
WHERE s.code = 'CANCELLED'
  AND NOT EXISTS (
      SELECT 1 FROM appointments a
      WHERE a.patient_id = 1002
        AND a.doctor_id = 2001
        AND a.appointment_time = TIMESTAMP '2025-02-28 15:00:00'
  );

INSERT INTO appointments (
    patient_id,
    doctor_id,
    appointment_time,
    duration_minutes,
    status_id,
    notes,
    cancelled_reason
)
SELECT 1001,
       2002,
       TIMESTAMP '2025-02-10 08:30:00',
       30,
       s.id,
       'Completed physical therapy follow-up',
       NULL
FROM appointment_status s
WHERE s.code = 'COMPLETED'
  AND NOT EXISTS (
      SELECT 1 FROM appointments a
      WHERE a.patient_id = 1001
        AND a.doctor_id = 2002
        AND a.appointment_time = TIMESTAMP '2025-02-10 08:30:00'
  );

-- Audit trail for seeded appointments
INSERT INTO appointment_audit (appointment_id, action, performed_by, details)
SELECT a.appointment_id,
       'CREATED',
       'PATIENT_1001',
       'Seed data: appointment requested by patient'
FROM appointments a
WHERE a.patient_id = 1001
  AND a.doctor_id = 2001
  AND a.appointment_time = TIMESTAMP '2025-03-01 09:00:00'
  AND NOT EXISTS (
      SELECT 1 FROM appointment_audit aa
      WHERE aa.appointment_id = a.appointment_id
        AND aa.action = 'CREATED'
  );

INSERT INTO appointment_audit (appointment_id, action, performed_by, details)
SELECT a.appointment_id,
       'CREATED',
       'PATIENT_1001',
       'Seed data: appointment requested by patient'
FROM appointments a
WHERE a.patient_id = 1001
  AND a.doctor_id = 2001
  AND a.appointment_time = TIMESTAMP '2025-03-02 10:30:00'
  AND NOT EXISTS (
      SELECT 1 FROM appointment_audit aa
      WHERE aa.appointment_id = a.appointment_id
        AND aa.action = 'CREATED'
  );

INSERT INTO appointment_audit (appointment_id, action, performed_by, details)
SELECT a.appointment_id,
       'STATUS_CONFIRMED',
       'DOCTOR_2001',
       'Seed data: doctor confirmed the appointment'
FROM appointments a
WHERE a.patient_id = 1001
  AND a.doctor_id = 2001
  AND a.appointment_time = TIMESTAMP '2025-03-02 10:30:00'
  AND NOT EXISTS (
      SELECT 1 FROM appointment_audit aa
      WHERE aa.appointment_id = a.appointment_id
        AND aa.action = 'STATUS_CONFIRMED'
  );

INSERT INTO appointment_audit (appointment_id, action, performed_by, details)
SELECT a.appointment_id,
       'CREATED',
       'PATIENT_1002',
       'Seed data: appointment requested by patient'
FROM appointments a
WHERE a.patient_id = 1002
  AND a.doctor_id = 2001
  AND a.appointment_time = TIMESTAMP '2025-02-28 15:00:00'
  AND NOT EXISTS (
      SELECT 1 FROM appointment_audit aa
      WHERE aa.appointment_id = a.appointment_id
        AND aa.action = 'CREATED'
  );

INSERT INTO appointment_audit (appointment_id, action, performed_by, details)
SELECT a.appointment_id,
       'CANCELLED',
       'PATIENT_1002',
       'Seed data: patient requested cancellation'
FROM appointments a
WHERE a.patient_id = 1002
  AND a.doctor_id = 2001
  AND a.appointment_time = TIMESTAMP '2025-02-28 15:00:00'
  AND NOT EXISTS (
      SELECT 1 FROM appointment_audit aa
      WHERE aa.appointment_id = a.appointment_id
        AND aa.action = 'CANCELLED'
  );

INSERT INTO appointment_audit (appointment_id, action, performed_by, details)
SELECT a.appointment_id,
       'CREATED',
       'PATIENT_1001',
       'Seed data: appointment requested by patient'
FROM appointments a
WHERE a.patient_id = 1001
  AND a.doctor_id = 2002
  AND a.appointment_time = TIMESTAMP '2025-02-10 08:30:00'
  AND NOT EXISTS (
      SELECT 1 FROM appointment_audit aa
      WHERE aa.appointment_id = a.appointment_id
        AND aa.action = 'CREATED'
  );

INSERT INTO appointment_audit (appointment_id, action, performed_by, details)
SELECT a.appointment_id,
       'STATUS_CONFIRMED',
       'DOCTOR_2002',
       'Seed data: doctor confirmed the appointment'
FROM appointments a
WHERE a.patient_id = 1001
  AND a.doctor_id = 2002
  AND a.appointment_time = TIMESTAMP '2025-02-10 08:30:00'
  AND NOT EXISTS (
      SELECT 1 FROM appointment_audit aa
      WHERE aa.appointment_id = a.appointment_id
        AND aa.action = 'STATUS_CONFIRMED'
  );

INSERT INTO appointment_audit (appointment_id, action, performed_by, details)
SELECT a.appointment_id,
       'STATUS_COMPLETED',
       'DOCTOR_2002',
       'Seed data: appointment marked completed'
FROM appointments a
WHERE a.patient_id = 1001
  AND a.doctor_id = 2002
  AND a.appointment_time = TIMESTAMP '2025-02-10 08:30:00'
  AND NOT EXISTS (
      SELECT 1 FROM appointment_audit aa
      WHERE aa.appointment_id = a.appointment_id
        AND aa.action = 'STATUS_COMPLETED'
  );

-- Align sequences with inserted identifiers
SELECT setval('appointments_appointment_id_seq', COALESCE((SELECT MAX(appointment_id) FROM appointments), 1));
SELECT setval('appointment_audit_audit_id_seq', COALESCE((SELECT MAX(audit_id) FROM appointment_audit), 1));
