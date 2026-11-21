// Structured data (JSON-LD) builders. Search engines use it for rich results; answer engines and AI assistants
// use it to quote facts (who we are, what each app does, the FAQ) accurately.
import { SITE, APPS, GAMES } from './config.js';
import { PAGES } from './pages.js';

export const abs = (path = '/') => { const p = path.replace(/\.html$/, ''); return SITE.url + (p === '/' ? '/' : p); };
const ID = { org: SITE.url + '/#organization', site: SITE.url + '/#website' };

export const organization = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': ID.org,
  name: SITE.name,
  url: SITE.url + '/',
  logo: { '@type': 'ImageObject', url: SITE.url + '/assets/img/logo.svg' },
  image: SITE.url + '/og.png',
  description: 'Programs For You makes free, simple apps that save students time: Email Assistant and Screen Assistant for Mac, plus games for the TI-84 Evo calculator. School Schedule is coming soon.',
  foundingDate: '2026',
  founder: [
    { '@type': 'Person', name: 'Brady Krupa', jobTitle: 'CEO & Founder', url: abs('/team') }
  ],
  contactPoint: [{ '@type': 'ContactPoint', contactType: 'customer support', email: SITE.contactEmail, telephone: '+1-475-266-1457', availableLanguage: 'English', url: abs('/contact') }]
});

export const website = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': ID.site,
  url: SITE.url + '/',
  name: SITE.name,
  inLanguage: 'en-US',
  publisher: { '@id': ID.org }
});

export const breadcrumbs = (path, title) => {
  const name = PAGES.find((p) => p.path === path)?.name ?? title;
  const items = [{ name: 'Home', path: '/' }];
  if (path !== '/') items.push({ name, path });
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: abs(it.path) }))
  };
};

/** The page itself. type: WebPage | AboutPage | ContactPage | CollectionPage | FAQPage */
export const webPage = ({ path, title, description, type = 'WebPage' }) => ({
  '@context': 'https://schema.org',
  '@type': type,
  '@id': abs(path) + '#webpage',
  url: abs(path),
  name: title,
  description,
  inLanguage: 'en-US',
  isPartOf: { '@id': ID.site },
  publisher: { '@id': ID.org },
  primaryImageOfPage: { '@type': 'ImageObject', url: SITE.url + '/og.png' }
});

export const faqPage = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }))
});

/** HowTo steps: [{ name, text }] */
export const howTo = ({ name, description, steps, path }) => ({
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name,
  description,
  url: abs(path),
  totalTime: 'PT5M',
  step: steps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s.name, text: s.text, }))
});

/** SoftwareApplication for an app id from config.js (price, version, platforms, download). */
export const softwareApp = (id) => {
  const a = APPS.find((x) => x.id === id);
  if (!a) return null;
  const ready = a.status === 'available' && a.file;
  const win = a.windows?.status === 'available';
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': abs(a.page) + '#app',
    name: a.name,
    description: a.blurb,
    url: abs(a.page),
    image: SITE.url + a.icon,
    applicationCategory: id === 'school-schedule' ? 'EducationalApplication' : 'ProductivityApplication',
    operatingSystem: win ? 'macOS, Windows' : 'macOS',
    softwareRequirements: a.requires,
    ...(ready ? { softwareVersion: a.version, fileSize: a.size, downloadUrl: SITE.url + a.file } : {}),
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', availability: ready ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder' },
    publisher: { '@id': ID.org },
    ...(a.license ? { license: 'https://www.gnu.org/licenses/agpl-3.0.html' } : {})
  };
};

/** The TI-84 Evo games as a list of game apps. */
export const gamesList = () => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'TI-84 Evo games',
  itemListElement: GAMES.map((g, i) => ({
    '@type': 'ListItem', position: i + 1,
    item: {
      '@type': 'SoftwareApplication', name: g.name, description: g.blurb, applicationCategory: 'GameApplication',
      operatingSystem: 'TI-84 Evo (Python)', isAccessibleForFree: true, image: SITE.url + g.icon,
      ...(g.file ? { downloadUrl: SITE.url + g.file, fileSize: g.size } : {}),
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
    }
  }))
});
