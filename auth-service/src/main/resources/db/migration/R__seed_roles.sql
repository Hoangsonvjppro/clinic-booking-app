INSERT INTO roles(code, display_name, description) VALUES
  ('ADMIN','Administrator','System admin'),
  ('USER','User','Basic authenticated user')
ON CONFLICT (code) DO NOTHING;
