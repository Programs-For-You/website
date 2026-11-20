// © 2026 Brady Krupa and Arjun Bhanderi. All rights reserved.
// Support tickets. Each ticket gets a number (like PFY-7K3Q2) and is sent to Netlify Forms
// (Netlify → your site → Forms → "support-ticket"). Only the site owner can see them there.
import { SITE } from './config.js';
import { savedEmail, saveEmail } from './emaillist.js';

const $ = (sel, root = document) => root.querySelector(sel);
const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const HISTORY = 'pfy-tickets';
const form = $('[data-ticket-form]');
const done = $('[data-ticket-done]');
const msg = $('[data-ticket-msg]');
const say = (text) => { msg.textContent = text; msg.className = 'form-msg show error'; };

function newTicketNumber() {
  const letters = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';           // no 0/O or 1/I mix-ups
  const bytes = crypto.getRandomValues(new Uint8Array(5));
  return 'PFY-' + Array.from(bytes, (b) => letters[b % letters.length]).join('');
}

function history() {
  try { return JSON.parse(localStorage.getItem(HISTORY)) || []; } catch { return []; }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function showHistory() {
  const list = history();
  const box = $('[data-ticket-history]');
  if (!box) return;
  box.hidden = list.length === 0;
  $('ul', box).innerHTML = list.map((t) =>
    `<li><b>${escapeHtml(t.id)}</b><span>${escapeHtml(t.subject)}</span><time>${new Date(t.at).toLocaleDateString()}</time></li>`).join('');
}

// Fill in what we already know: their email (if they gave it before) and the app (from ?app=…).
const params = new URLSearchParams(location.search);
if (savedEmail()) form.elements.email.value = savedEmail();
if (params.get('app')) {
  const opt = Array.from(form.elements.app.options).find((o) => o.value === params.get('app'));
  if (opt) form.elements.app.value = opt.value;
}
showHistory();

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (form.elements.company.value) return;                      // a bot filled the hidden box
  const email = form.elements.email.value.trim();
  if (form.elements.name.value.trim().length < 1) { form.elements.name.focus(); return say('Please type your name.'); }
  if (form.elements.summary.value.trim().length < 5) { form.elements.summary.focus(); return say('Please write a short summary of the problem or question.'); }
  if (!form.elements.app.value) return say('Please choose what your ticket is about.');
  if (!EMAIL_OK.test(email)) { form.elements.email.focus(); return say('Please type your email address so we can reply to you.'); }

  const id = newTicketNumber();
  form.elements.ticket.value = id;
  const button = $('[type="submit"]', form);
  button.disabled = true;
  button.textContent = 'Sending…';

  let ok = true;
  if (['localhost', '127.0.0.1'].includes(location.hostname)) {
    console.info('[preview] Would send support ticket', id, Object.fromEntries(new FormData(form)));
  } else {
    try {
      const r = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString() });
      ok = r.ok;
    } catch { ok = false; }
  }
  button.disabled = false;
  button.textContent = 'Send ticket';
  if (!ok) return say(`Your ticket couldn’t be sent. Please try again, or email ${SITE.contactEmail}.`);

  saveEmail(email);
  try {
    localStorage.setItem(HISTORY, JSON.stringify([{ id, subject: form.elements.summary.value.trim().slice(0, 80), at: Date.now() }, ...history()].slice(0, 10)));
  } catch { /* storage blocked: the ticket was still sent */ }
  $('[data-ticket-id]').textContent = id;
  $('[data-ticket-email]').textContent = email;
  form.hidden = true;
  done.hidden = false;
  msg.className = 'form-msg';
  showHistory();
  done.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

$('[data-ticket-new]').addEventListener('click', () => {
  const email = form.elements.email.value, name = form.elements.name.value;
  form.reset();
  form.elements.email.value = email;
  form.elements.name.value = name;
  done.hidden = true;
  form.hidden = false;
  form.elements.summary.focus();
});
