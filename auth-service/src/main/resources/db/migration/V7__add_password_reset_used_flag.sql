ALTER TABLE password_reset_tokens
    ADD COLUMN IF NOT EXISTS used BOOLEAN NOT NULL DEFAULT FALSE;

-- Nếu cột used_at đã có giá trị (đã sử dụng), cập nhật cờ used tương ứng
UPDATE password_reset_tokens
SET used = TRUE
WHERE used_at IS NOT NULL;
