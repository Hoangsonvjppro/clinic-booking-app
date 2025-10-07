-- Add description column to roles table
ALTER TABLE roles ADD COLUMN IF NOT EXISTS description varchar(255);