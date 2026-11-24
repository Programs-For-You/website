-- One account per admin. pw_hash is NULL until they open their invite link and choose a password.
CREATE TABLE users (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  email        TEXT NOT NULL UNIQUE,          -- stored lowercase
  name         TEXT NOT NULL,
  -- admin1 = everything. admin2 = only Messages and Applications. Both get the email notifications.
  role         TEXT NOT NULL CHECK (role IN ('admin1', 'admin2')),
  pw_hash      TEXT,                          -- pbkdf2$iterations$salt$hash
  disabled     INTEGER NOT NULL DEFAULT 0,
  failed       INTEGER NOT NULL DEFAULT 0,    -- wrong passwords in a row
  locked_until INTEGER NOT NULL DEFAULT 0,    -- unix seconds
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Logged-in browsers. Only a hash of the cookie value is stored, so a leaked table can't be used to log in.
CREATE TABLE sessions (
  token_hash TEXT PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL
);
CREATE INDEX sessions_user ON sessions(user_id);

-- Invite and password-reset links (also stored as hashes).
CREATE TABLE tokens (
  token_hash TEXT PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kind       TEXT NOT NULL CHECK (kind IN ('invite', 'reset')),
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE INDEX tokens_user ON tokens(user_id);
