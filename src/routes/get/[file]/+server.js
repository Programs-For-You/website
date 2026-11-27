import { redirect, error } from '@sveltejs/kit';
import { getDb } from '#lib/server.js';
import { APPS, MAC_APP } from '#lib/config.js';

export const prerender = false;

// Every file that is allowed to be counted (so nobody can fill the table with made-up names).
const FILES = new Set([...(APPS ?? []).map((a) => a.file), MAC_APP.file, ...['GRIDPOP.py', 'BLOCKBOP.py', 'BLACKJAK.py'].map((n) => `/downloads/${n}`)].filter(Boolean).map((p) => p.replace('/downloads/', '')));

/** Counts one download, then sends the browser to the real file. A counting failure never blocks the download. */
export async function GET({ params, request }) {
  if (!FILES.has(params.file)) error(404, 'Not found');
  // Browsers ask for the file in pieces or preview it; only count a normal fresh request.
  if (!request.headers.get('range')) {
    try {
      await getDb().prepare("INSERT INTO downloads (file, count, last_at) VALUES (?, 1, datetime('now')) ON CONFLICT(file) DO UPDATE SET count = count + 1, last_at = datetime('now')").bind(params.file).run();
    } catch (e) {
      console.error('download count failed', e?.message ?? e);
    }
  }
  redirect(302, `/downloads/${params.file}`);
}
