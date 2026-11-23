import { PAGES } from '#lib/pages.js';
import { SITE } from '#lib/config.js';

export const prerender = true;

// Generated at build time from the page list, so a new page only has to be added in lib/pages.js.
// No <lastmod>: stamping every page with the build date isn't true, and search engines learn to ignore sites that do that.
export function GET() {
  const urls = PAGES.map((p) => `  <url>\n    <loc>${SITE.url}${p.path === '/' ? '/' : p.path}</loc>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority.toFixed(1)}</priority>\n  </url>`).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
