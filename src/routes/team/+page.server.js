import { records } from '#lib/pb.js';

// Read from PocketBase on each request, so edits to the people table show up without a redeploy.
export const prerender = false;

export async function load({ setHeaders }) {
  const results = await records.list('people', { sort: 'sort,id', fields: 'name,initials,g1,g2,title,note,founder,soon' });
  // Short cache so the table isn't hit on every page view.
  setHeaders({ 'cache-control': 'public, max-age=0, s-maxage=60' });
  return { members: results.map((r) => ({ ...r, founder: Boolean(r.founder), soon: Boolean(r.soon) })) };
}
