-- Applications are never deleted; admins mark them read instead.
ALTER TABLE applications ADD COLUMN read_at TEXT;
