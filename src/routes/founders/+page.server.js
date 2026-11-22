import { getDb } from '#lib/server.js';

// Read from D1 on each request, so edits to the people table show up without a redeploy.
export const prerender = false;

export async function load({ setHeaders }) {
  const { results } = await getDb()
    .prepare('SELECT section, name, initials, g1, g2, title, note, soon FROM people ORDER BY sort, id')
    .all();
  // Short cache so the table isn't hit on every page view.
  setHeaders({ 'cache-control': 'public, max-age=0, s-maxage=60' });
  const person = (r) => ({ ...r, soon: Boolean(r.soon) });
  return {
    founders: results.filter((r) => r.section === 'founder').map(person),
    board: results.filter((r) => r.section === 'board').map(person)
  };
}
