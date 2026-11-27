-- Download counter: one row per file, bumped by /get/<file> before it redirects to /downloads/<file>.
CREATE TABLE downloads (
  file    TEXT PRIMARY KEY,
  count   INTEGER NOT NULL DEFAULT 0,
  last_at TEXT
);
