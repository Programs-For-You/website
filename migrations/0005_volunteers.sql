-- Volunteers. `listed` = 1 only after the person said it's OK to show their name on /volunteers.
CREATE TABLE volunteers (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  grade      TEXT,
  department TEXT NOT NULL,
  note       TEXT,
  listed     INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
