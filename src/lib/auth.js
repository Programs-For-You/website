// Server-only: accounts, passwords, sessions and invite/reset links. Accounts are PocketBase's built-in `users` collection
// (it hashes passwords itself); the login cookie holds the PocketBase auth token, which expires after 7 days.
// Changing a password or turning an account off logs that person out everywhere (PocketBase rotates the token key; we check `disabled` on every request).
import { env } from 'cloudflare:workers';
import { records, f } from '#lib/pb.js';
import { accountMail, EMAIL_OK } from '#lib/server.js';
import { SITE } from '#lib/config.js';

export const ROLES = ['admin1', 'admin2'];
export const isAdminRole = (role) => role === 'admin1' || role === 'admin2';
export const MIN_PASSWORD = 10;

const COOKIE = 'pfy-session';
const SESSION_DAYS = 7;
const MAX_FAILS = 5;
const LOCK_SECONDS = 15 * 60;
const enc = new TextEncoder();
const now = () => Math.floor(Date.now() / 1000);
const hex = (bytes) => Array.from(new Uint8Array(bytes), (b) => b.toString(16).padStart(2, '0')).join('');
const randomHex = (n) => hex(crypto.getRandomValues(new Uint8Array(n)));
const sha256 = async (t) => hex(await crypto.subtle.digest('SHA-256', enc.encode(t)));

export const cleanEmail = (v) => String(v ?? '').trim().toLowerCase().slice(0, 320);
export const emailOk = (v) => EMAIL_OK.test(v);

// Compare without stopping at the first different character.
function same(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Why a new password is not OK, or '' if it is. */
export const passwordProblem = (pw) =>
  pw.length < MIN_PASSWORD ? `Use at least ${MIN_PASSWORD} characters.` : pw.length > 200 ? 'That password is too long.' : '';

const publicUser = (r) => ({ id: r.id, email: r.email, name: r.name, role: r.role });

/** Asks PocketBase to check a password as this user (no superuser). Returns { token, record } or null. */
async function passwordLogin(email, password) {
  const res = await fetch(`${env.PB_URL}/api/collections/users/auth-with-password`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ identity: email, password })
  });
  return res.ok ? res.json() : null;
}

// ---------- Sessions ----------
export function startSession(cookies, url, token) {
  cookies.set(COOKIE, token, { path: '/', httpOnly: true, sameSite: 'lax', secure: url.protocol === 'https:', maxAge: SESSION_DAYS * 86400 });
}

export function endSession(cookies) {
  cookies.delete(COOKIE, { path: '/' });
}

/** The logged-in person { id, email, name, role }, or null. A disabled account is never logged in. */
export async function getUser(cookies) {
  const token = cookies.get(COOKIE);
  if (!token || token.length > 2000) return null;
  const res = await fetch(`${env.PB_URL}/api/collections/users/auth-refresh`, { method: 'POST', headers: { authorization: token } });
  if (!res.ok) return null;
  const { record } = await res.json();
  return record.disabled ? null : publicUser(record);
}

/** Either admin level: can use /admin and read messages and applications. */
export async function isAdmin(cookies) {
  return isAdminRole((await getUser(cookies))?.role);
}

/** Admin level 1 only: the Team page editor and accounts. */
export async function isAdmin1(cookies) {
  return (await getUser(cookies))?.role === 'admin1';
}

// ---------- Logging in ----------
/** Checks an email and password. Returns { user, token } or { error }. Five wrong passwords in a row lock the account for 15 minutes. */
export async function login(emailRaw, password) {
  const email = cleanEmail(emailRaw);
  const wrong = { error: 'That email or password isn’t right.' };
  let user = emailOk(email) ? await records.first('users', f('email = {:e}', { e: email })) : null;

  // First login: until some Admin 1 can log in, the ADMIN_PASSWORD secret with any valid email creates (or finishes) the first Admin 1.
  if (emailOk(email) && env.ADMIN_PASSWORD && same(password, env.ADMIN_PASSWORD) && !(user && user.verified)) {
    const open = await records.count('users', "role = 'admin1' && disabled = false && verified = true");
    if (open === 0) {
      const body = { password, passwordConfirm: password, role: 'admin1', disabled: false, failed: 0, locked_until: 0, verified: true };
      user = user ? await records.update('users', user.id, body) : await records.create('users', { ...body, email, name: email.split('@')[0] });
      const res = await passwordLogin(email, password);
      if (res) return { user: publicUser(res.record), token: res.token, first: true };
    }
  }

  if (!user || !user.verified || user.disabled) { await passwordLogin(email || 'nobody@example.com', password); return wrong; } // same time as a real check
  if (user.locked_until > now()) return { error: 'Too many tries. Please wait 15 minutes, or reset your password.' };
  const res = await passwordLogin(email, password);
  if (!res) {
    const fails = (user.failed || 0) + 1;
    await records.update('users', user.id, { failed: fails >= MAX_FAILS ? 0 : fails, locked_until: fails >= MAX_FAILS ? now() + LOCK_SECONDS : 0 });
    return wrong;
  }
  if (user.failed) await records.update('users', user.id, { failed: 0, locked_until: 0 });
  return { user: publicUser(res.record), token: res.token };
}

/** Where to send someone after logging in: the page they asked for (same site only), else their home. */
export const landing = (user, next) => (/^\/(?!\/)/.test(next ?? '') ? next : isAdminRole(user.role) ? '/admin' : '/account');

/** Sets a new password (and uses up any invite/reset links). Every browser logged in as this person is logged out. */
export async function changePassword(userId, password) {
  await records.update('users', userId, { password, passwordConfirm: password, verified: true, failed: 0, locked_until: 0 });
  for (const t of await records.list('tokens', { filter: f('user = {:u}', { u: userId }), fields: 'id' })) await records.remove('tokens', t.id);
}

// ---------- Invite and reset links ----------
const HOURS = { invite: 24 * 7, reset: 1 };

export async function createToken(userId, kind) {
  const token = randomHex(32);
  for (const t of await records.list('tokens', { filter: f('user = {:u} && (kind = {:k} || expires < {:n})', { u: userId, k: kind, n: now() }), fields: 'id' })) await records.remove('tokens', t.id);
  await records.create('tokens', { user: userId, token_hash: await sha256(token), kind, expires: now() + HOURS[kind] * 3600 });
  return token;
}

/** The person a link belongs to, if it is real, unused and not expired: { id, email, name, kind }. */
export async function findToken(token) {
  if (!token || token.length > 100) return null;
  const t = await records.first('tokens', f('token_hash = {:h} && expires > {:n}', { h: await sha256(token), n: now() }));
  if (!t) return null;
  const u = await records.get('users', t.user);
  return u && !u.disabled ? { id: u.id, email: u.email, name: u.name, kind: t.kind } : null;
}

/** True if a link was made for this person in the last minute (stops someone filling an inbox). */
export async function recentToken(userId) {
  const since = new Date(Date.now() - 60_000).toISOString().replace('T', ' ');
  return (await records.count('tokens', f('user = {:u} && created_at >= {:t}', { u: userId, t: since }))) > 0;
}

/** Emails the link. Returns { sent, link }: the link is also returned so an admin can pass it on if email isn't working. */
export async function sendLink(origin, user, kind) {
  const link = `${origin}/set-password?token=${await createToken(user.id, kind)}`;
  const first = user.name.split(/\s+/)[0].replace(/[\r\n]/g, ' ');
  const invite = kind === 'invite';
  const sent = await accountMail({
    to: user.email,
    subject: invite ? `Your ${SITE.name} account` : `Reset your ${SITE.name} password`,
    heading: invite ? 'Welcome aboard' : 'Reset your password',
    paragraphs: [
      `Hi ${first},`,
      invite ? `An account was made for you on ${SITE.name}. Choose your password with the button below (the link works for 7 days).`
             : 'Someone asked to reset your password. Choose a new one with the button below (the link works for 1 hour). If that wasn’t you, ignore this email and nothing changes.'
    ],
    button: { label: invite ? 'Choose my password' : 'Choose a new password', url: link }
  });
  return { sent, link };
}
