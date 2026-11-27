// Server-only helpers for /api routes: form cleaning and sending email with Resend.
import { json } from '@sveltejs/kit';
import { env } from 'cloudflare:workers';
import { SITE } from '#lib/config.js';

export const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Trim a form value and cap its length. Missing values become ''.
export const str = (v, max) => String(v ?? '').trim().slice(0, max);

export const bad = (message) => json({ ok: false, message }, { status: 400 });

// The D1 binding "DB" from wrangler.jsonc. Under `vite dev` it is a local database (run `npm run db:migrate:local` first).
export function getDb() {
  if (!env.DB) throw new Error('D1 binding "DB" is missing. Check wrangler.jsonc.');
  return env.DB;
}

// Login and accounts live in #lib/auth.js.

const oneLine = (v) => String(v ?? '').replace(/[\r\n]+/g, ' ').trim();
const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const FROM = () => `${SITE.name} <notifications@${SITE.domain}>`;

/** A plain, readable HTML email around a few paragraphs (strings; blank string = spacing). Rows are [label, value] pairs shown as a table. */
function layout({ heading, paragraphs = [], rows = [], button, footer, unsubscribe }) {
  const p = (t) => `<p style="margin:0 0 14px;line-height:1.55">${esc(t).replace(/\n/g, '<br>')}</p>`;
  return `<!doctype html><html><body style="margin:0;background:#f4f6f4;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#14211a">
<div style="max-width:560px;margin:0 auto;padding:24px 16px"><div style="background:#fff;border-radius:12px;padding:28px;border:1px solid #e1e8e3">
<h1 style="font-size:20px;margin:0 0 18px;color:#15803d">${esc(heading)}</h1>
${paragraphs.map(p).join('')}
${rows.length ? `<table style="border-collapse:collapse;width:100%;margin:0 0 14px">${rows.map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#5b6b61;vertical-align:top;white-space:nowrap">${esc(k)}</td><td style="padding:6px 0">${esc(v).replace(/\n/g, '<br>')}</td></tr>`).join('')}</table>` : ''}
${button ? `<p style="margin:20px 0 0"><a href="${esc(button.url)}" style="background:#15803d;color:#fff;text-decoration:none;padding:10px 18px;border-radius:8px;display:inline-block">${esc(button.label)}</a></p>` : ''}
</div><p style="color:#5b6b61;font-size:12px;text-align:center;margin:14px 0 0">${esc(footer ?? `${SITE.name} · ${SITE.url}`)}${unsubscribe ? ` · <a href="${esc(unsubscribe)}" style="color:#5b6b61">Unsubscribe</a>` : ''}</p></div></body></html>`;
}

async function resend(path, payload, idempotencyKey) {
  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await fetch(`https://api.resend.com${path}`, {
      method: 'POST',
      headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json', ...(idempotencyKey ? { 'idempotency-key': idempotencyKey } : {}) },
      body: JSON.stringify(payload)
    });
    if (res.ok) return res.json();
    // Rate limited or Resend had a hiccup: wait a moment and try once more (the idempotency key stops double sends).
    if ((res.status === 429 || res.status >= 500) && attempt === 0) { await new Promise((r) => setTimeout(r, 800)); continue; }
    throw new Error(`Resend ${res.status}: ${(await res.text()).slice(0, 200)}`);
  }
}

const mailPart = ({ to, subject, text, html, replyTo, headers }) => ({
  from: FROM(), to: [].concat(to), subject: oneLine(subject), text, html, ...(headers ? { headers } : {}),
  ...(replyTo && EMAIL_OK.test(replyTo) ? { reply_to: replyTo } : {})
});

/** Sends one email through Resend. Returns true if Resend accepted it. Never throws. `key` makes a retry safe (no double send). */
export async function sendMail({ to, subject, text, html, replyTo, key }) {
  if (!env.RESEND_API_KEY) return false;
  try {
    await resend('/emails', mailPart({ to, subject, text, html, replyTo }), key);
    return true;
  } catch (e) {
    console.error('email failed', e?.message ?? e);
    return false;
  }
}

/** Plain account emails (invites, resets) with the same look as the rest. */
export const accountMail = ({ to, subject, heading, paragraphs, button, key }) =>
  sendMail({ to, subject, replyTo: SITE.contactEmail, key,
    text: [...paragraphs, button ? `${button.label}: ${button.url}` : '', `The ${SITE.name} team`].filter(Boolean).join('\n\n'),
    html: layout({ heading, paragraphs, button }) });

/** Every active admin (level 1 and 2), plus anyone listed in the optional NOTIFY_TO secret (comma-separated). */
async function adminEmails() {
  const { results: admins } = await getDb().prepare("SELECT email FROM users WHERE role IN ('admin1', 'admin2') AND disabled = 0 AND pw_hash IS NOT NULL").all().catch(() => ({ results: [] }));
  const extra = (env.NOTIFY_TO ?? '').split(',').map((a) => a.trim().toLowerCase());
  return [...new Set([...admins.map((a) => a.email.toLowerCase()), ...extra].filter((a) => EMAIL_OK.test(a)))];
}

/**
 * Emails the team when a contact message or application comes in. Each admin gets their own copy (nobody sees the others' addresses),
 * sent in one Resend batch. Reply-To is the person who wrote in, so "Reply" answers them directly.
 * Best effort: the submission is already saved, so a missing setup or failure never breaks the form.
 */
export async function notify(subject, rows, { replyTo, intro, key } = {}) {
  if (!env.RESEND_API_KEY) return;
  try {
    const to = await adminEmails();
    if (!to.length) return;
    const link = `${SITE.url}/admin`;
    const text = [intro, ...rows.map(([k, v]) => `${k}: ${v}`), '', `Manage it at ${link}`].filter((l) => l !== undefined).join('\n');
    const html = layout({ heading: subject, paragraphs: intro ? [intro] : [], rows, button: { label: 'Open the admin page', url: link } });
    await resend('/emails/batch', to.map((addr) => mailPart({ to: addr, subject, text, html, replyTo })), key);
  } catch (e) {
    console.error('notify failed', e?.message ?? e);
  }
}

/**
 * Is it OK to email this address a confirmation? The confirmation goes to whatever address was typed, so to stop the forms
 * being used to spam someone, only the first few submissions per address per hour get one. (The submission is saved either way.)
 */
export async function mayConfirm(email) {
  try {
    const since = new Date(Date.now() - 3600_000).toISOString().slice(0, 19).replace('T', ' '); // same format as D1's datetime('now')
    const { n } = await getDb().prepare(
      'SELECT (SELECT COUNT(*) FROM tickets WHERE email = ?1 AND created_at >= ?2) + (SELECT COUNT(*) FROM applications WHERE email = ?1 AND created_at >= ?2) AS n'
    ).bind(email, since).first();
    return n <= 3;
  } catch { return true; }
}

/** "We got it" email to the person who wrote to us. Returns true if sent. */
export async function confirmToSender({ name, email, subject, lead, rows, key }) {
  const first = oneLine(name).split(/\s+/)[0] || 'there';
  const paragraphs = [`Hi ${first},`, lead, 'You can reply to this email if you want to add anything.'];
  return sendMail({
    to: email, replyTo: SITE.contactEmail, subject, key,
    text: [...paragraphs, ...rows.map(([k, v]) => `${k}: ${v}`), '', `The ${SITE.name} team`, SITE.url].join('\n'),
    html: layout({ heading: subject, paragraphs, rows })
  });
}


// ---------- Newsletter ----------
export const unsubscribeUrl = (sub) => `${SITE.url}/unsubscribe?t=${encodeURIComponent(sub.token)}`;

function newsletterParts({ heading, paragraphs, button }, sub) {
  const url = unsubscribeUrl(sub);
  return {
    text: [...paragraphs, button ? `${button.label}: ${button.url}` : '', `The ${SITE.name} team`, '', `Unsubscribe: ${url}`].filter((l) => l !== undefined).join('\n\n'),
    html: layout({ heading, paragraphs, button, unsubscribe: url }),
    headers: { 'List-Unsubscribe': `<${url}>` }
  };
}

/** Emails a newsletter to subscribers ([{ email, token }]), each as their own message with their own unsubscribe link, 100 per Resend batch.
 *  Returns how many Resend accepted. `sendId` keeps a retried batch from double sending. */
export async function sendNewsletter({ subject, heading, paragraphs, button, subscribers, sendId }) {
  if (!env.RESEND_API_KEY) throw new Error('Email is not set up (RESEND_API_KEY is missing).');
  let sent = 0;
  for (let i = 0; i < subscribers.length; i += 100) {
    const chunk = subscribers.slice(i, i + 100);
    try {
      await resend('/emails/batch', chunk.map((sub) => mailPart({ to: sub.email, subject, replyTo: SITE.contactEmail, ...newsletterParts({ heading, paragraphs, button }, sub) })), `news-${sendId}-${i}`);
      sent += chunk.length;
    } catch (e) { console.error('newsletter batch failed', e?.message ?? e); }
  }
  return sent;
}

/** The one email a new subscriber gets. */
export const welcomeMail = (sub) => {
  const paragraphs = [`Thanks for signing up. We’ll email you about new ${SITE.name} apps and updates. Not often, and never spam.`];
  return sendMail({ to: sub.email, subject: `You’re on the list`, replyTo: SITE.contactEmail, key: `welcome-${sub.token}`, ...newsletterParts({ heading: 'You’re on the list', paragraphs }, sub) });
};
