// One-time copy of the old Cloudflare D1 data into PocketBase.
//   PB_URL=https://pb.programsforyou.com PB_EMAIL=... PB_PASSWORD=... node pocketbase/import-d1.mjs
// Needs `npx wrangler login` (it reads the remote D1 database "programsforyou"). Safe to run twice: rows that already exist are skipped.
// User accounts are NOT copied (passwords were hashed differently). Log in with ADMIN_PASSWORD to make the first Admin 1, then invite the others.
import { execFileSync } from 'node:child_process';

const { PB_URL, PB_EMAIL, PB_PASSWORD } = process.env;
if (!PB_URL || !PB_EMAIL || !PB_PASSWORD) throw new Error('Set PB_URL, PB_EMAIL and PB_PASSWORD.');

const d1 = (sql) => {
  try {
    return JSON.parse(execFileSync('npx', ['wrangler', 'd1', 'execute', 'programsforyou', '--remote', '--json', '--command', sql], { encoding: 'utf8', maxBuffer: 1 << 26, stdio: ['ignore', 'pipe', 'pipe'] }))[0].results;
  } catch (e) {
    if (/no such table/.test(String(e.stdout))) return []; // a migration that was never applied to the old database: nothing to copy
    throw e;
  }
};
const api = async (path, opts = {}, token) => {
  const res = await fetch(`${PB_URL}/api${path}`, { ...opts, headers: { 'content-type': 'application/json', ...(token ? { authorization: token } : {}) } , body: opts.body && JSON.stringify(opts.body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${path}: ${res.status} ${JSON.stringify(data)}`);
  return data;
};
const { token } = await api('/collections/_superusers/auth-with-password', { method: 'POST', body: { identity: PB_EMAIL, password: PB_PASSWORD } });
const date = (s) => (s ? `${s}.000Z` : '');
const exists = async (col, filter) => (await api(`/collections/${col}/records?perPage=1&filter=${encodeURIComponent(filter)}`, {}, token)).totalItems > 0;
const q = (v) => `'${String(v).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;

const plan = [
  ['tickets', 'SELECT * FROM tickets', (r) => `ticket_id = ${q(r.id)}`, (r) => ({ ticket_id: r.id, name: r.name, email: r.email, app: r.app, summary: r.summary, confirmation_sent: false })],
  ['applications', 'SELECT * FROM applications', (r) => `email = ${q(r.email)} && why = ${q(r.why)}`, (r) => ({ name: r.name, email: r.email, grade: r.grade, role: r.role, department: r.department, why: r.why, skills: r.skills ?? '', read_at: date(r.read_at), confirmation_sent: false })],
  ['people', 'SELECT * FROM people', (r) => `name = ${q(r.name ?? '')} && title = ${q(r.title)}`, (r) => ({ sort: r.sort, name: r.name ?? '', initials: r.initials ?? '', g1: r.g1, g2: r.g2, title: r.title, note: r.note ?? '', founder: !!r.founder, soon: !!r.soon })],
  ['volunteers', 'SELECT * FROM volunteers', (r) => `email = ${q(r.email.toLowerCase())}`, (r) => ({ name: r.name, email: r.email.toLowerCase(), grade: r.grade ?? '', department: r.department, note: r.note ?? '', listed: !!r.listed })],
  ['push_subscriptions', 'SELECT * FROM push_subscriptions', (r) => `endpoint = ${q(r.endpoint)}`, (r) => ({ endpoint: r.endpoint, p256dh: r.p256dh, auth: r.auth })],
  ['downloads', 'SELECT * FROM downloads', (r) => `file = ${q(r.file)}`, (r) => ({ file: r.file, count: r.count, last_at: date(r.last_at) })]
];

for (const [col, sql, where, map] of plan) {
  let made = 0, skipped = 0;
  for (const row of d1(sql)) {
    if (await exists(col, where(row))) { skipped++; continue; }
    const rec = await api(`/collections/${col}/records`, { method: 'POST', body: map(row) }, token);
    // Keep the original "created" time, so the admin page still sorts in the right order.
    if (row.created_at && ['tickets', 'applications', 'volunteers', 'push_subscriptions'].includes(col)) await api(`/collections/${col}/records/${rec.id}`, { method: 'PATCH', body: { created_at: date(row.created_at) } }, token);
    made++;
  }
  console.log(`${col}: ${made} copied, ${skipped} already there`);
}
