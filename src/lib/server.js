// Server-only helpers for /api routes.
import { json } from '@sveltejs/kit';
import { env } from 'cloudflare:workers';

export const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Trim a form value and cap its length. Missing values become ''.
export const str = (v, max) => String(v ?? '').trim().slice(0, max);

// The D1 binding "DB" from wrangler.jsonc. Under `vite dev` it is a local database (run `npm run db:migrate:local` first).
export function getDb() {
  if (!env.DB) throw new Error('D1 binding "DB" is missing. Check wrangler.jsonc.');
  return env.DB;
}

export const bad = (message) => json({ ok: false, message }, { status: 400 });
