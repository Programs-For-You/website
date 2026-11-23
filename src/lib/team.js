// Founders and the Board are in the D1 `people` table (migrations/0002_people.sql). This file keeps the "Why we started" quote and the department lists.
// Only list someone by name after they've said it's OK to be on the website.
// A spot with `soon: true` (and no name) shows "Coming soon" with an empty dashed circle.
// Fields: name, initials, g1/g2 (avatar gradient colours), title, note (optional).

export const WHY_WE_STARTED =
  'Every school day we saw the same small problems: losing track of what period it is, homework piling up, ' +
  'and an inbox nobody has time for. The apps that could help were expensive, complicated, or not made for students. ' +
  'So we built our own: simple, free tools that each do one job well. We want to keep making things that give people ' +
  'a little more time and a little less stress.';

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
