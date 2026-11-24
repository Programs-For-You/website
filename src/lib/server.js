// Server-only helpers for /api routes.
import { json } from '@sveltejs/kit';
import { env } from 'cloudflare:workers';
import { SITE } from '#lib/config.js';

export const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Trim a form value and cap its length. Missing values become ''.
export const str = (v, max) => String(v ?? '').trim().slice(0, max);

// The D1 binding "DB" from wrangler.jsonc. Under `vite dev` it is a local database (run `npm run db:migrate:local` first).
export function getDb() {
  if (!env.DB) throw new Error('D1 binding "DB" is missing. Check wrangler.jsonc.');
  return env.DB;
}

export const bad = (message) => json({ ok: false, message }, { status: 400 });

// Login and accounts live in #lib/auth.js.

/** Sends one email with Cloudflare Email Sending (the EMAIL binding). Returns true if it was sent. Never throws. */
export async function sendMail({ to, subject, text, replyTo }) {
  if (!env.EMAIL) return false;
  try {
    await env.EMAIL.send({ to, from: { email: `notifications@${SITE.domain}`, name: SITE.name }, replyTo: replyTo && EMAIL_OK.test(replyTo) ? replyTo : undefined, subject, text });
    return true;
  } catch (e) {
    console.error('email failed', e?.code, e?.message ?? e);
    return false;
  }
}

/**
 * Emails the team when a contact message or application comes in, with Cloudflare Email Sending (the EMAIL binding).
 * Goes to every active admin account (Admin 1 and Admin 2), plus the optional NOTIFY_TO secret (extra addresses, comma-separated).
 * Sent from notifications@<SITE.domain>, so that domain must be onboarded to Email Sending.
 * Best effort: the submission is already saved, so a missing setup or failure never breaks the form.
 */
export async function notify(subject, lines, replyTo) {
  if (!env.EMAIL) return;
  // Every active admin (level 1 and 2), plus anyone listed in NOTIFY_TO.
  const { results } = await getDb().prepare("SELECT email FROM users WHERE role IN ('admin1', 'admin2') AND disabled = 0 AND pw_hash IS NOT NULL").all().catch(() => ({ results: [] }));
  const to = [...new Set([...results.map((r) => r.email), ...(env.NOTIFY_TO ?? '').split(',').map((a) => a.trim().toLowerCase())].filter(Boolean))];
  if (!to.length) return;
  try {
    await env.EMAIL.send({
      to,
      from: { email: `notifications@${SITE.domain}`, name: SITE.name },
      replyTo: replyTo && EMAIL_OK.test(replyTo) ? replyTo : undefined,
      subject,
      text: lines.join('\n') + '\n\nManage it at ' + SITE.url + '/admin'
    });
  } catch (e) {
    console.error('notify failed', e?.code, e?.message ?? e);
  }
}

/**
 * Emails the applicant a "we got it" reply with Cloudflare Email Sending (the same EMAIL binding as notify()).
 * Sent from notifications@<SITE.domain>; replies go to SITE.contactEmail.
 * Best effort like notify(): the application is already saved, so a failure never breaks the form.
 */
export async function replyToApplicant({ name, email, role, department }) {
  if (!env.EMAIL) return;
  const first = name.split(/\s+/)[0].replace(/[\r\n]/g, ' ');
  try {
    await env.EMAIL.send({
      to: email,
      from: { email: `notifications@${SITE.domain}`, name: SITE.name },
      replyTo: SITE.contactEmail,
      subject: `We got your application, ${first}`,
      text: [
        `Hi ${first},`,
        '',
        `Thanks for applying to ${SITE.name} as ${role} in ${department}. We got your application and a real person on the team will read it.`,
        '',
        'We will email you back at this address once we have decided on next steps. You can reply to this email if you want to add anything.',
        '',
        `The ${SITE.name} team`,
        SITE.url
      ].join('\n')
    });
  } catch (e) {
    console.error('applicant reply failed', e?.code, e?.message ?? e);
  }
}
