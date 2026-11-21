// Every public page: used for the sitemap, llms.txt and breadcrumbs.
// priority/changefreq are hints for search engines. `index: false` pages stay out of the sitemap.
export const PAGES = [
  { path: '/', name: 'Home', desc: 'Free Mac apps that make a student’s day easier.', priority: 1.0, changefreq: 'weekly' },
  { path: '/school-calendar', name: 'School Calendar', desc: 'A live class countdown, the whole school year on one calendar, and homework with reminders. Part of Programs For You.', priority: 0.9, changefreq: 'weekly' },
  { path: '/email-assistant', name: 'Email Assistant', desc: 'Once a day, a card sums up your email and helps you reply with one click.', priority: 0.9, changefreq: 'weekly' },
  { path: '/screen-assistant', name: 'Screen Assistant', desc: 'Press Option-Space and an assistant looks at your screen to summarize, explain, make to-dos or quiz you.', priority: 0.9, changefreq: 'weekly' },
  { path: '/ti-84-evo-games', name: 'TI-84 Evo Games', desc: 'Free Python games for the TI-84 Evo graphing calculator: Grid Pop, Block Bop and Blackjack.', priority: 0.7, changefreq: 'monthly' },
  { path: '/download', name: 'Downloads', desc: 'Download Programs For You. No email needed.', priority: 0.9, changefreq: 'weekly' },
  { path: '/install', name: 'How to install', desc: 'Step-by-step install guide for Mac.', priority: 0.8, changefreq: 'monthly' },
  { path: '/founders', name: 'Founders', desc: 'Our founders, why we started, and our Board of Trustees.', priority: 0.6, changefreq: 'monthly' },
  { path: '/team', name: 'Team', desc: 'Our department heads and co-heads.', priority: 0.6, changefreq: 'monthly' },
  { path: '/apply', name: 'Join the team', desc: 'Apply to join as an intern or employee.', priority: 0.5, changefreq: 'monthly' },
  { path: '/contact', name: 'Contact', desc: 'Send a support ticket or call (475) 266-1457.', priority: 0.6, changefreq: 'yearly' },
  { path: '/terms', name: 'Terms of Service', desc: 'The terms for using the website and apps.', priority: 0.3, changefreq: 'yearly' },
  { path: '/privacy', name: 'Privacy Policy', desc: 'How your information is handled.', priority: 0.3, changefreq: 'yearly' },
];
