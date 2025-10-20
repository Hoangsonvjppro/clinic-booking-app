-- Seed key auth accounts aligned with integration test scenarios
INSERT INTO users (email, password_hash, full_name, phone, enabled, email_verified_at, last_login_at)
SELECT 'admin@clinic.test',
       '$2b$10$QxQQSLqMQ4w0JAUOV9G9p.IqAtw6DjJqOQlk2XMXYnwifVZvfulwa',
       'System Administrator',
       '0901000000',
       TRUE,
       NOW() - INTERVAL '30 days',
       NOW() - INTERVAL '1 day'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@clinic.test');

INSERT INTO users (email, password_hash, full_name, phone, enabled, email_verified_at, last_login_at)
SELECT 'dr.smith@clinic.test',
       '$2b$10$QxQQSLqMQ4w0JAUOV9G9p.IqAtw6DjJqOQlk2XMXYnwifVZvfulwa',
       'Dr. John Smith',
       '0901000001',
       TRUE,
       NOW() - INTERVAL '21 days',
       NOW() - INTERVAL '2 days'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'dr.smith@clinic.test');

INSERT INTO users (email, password_hash, full_name, phone, enabled, email_verified_at, last_login_at)
SELECT 'alice.active@clinic.test',
       '$2b$10$gPvijTZJeuY93in.IQX/EeHkEgYZg7wUp8HnxNKvuc9SZeohhWtL2',
       'Alice Nguyen',
       '0901001001',
       TRUE,
       NOW() - INTERVAL '15 days',
       NOW() - INTERVAL '3 days'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'alice.active@clinic.test');

INSERT INTO users (email, password_hash, full_name, phone, enabled, email_verified_at, last_login_at)
SELECT 'bob.suspended@clinic.test',
       '$2b$10$gPvijTZJeuY93in.IQX/EeHkEgYZg7wUp8HnxNKvuc9SZeohhWtL2',
       'Bob Tran',
       '0901001002',
       FALSE,
       NOW() - INTERVAL '45 days',
       NOW() - INTERVAL '40 days'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'bob.suspended@clinic.test');

-- Map seeded users to their roles (idempotent inserts)
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
JOIN roles r ON r.code = 'ADMIN'
WHERE u.email = 'admin@clinic.test'
  AND NOT EXISTS (
    SELECT 1 FROM user_roles ur WHERE ur.user_id = u.id AND ur.role_id = r.id
);

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
JOIN roles r ON r.code = 'USER'
WHERE u.email = 'admin@clinic.test'
  AND NOT EXISTS (
    SELECT 1 FROM user_roles ur WHERE ur.user_id = u.id AND ur.role_id = r.id
);

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
JOIN roles r ON r.code = 'DOCTOR'
WHERE u.email = 'dr.smith@clinic.test'
  AND NOT EXISTS (
    SELECT 1 FROM user_roles ur WHERE ur.user_id = u.id AND ur.role_id = r.id
);

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
JOIN roles r ON r.code = 'USER'
WHERE u.email = 'dr.smith@clinic.test'
  AND NOT EXISTS (
    SELECT 1 FROM user_roles ur WHERE ur.user_id = u.id AND ur.role_id = r.id
);

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
JOIN roles r ON r.code = 'PATIENT'
WHERE u.email = 'alice.active@clinic.test'
  AND NOT EXISTS (
    SELECT 1 FROM user_roles ur WHERE ur.user_id = u.id AND ur.role_id = r.id
);

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
JOIN roles r ON r.code = 'PATIENT'
WHERE u.email = 'bob.suspended@clinic.test'
  AND NOT EXISTS (
    SELECT 1 FROM user_roles ur WHERE ur.user_id = u.id AND ur.role_id = r.id
);

-- Keep the users sequence aligned with the largest identifier
SELECT setval('users_id_seq', COALESCE((SELECT MAX(id) FROM users), 1));
