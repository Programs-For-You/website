// The people on the Founders page (/founders) and the Team page (/team). Edit these lists to change them.
// Only list someone by name after they've said it's OK to be on the website.
// A spot with `soon: true` (and no name) shows "Coming soon" with an empty dashed circle.
// Fields: name, initials, g1/g2 (avatar gradient colours), title, note (optional).

const BK = { name: 'Brady Krupa', initials: 'BK', g1: '#4f46e5', g2: '#9333ea' };
const AB = { name: 'Arjun Bhanderi', initials: 'AB', g1: '#0284c7', g2: '#6366f1' };
const SA = { name: 'Sid Agrawal', initials: 'SA', g1: '#65a30d', g2: '#0d9488' };
const EK = { name: 'Ethan Krishna', initials: 'EK', g1: '#0d9488', g2: '#0284c7' };

// Founders page: the big founder boxes, with the "Why we started" quote between the first two.
export const FOUNDERS = [
  { ...BK, title: 'CEO & Founder', note: 'Leads the company and decides what we build next.' },
  { ...AB, title: 'Co-Founder & CFO', note: 'Keeps track of the money.' }
];

export const WHY_WE_STARTED =
  'Every school day we saw the same small problems: losing track of what period it is, homework piling up, ' +
  'and an inbox nobody has time for. The apps that could help were expensive, complicated, or not made for students. ' +
  'So we built our own: simple, free tools that each do one job well. We want to keep making things that give people ' +
  'a little more time and a little less stress.';

// Founders page: the Board of Trustees, shown as seats around a table.
export const BOARD = [
  { ...BK, title: 'CEO & Founder' },
  { ...AB, title: 'Co-Founder & CFO' },
  { ...SA, title: 'Board Member & CTO' },
  { ...EK, title: 'Head of Development & CAIO' }
];

// Team page: Heads of Departments, each with its co-heads underneath.
// icon: code | share | megaphone | cup.  note: what the department does (the head's own note wins if it has one).
export const DEPARTMENTS = [
  {
    dept: 'Development', icon: 'code', note: 'Builds the apps.',
    head: { soon: true, g1: '#0d9488', g2: '#0284c7', title: 'Head of Development' },
    coHeads: [{ soon: true, title: 'Co-Head of Development' }]
  },
  {
    dept: 'Social Media', icon: 'share', note: 'Runs our social media.',
    head: { soon: true, g1: '#e11d48', g2: '#f97316', title: 'Head of Social Media' },
    coHeads: [{ soon: true, title: 'Co-Head of Social Media' }]
  },
  {
    dept: 'Advertising', icon: 'megaphone', note: 'Spreads the word about our apps.',
    head: { soon: true, g1: '#7c3aed', g2: '#db2777', title: 'Head of Advertising' },
    coHeads: [{ soon: true, title: 'Co-Head of Advertising' }]
  },
  {
    dept: 'Hospitality', icon: 'cup', note: 'Makes sure everyone feels welcome.',
    head: { soon: true, g1: '#d97706', g2: '#dc2626', title: 'Head of Hospitality' },
    coHeads: [{ soon: true, title: 'Co-Head of Hospitality' }]
  }
];

// Team page: Employees & Interns (the section hides while this is empty; people apply on /apply).
export const STAFF = [];

// Everyone named above, once each (for the "people on the team" count).
export const NAMED = [...new Set([...FOUNDERS, ...BOARD, ...DEPARTMENTS.flatMap((d) => [d.head, ...d.coHeads]), ...STAFF]
  .filter((p) => p.name).map((p) => p.name))];
