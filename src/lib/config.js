// © 2026 Programs For You. All rights reserved.
// ─────────────────────────────────────────────────────────────
//  Site settings. Change something here and every page updates.
// ─────────────────────────────────────────────────────────────

export const SITE = {
  name: 'Programs For You',
  domain: 'programsforyou.com',
  url: 'https://programsforyou.com',
  // The email people use to contact you. Change it to a real inbox you check.
  contactEmail: 'bradykrupa@programsforyou.com',
  // Turn on after you get the $99/year Apple Developer account.
  appleSignIn: false,
};

// The one app people download: Programs For You, with School Calendar, Email Assistant, and Screen Assistant inside.
// When there's a new version: put its .zip in static/downloads/, update version, file, size, and history (newest first:
// what it FIXED and what it ADDED, in short plain words), and add the same version to static/updates.json.
export const APP = {
  id: 'programs-for-you',
  name: 'Programs For You',
  blurb: 'One app with School Calendar, Email Assistant, and Screen Assistant inside.',
  icon: '/assets/img/logo.svg',
  page: '/download',
  status: 'available',
  version: '1.0.0',
  file: '/downloads/ProgramsForYou-1.0.0.zip',
  size: '3.6 MB',
  requires: 'macOS 14 Sonoma or newer. Email Assistant and Screen Assistant need macOS 26 Tahoe or newer on a Mac with Apple silicon (M1 or later).',
  history: [
    { version: '1.0.0', fixed: '', added: 'School Calendar, Email Assistant, and Screen Assistant are now one app. School Calendar is new: a live countdown to the end of class, the whole school year on one calendar, and your homework with reminders. Updates only happen when you click Check for Updates.' },
  ],
};

// The tools inside Programs For You. Each has its own page; they all download as Programs For You.
export const APPS = [
  {
    id: 'school-calendar',
    name: 'School Calendar',
    blurb: 'A live countdown to the end of class, the whole school year on one calendar, and your homework with reminders.',
    icon: '/assets/img/school-schedule.svg',
    page: '/school-calendar',
    status: 'available',
    file: APP.file,
    requires: 'macOS 14 Sonoma or newer',
  },
  {
    id: 'email-assistant',
    name: 'Email Assistant',
    blurb: 'Once a day, a little card sums up your email and helps you reply with one click.',
    icon: '/assets/img/email-assistant.svg',
    page: '/email-assistant',
    status: 'available',
    file: APP.file,
    requires: 'macOS 26 Tahoe or newer · Mac with Apple silicon (M1 or later)',
  },
  {
    id: 'screen-assistant',
    name: 'Screen Assistant',
    blurb: 'Press Option-Space and a personal assistant looks at your screen to summarize, explain, make to-dos, or quiz you.',
    icon: '/assets/img/screen-assistant.svg',
    page: '/screen-assistant',
    status: 'available',
    file: APP.file,
    requires: 'macOS 26 Tahoe or newer · Mac with Apple silicon (M1 or later)',
  },
];

// TI-84 Evo calculator games (Python). They say "Coming soon" until their status is 'available'.
// To release one: copy its .py file from calculator/games/ into website/downloads/, then change
// status to 'available'. (Or ask Claude to release it.)
export const GAMES = [
  {
    id: 'gridpop',
    name: 'Grid Pop',
    blurb: 'Drop shapes on the 8 by 8 board and fill whole rows or columns to clear them. Clear several at once for big points.',
    icon: '/assets/img/gridpop.svg',
    page: '/ti-84-evo-games',
    status: 'available',
    file: '/downloads/GRIDPOP.py',
    size: '9 KB',
    requires: 'TI-84 Evo (Python)',
  },
  {
    id: 'blockbop',
    name: 'Block Bop',
    blurb: 'Bounce the ball off your paddle to break every brick. Silver bricks take two hits.',
    icon: '/assets/img/blockbop.svg',
    page: '/ti-84-evo-games',
    status: 'available',
    file: '/downloads/BLOCKBOP.py',
    size: '11 KB',
    requires: 'TI-84 Evo (Python)',
  },
  {
    id: 'blackjack',
    name: 'Blackjack',
    blurb: 'Beat the dealer to 21 without going over. Bet your chips, hit, stand, or double down.',
    icon: '/assets/img/blackjack.svg',
    page: '/ti-84-evo-games',
    status: 'available',
    file: '/downloads/BLACKJAK.py',
    size: '8 KB',
    requires: 'TI-84 Evo (Python)',
  },
];
