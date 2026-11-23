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

// ---------- Admin login ----------
// One shared password (the ADMIN_PASSWORD secret). Logging in sets a signed cookie that expires after 8 hours.
const COOKIE = 'pfy-admin';
const MAX_AGE = 60 * 60 * 8;
const enc = new TextEncoder();

async function sign(text) {
  const key = await crypto.subtle.importKey('raw', enc.encode(env.ADMIN_PASSWORD), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(text));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, '0')).join('');
}

// Compare without stopping at the first different character.
function same(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function passwordOk(given) {
  if (!env.ADMIN_PASSWORD) return false; // not set up: nobody can log in
  return same(await sign('pw:' + given), await sign('pw:' + env.ADMIN_PASSWORD));
}

export async function startSession(cookies, url) {
  const exp = String(Math.floor(Date.now() / 1000) + MAX_AGE);
  cookies.set(COOKIE, `${exp}.${await sign(exp)}`, { path: '/admin', httpOnly: true, sameSite: 'strict', secure: url.protocol === 'https:', maxAge: MAX_AGE });
}

export const endSession = (cookies) => cookies.delete(COOKIE, { path: '/admin' });

export async function isAdmin(cookies) {
  const [exp, sig] = (cookies.get(COOKIE) ?? '').split('.');
  if (!env.ADMIN_PASSWORD || !exp || !sig || Number(exp) < Date.now() / 1000) return false;
  return same(sig, await sign(exp));
}

// Your pfy-forward API: the site just hands it each submission.
const FORWARD_URL = 'https://pfy-forward.agsid502.workers.dev';

/**
 * Tells the team when a contact message or application comes in, by POSTing it to pfy-forward.
 * Needs the FORWARD_SECRET secret on the site (same value as on the worker). Without it, nothing is sent.
 * Best effort: the submission is already saved, so a missing setup or failure never breaks the form.
 */
export async function notify(subject, lines, replyTo) {
  if (!env.FORWARD_SECRET) return;
  try {
    const res = await fetch(env.FORWARD_URL || FORWARD_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forward-secret': env.FORWARD_SECRET },
      body: JSON.stringify({ subject, text: lines.join('\n') + '\n\nManage it at /admin', replyTo })
    });
    const out = await res.json().catch(() => null);
    if (!res.ok || !out?.ok) console.error('notify failed', res.status, out);
  } catch (e) {
    console.error('notify failed', e);
  }
}
