// © 2026 Brady Krupa and Arjun Bhanderi. All rights reserved.
// Job applications ("Join the team"). Each one goes to Netlify Forms (Netlify → your site → Forms → "job-application"),
// where only the site owners can see it.
import { SITE } from './config.js';
import { savedEmail } from './emaillist.js';

const $ = (sel, root = document) => root.querySelector(sel);
const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const form = $('[data-apply-form]');
const done = $('[data-apply-done]');
const msg = $('[data-apply-msg]');
const say = (text) => { msg.textContent = text; msg.className = 'form-msg show error'; };

if (savedEmail()) form.elements.email.value = savedEmail();
const wanted = new URLSearchParams(location.search).get('department');
if (wanted) {
  const opt = Array.from(form.elements.department.options).find((o) => o.value === wanted);
  if (opt) form.elements.department.value = opt.value;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (form.elements.company.value) return;                      // a bot filled the hidden box
  if ($('[type="submit"]', form).disabled) return;              // already sending
  const f = form.elements;
  const email = f.email.value.trim();
  if (!f.name.value.trim()) { f.name.focus(); return say('Please type your name.'); }
  if (!EMAIL_OK.test(email)) { f.email.focus(); return say('Please type your email so we can get back to you.'); }
  if (!f.grade.value) { f.grade.focus(); return say('Please choose your grade.'); }
  if (!f.role.value) { f.role.focus(); return say('Please choose the role you want.'); }
  if (!f.department.value) { f.department.focus(); return say('Please choose a department (or “Not sure yet”).'); }
  if (f.why.value.trim().length < 20) { f.why.focus(); return say('Please tell us a little more about why you want to join (a sentence or two).'); }

  const button = $('[type="submit"]', form);
  button.disabled = true;
  button.textContent = 'Sending…';
  let ok = true;
  if (['localhost', '127.0.0.1'].includes(location.hostname)) {
    console.info('[preview] Would send job application', Object.fromEntries(new FormData(form)));
  } else {
    try {
      const r = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString() });
      ok = r.ok;
    } catch { ok = false; }
  }
  button.disabled = false;
  button.textContent = 'Send application';
  if (!ok) return say(`Your application couldn’t be sent. Please try again, or email ${SITE.contactEmail}.`);

  $('[data-apply-email]').textContent = email;
  form.hidden = true;
  done.hidden = false;
  msg.className = 'form-msg';
  done.scrollIntoView({ behavior: 'smooth', block: 'center' });
});
