-- Newsletter signups. `token` is the private key in each email's unsubscribe link.
CREATE TABLE subscribers (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  email        TEXT NOT NULL UNIQUE,            -- stored lowercase
  token        TEXT NOT NULL UNIQUE,
  unsubscribed INTEGER NOT NULL DEFAULT 0,
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);
