-- One row per person. `founder` replaces the duplicate founder/board rows; `sort` is the display order.
CREATE TABLE people_new (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  sort     INTEGER NOT NULL DEFAULT 0,
  name     TEXT,                              -- NULL for an open "Coming soon" spot
  initials TEXT,
  g1       TEXT NOT NULL DEFAULT '#15803d',   -- avatar gradient colours
  g2       TEXT NOT NULL DEFAULT '#0f766e',
  title    TEXT NOT NULL,
  note     TEXT,
  founder  INTEGER NOT NULL DEFAULT 0,        -- 1 = founder badge + quoted under "Why we started"
  soon     INTEGER NOT NULL DEFAULT 0         -- 1 = empty "Coming soon" spot
);

-- Everyone from the board (the founders are on it too); take the note from their founder row.
INSERT INTO people_new (sort, name, initials, g1, g2, title, note, founder, soon)
SELECT b.sort, b.name, b.initials, b.g1, b.g2, b.title,
       COALESCE(f.note, b.note),
       f.id IS NOT NULL, b.soon
FROM people b
LEFT JOIN people f ON f.section = 'founder' AND f.name = b.name
WHERE b.section = 'board';

-- Founders who are not on the board.
INSERT INTO people_new (sort, name, initials, g1, g2, title, note, founder, soon)
SELECT f.sort, f.name, f.initials, f.g1, f.g2, f.title, f.note, 1, f.soon
FROM people f
WHERE f.section = 'founder'
  AND NOT EXISTS (SELECT 1 FROM people b WHERE b.section = 'board' AND b.name = f.name);

DROP TABLE people;
ALTER TABLE people_new RENAME TO people;
CREATE INDEX people_sort ON people (sort, id);
