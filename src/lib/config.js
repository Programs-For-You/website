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

// Your apps. Each one has a Mac download, plus a Windows download in `windows`.
// When an app is ready (or updated):
//   1. Put its .zip file in website/downloads/ (apps/build.sh does this)
//   2. Change status to 'available' and fill in version, file, and size.
//   3. history = the Mac update notes, newest first: what each version FIXED and what it ADDED (short, plain words).
//      apps/release.sh adds one for every update. They show on the app pages, the Downloads page, the update
//      window, and the app's What's New card after it updates. /updates.json is made from this list by
//      tools/build_pages.py. (Windows versions don't get these updates, so the notes are Mac only.)
export const APPS = [
  {
    id: 'school-schedule',
    name: 'School Schedule',
    blurb: 'Always know what period it is, how many minutes are left, and what homework is due.',
    icon: '/assets/img/school-schedule.svg',
    page: '/school-schedule',
    status: 'available',
    // School Schedule is part of Programs For You (in the app it's the School Calendar tab): this downloads that one app.
    version: '1.1.0',
    file: '/downloads/ProgramsForYou-1.1.0.zip',
    size: '4.5 MB',
    history: [
      { version: '1.1.0', fixed: 'Uses much less battery: the class countdown updates once a minute instead of every second.', added: 'A new look that matches programsforyou.com, with Dark, Light, and five accent colors. School Calendar: type each class once, minis, your Schoology calendar for days off, a class bar in the corner, quick-note homework, and a study plan.' },
      { version: '1.0.0', fixed: '', added: 'Back as part of Programs For You: one app with School Schedule, Email Assistant, and Screen Assistant inside. Updates only when you click Check for Updates.' },
    ],
    requires: 'macOS 14 Sonoma or newer, on a Mac with Apple silicon or Intel',
    windows: { status: 'coming-soon' },
  },
  {
    id: 'email-assistant',
    name: 'Email Assistant',
    blurb: 'Once a day, a little card sums up your email and helps you reply with one click.',
    icon: '/assets/img/email-assistant.svg',
    page: '/email-assistant',
    status: 'available',
    // Email Assistant is part of Programs For You now: this downloads that one app.
    version: '1.1.0',
    file: '/downloads/ProgramsForYou-1.1.0.zip',
    size: '4.5 MB',
    history: [
      { version: '1.1.0', fixed: 'Uses much less battery: the class countdown updates once a minute instead of every second.', added: 'A new look that matches programsforyou.com, with Dark, Light, and five accent colors. School Calendar: type each class once, minis, your Schoology calendar for days off, a class bar in the corner, quick-note homework, and a study plan.' },
      { version: '1.0.0', fixed: '', added: 'Now part of Programs For You: one app with School Calendar, Email Assistant, and Screen Assistant inside. Updates only when you click Check for Updates.' },
      { version: '1.2.3', fixed: 'It now opens with a welcome card instead of Settings when you haven’t added an email yet.', added: 'On screen: open any email, even school email, and it reads that email and writes replies for you to copy and paste. Settings now say clearly that the daily summary works with personal email only.' },
    ],
    requires: 'macOS 26 Tahoe or newer · Mac with Apple silicon (M1 or later)',
    windows: { status: 'coming-soon' },   // the Windows version is being built
  },
  {
    id: 'screen-assistant',
    name: 'Screen Assistant',
    blurb: 'Press Option-Space and a personal assistant looks at your screen to summarize, explain, make to-dos, or quiz you.',
    icon: '/assets/img/screen-assistant.svg',
    page: '/screen-assistant',
    status: 'available',
    // Screen Assistant is part of Programs For You now: this downloads that one app.
    version: '1.1.0',
    file: '/downloads/ProgramsForYou-1.1.0.zip',
    size: '4.5 MB',
    history: [
      { version: '1.1.0', fixed: 'Uses much less battery: the class countdown updates once a minute instead of every second.', added: 'A new look that matches programsforyou.com, with Dark, Light, and five accent colors. School Calendar: type each class once, minis, your Schoology calendar for days off, a class bar in the corner, quick-note homework, and a study plan.' },
      { version: '1.0.0', fixed: '', added: 'Now part of Programs For You: one app with School Calendar, Email Assistant, and Screen Assistant inside. Updates only when you click Check for Updates.' },
      { version: '1.1.2', fixed: 'Automatic updates are more reliable: they also check right after your Mac wakes up.', added: 'If the app is running from your Downloads folder, it offers to move itself to Applications so it can keep updating.' },
    ],
    requires: 'macOS 26 Tahoe or newer · Mac with Apple silicon (M1 or later)',
    windows: { status: 'coming-soon' },   // the Windows version is being built
  },
];

// The Mac app: one download with School Schedule, Email Assistant, and Screen Assistant inside.
// Shown near the top of the home page (#download). For a new version: build it with apps/build.sh hub on the Mac
// that has the Programs For You signing certificate, put the .zip in static/downloads/, then change version,
// file, and size here. Only ever link a build signed with the certificate (never a test build).
// Countdown on the School Schedule page. Change `at` (with a timezone offset) to move the launch time.
export const SCHEDULE_LAUNCH = {
  version: '1.0.0',
  at: '2026-11-29T18:00:00-05:00',
  label: 'Sunday, November 29 at 6:00 PM Eastern',
};

export const MAC_APP = {
  id: 'programs-for-you',
  name: 'Programs For You for Mac',
  status: 'available',   // 'available' or 'coming-soon'
  version: '1.1.0',
  file: '/downloads/ProgramsForYou-1.1.0.zip',
  size: '4.5 MB',
  icon: '/favicon.svg',
  requires: 'macOS 14 Sonoma or newer, on Apple silicon or Intel. Email Assistant and Screen Assistant need macOS 26 Tahoe on a Mac with Apple silicon (M1 or later).',
};

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
