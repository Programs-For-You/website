import { records } from '#lib/pb.js';

export const prerender = false;

// Only volunteers who said it's OK (listed) are shown, and only their name and team.
export async function load({ setHeaders }) {
  const results = await records.list('volunteers', { filter: 'listed = true', sort: 'department,name', fields: 'name,department' });
  setHeaders({ 'cache-control': 'public, max-age=0, s-maxage=60' });
  return { volunteers: results };
}
