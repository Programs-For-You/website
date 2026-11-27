import { getDb } from '#lib/server.js';

export const prerender = false;

// Only volunteers who said it's OK (listed) are shown, and only their name and team.
export async function load({ setHeaders }) {
  const { results } = await getDb().prepare('SELECT name, department FROM volunteers WHERE listed = 1 ORDER BY department, name').all();
  setHeaders({ 'cache-control': 'public, max-age=0, s-maxage=60' });
  return { volunteers: results };
}
