// Server-only: a small PocketBase client. The website's server code logs in once as the PocketBase superuser
// (PB_EMAIL / PB_PASSWORD secrets) and talks to PB_URL. Every collection is locked to that superuser, so browsers never reach the database.
import { env } from 'cloudflare:workers';

let cached = { token: '', at: 0 };

async function superToken(force = false) {
  if (!force && cached.token && Date.now() - cached.at < 20 * 60_000) return cached.token;
  if (!env.PB_URL || !env.PB_EMAIL || !env.PB_PASSWORD) throw new Error('PocketBase is not set up: PB_URL, PB_EMAIL and PB_PASSWORD are missing.');
  const res = await fetch(`${env.PB_URL}/api/collections/_superusers/auth-with-password`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ identity: env.PB_EMAIL, password: env.PB_PASSWORD })
  });
  if (!res.ok) throw new Error(`PocketBase login failed (${res.status}). Check PB_EMAIL and PB_PASSWORD.`);
  cached = { token: (await res.json()).token, at: Date.now() };
  return cached.token;
}

/** One request as the superuser. Returns parsed JSON (or null for 204). Throws Error with .status on failure. */
export async function pb(path, { method = 'GET', body, query } = {}) {
  const url = `${env.PB_URL}/api${path}${query ? '?' + new URLSearchParams(query) : ''}`;
  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await fetch(url, {
      method,
      headers: { authorization: await superToken(attempt > 0), ...(body ? { 'content-type': 'application/json' } : {}) },
      body: body ? JSON.stringify(body) : undefined
    });
    if (res.status === 401 && attempt === 0) continue; // token expired: log in again and retry once
    if (res.status === 204) return null;
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw Object.assign(new Error(data.message || `PocketBase error ${res.status}`), { status: res.status, data });
    return data;
  }
}

/** Safe filter: f('email = {:e} && disabled = false', { e: someEmail }). Values are quoted and escaped. */
export function f(template, params = {}) {
  return template.replace(/\{:(\w+)\}/g, (_, k) => {
    const v = params[k];
    return typeof v === 'number' || typeof v === 'boolean' ? String(v) : `'${String(v ?? '').replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
  });
}

export const records = {
  /** Array of records. opts: { filter, sort, limit, fields } */
  async list(col, { filter, sort, limit = 500, fields } = {}) {
    const q = { perPage: String(limit), skipTotal: '1' };
    if (filter) q.filter = filter;
    if (sort) q.sort = sort;
    if (fields) q.fields = fields;
    return (await pb(`/collections/${col}/records`, { query: q })).items;
  },
  async first(col, filter, sort) {
    return (await this.list(col, { filter, sort, limit: 1 }))[0] ?? null;
  },
  async count(col, filter) {
    return (await pb(`/collections/${col}/records`, { query: { perPage: '1', ...(filter ? { filter } : {}) } })).totalItems;
  },
  get: (col, id) => pb(`/collections/${col}/records/${encodeURIComponent(id)}`).catch((e) => (e.status === 404 ? null : Promise.reject(e))),
  create: (col, body) => pb(`/collections/${col}/records`, { method: 'POST', body }),
  update: (col, id, body) => pb(`/collections/${col}/records/${encodeURIComponent(id)}`, { method: 'PATCH', body }),
  remove: (col, id) => pb(`/collections/${col}/records/${encodeURIComponent(id)}`, { method: 'DELETE' }).catch((e) => (e.status === 404 ? null : Promise.reject(e)))
};
