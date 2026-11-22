import { getDb } from '#lib/server.js';

// Read from D1 on each request, so edits to the people table show up without a redeploy.
export const prerender = false;

export async function load({ setHeaders }) {
  const { results } = await getDb()
    .prepare('SELECT section, name, initials, g1, g2, title, note, soon FROM people ORDER BY (section = \'founder\') DESC, sort, id')
    .all();
  // Short cache so the table isn't hit on every page view.
  setHeaders({ 'cache-control': 'public, max-age=0, s-maxage=60' });
  // Everyone once: founders first, then the rest of the board. (Founders are also board rows.)
  const seen = new Set();
  const members = [];
  for (const r of results) {
    if (r.name) { if (seen.has(r.name)) continue; seen.add(r.name); }
    members.push({ ...r, soon: Boolean(r.soon), founder: r.section === 'founder' });
  }
  return { members };
}
