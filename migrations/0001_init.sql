CREATE TABLE tickets (
  id         TEXT PRIMARY KEY,           -- e.g. PFY-7K3Q2
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  app        TEXT NOT NULL,
  summary    TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE applications (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  grade      TEXT NOT NULL,
  role       TEXT NOT NULL,
  department TEXT NOT NULL,
  why        TEXT NOT NULL,
  skills     TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
