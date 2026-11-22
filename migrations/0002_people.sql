-- People shown on /founders. Edit rows (dashboard or `wrangler d1 execute`) to change the page; no redeploy needed.
-- section: 'founder' (big cards) or 'board' (Board of Trustees seats). sort: lowest first.
-- soon = 1 shows an empty "Coming soon" spot (name/initials can be NULL).
CREATE TABLE people (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  section  TEXT NOT NULL CHECK (section IN ('founder', 'board')),
  sort     INTEGER NOT NULL DEFAULT 0,
  name     TEXT,
  initials TEXT,
  g1       TEXT NOT NULL DEFAULT '#15803d',  -- avatar gradient colours
  g2       TEXT NOT NULL DEFAULT '#0f766e',
  title    TEXT NOT NULL,
  note     TEXT,
  soon     INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX people_section_sort ON people (section, sort);

INSERT INTO people (section, sort, name, initials, g1, g2, title, note) VALUES
  ('founder', 1, 'Brady Krupa',    'BK', '#15803d', '#0f766e', 'CEO & Founder',                'Leads the company and decides what we build next.'),
  ('founder', 2, 'Arjun Bhanderi', 'AB', '#a16207', '#4d7c0f', 'Co-Founder & CFO',             'Keeps track of the money.');

INSERT INTO people (section, sort, name, initials, g1, g2, title) VALUES
  ('board', 1, 'Brady Krupa',    'BK', '#15803d', '#0f766e', 'CEO & Founder'),
  ('board', 2, 'Arjun Bhanderi', 'AB', '#a16207', '#4d7c0f', 'Co-Founder & CFO'),
  ('board', 3, 'Sid Agrawal',    'SA', '#65a30d', '#0d9488', 'Head of Website Development & CTO'),
  ('board', 4, 'Ethan Krishna',  'EK', '#0d9488', '#0284c7', 'Head of App Development & CAIO'),
  ('board', 5, 'Adam Johnson',   'AJ', '#d97706', '#dc2626', 'Head of Hospitality & CMO');
