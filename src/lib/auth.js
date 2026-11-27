// Server-only: accounts, passwords, sessions and invite/reset links. Everything is stored in Cloudflare D1 (migrations/0006_users.sql).
// Passwords: PBKDF2-SHA256 with a random salt (100,000 rounds is the most Workers allows).
// Logged-in browsers get a random cookie; only its SHA-256 is stored, so logging someone out (or disabling them) is just deleting rows.
import { env } from 'cloudflare:workers';
import { getDb, accountMail, EMAIL_OK } from '#lib/server.js';
import { SITE } from '#lib/config.js';

export const ROLES = ['admin1', 'admin2'];
export const isAdminRole = (role) => role === 'admin1' || role === 'admin2';
export const MIN_PASSWORD = 10;

const COOKIE = 'pfy-session';
const SESSION_DAYS = 7;
const ITER = 100_000;
const MAX_FAILS = 5;
const LOCK_SECONDS = 15 * 60;
const enc = new TextEncoder();
const now = () => Math.floor(Date.now() / 1000);
const hex = (bytes) => Array.from(new Uint8Array(bytes), (b) => b.toString(16).padStart(2, '0')).join('');
const unhex = (h) => Uint8Array.from(h.match(/../g) ?? [], (x) => parseInt(x, 16));
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

async function derive(password, salt, iter) {
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  return hex(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: iter }, key, 256));
}

export async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return `pbkdf2$${ITER}$${hex(salt)}$${await derive(password, salt, ITER)}`;
}

const DUMMY = `pbkdf2$${ITER}$${'00'.repeat(16)}$${'00'.repeat(32)}`;
async function passwordMatches(password, stored) {
  const [kind, iter, salt, hash] = String(stored).split('$');
  if (kind !== 'pbkdf2' || !iter || !salt || !hash) return false;
  return same(await derive(password, unhex(salt), Number(iter)), hash);
}

/** Why a new password is not OK, or '' if it is. */
export const passwordProblem = (pw) =>
  pw.length < MIN_PASSWORD ? `Use at least ${MIN_PASSWORD} characters.` : pw.length > 200 ? 'That password is too long.' : '';

// ---------- Sessions ----------
export async function startSession(cookies, url, userId) {
  const token = randomHex(32);
  const exp = now() + SESSION_DAYS * 86400;
  const db = getDb();
  await db.batch([
    db.prepare('DELETE FROM sessions WHERE expires_at < ?').bind(now()), // tidy up old ones
    db.prepare('INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)').bind(await sha256(token), userId, exp)
  ]);
  cookies.set(COOKIE, token, { path: '/', httpOnly: true, sameSite: 'lax', secure: url.protocol === 'https:', maxAge: SESSION_DAYS * 86400 });
}

export async function endSession(cookies) {
  const token = cookies.get(COOKIE);
  if (token) await getDb().prepare('DELETE FROM sessions WHERE token_hash = ?').bind(await sha256(token)).run();
  cookies.delete(COOKIE, { path: '/' });
}

/** The logged-in person { id, email, name, role }, or null. A disabled account is never logged in. */
export async function getUser(cookies) {
  const token = cookies.get(COOKIE);
  if (!token) return null;
  return getDb().prepare(
    'SELECT u.id, u.email, u.name, u.role FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ? AND s.expires_at > ? AND u.disabled = 0'
  ).bind(await sha256(token), now()).first();
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
/** Checks an email and password. Returns { user } or { error }. Five wrong passwords in a row lock the account for 15 minutes. */
export async function login(emailRaw, password) {
  const db = getDb();
  const email = cleanEmail(emailRaw);
  const wrong = { error: 'That email or password isn’t right.' };

  let user = await db.prepare('SELECT * FROM users WHERE email = ?').bind(email).first();

  // First login: until some Admin 1 can log in, the ADMIN_PASSWORD secret with any valid email creates (or finishes) the first Admin 1.
  if (emailOk(email) && env.ADMIN_PASSWORD && same(password, env.ADMIN_PASSWORD) && !user?.pw_hash) {
    const { n } = await db.prepare("SELECT COUNT(*) AS n FROM users WHERE role = 'admin1' AND disabled = 0 AND pw_hash IS NOT NULL").first();
    if (n === 0) {
      const hash = await hashPassword(password);
      if (user) await db.prepare("UPDATE users SET pw_hash = ?, role = 'admin1', disabled = 0, failed = 0, locked_until = 0 WHERE id = ?").bind(hash, user.id).run();
      else await db.prepare('INSERT INTO users (email, name, role, pw_hash) VALUES (?, ?, ?, ?)').bind(email, email.split('@')[0], 'admin1', hash).run();
      return { user: await db.prepare('SELECT * FROM users WHERE email = ?').bind(email).first(), first: true };
    }
  }

  if (!user?.pw_hash || user.disabled) { await passwordMatches(password, DUMMY); return wrong; } // same time as a real check
  if (user.locked_until > now()) return { error: 'Too many tries. Please wait 15 minutes, or reset your password.' };
  if (!(await passwordMatches(password, user.pw_hash))) {
    const fails = user.failed + 1;
    await db.prepare('UPDATE users SET failed = ?, locked_until = ? WHERE id = ?').bind(fails >= MAX_FAILS ? 0 : fails, fails >= MAX_FAILS ? now() + LOCK_SECONDS : 0, user.id).run();
    return wrong;
  }
  if (user.failed) await db.prepare('UPDATE users SET failed = 0, locked_until = 0 WHERE id = ?').bind(user.id).run();
  return { user };
}

/** Where to send someone after logging in: the page they asked for (same site only), else their home. */
export const landing = (user, next) => (/^\/(?!\/)/.test(next ?? '') ? next : isAdminRole(user.role) ? '/admin' : '/account');

/** Sets a new password, uses up any invite/reset links, and logs this person out of every browser. */
export async function changePassword(userId, password) {
  const db = getDb();
  await db.batch([
    db.prepare('UPDATE users SET pw_hash = ?, failed = 0, locked_until = 0 WHERE id = ?').bind(await hashPassword(password), userId),
    db.prepare('DELETE FROM tokens WHERE user_id = ?').bind(userId),
    db.prepare('DELETE FROM sessions WHERE user_id = ?').bind(userId)
  ]);
}

// ---------- Invite and reset links ----------
const HOURS = { invite: 24 * 7, reset: 1 };

export async function createToken(userId, kind) {
  const token = randomHex(32);
  const db = getDb();
  await db.batch([
    db.prepare('DELETE FROM tokens WHERE user_id = ? AND (kind = ? OR expires_at < ?)').bind(userId, kind, now()),
    db.prepare('INSERT INTO tokens (token_hash, user_id, kind, expires_at, created_at) VALUES (?, ?, ?, ?, ?)').bind(await sha256(token), userId, kind, now() + HOURS[kind] * 3600, now())
  ]);
  return token;
}

/** The person a link belongs to, if it is real, unused and not expired: { id, email, name, kind }. */
export async function findToken(token) {
  if (!token || token.length > 100) return null;
  return getDb().prepare(
    'SELECT u.id, u.email, u.name, t.kind FROM tokens t JOIN users u ON u.id = t.user_id WHERE t.token_hash = ? AND t.expires_at > ? AND u.disabled = 0'
  ).bind(await sha256(token), now()).first();
}

/** True if a link was made for this person in the last minute (stops someone filling an inbox). */
export async function recentToken(userId) {
  return Boolean(await getDb().prepare('SELECT 1 FROM tokens WHERE user_id = ? AND created_at > ?').bind(userId, now() - 60).first());
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
