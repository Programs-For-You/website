// © 2026 Brady Krupa and Arjun Bhanderi. All rights reserved.
// The email list. Every sign-up is sent to Netlify Forms (Netlify → your site → Forms → "email-list"),
// where you can see the list, get an email for each sign-up, and download it as a spreadsheet.

const KEY = 'pfy-email';
const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function savedEmail() {
  try { return localStorage.getItem(KEY) || ''; } catch { return ''; }
}
export function saveEmail(email) {
  try { localStorage.setItem(KEY, email); } catch { /* private mode: they'll just type it again next time */ }
}
export function forgetEmail() {
  try { localStorage.removeItem(KEY); } catch { /* nothing saved */ }
}

// ---------- "I'm 18 or older" ----------
// Asked only the first time someone signs in (email or Google). After that the browser remembers it,
// so the box is hidden. (The Terms of Service screen still asks whenever there's something new to agree to.)
const AGE_KEY = 'pfy-age-18';
export function ageConfirmed() {
  try { return Boolean(localStorage.getItem(AGE_KEY)); } catch { return false; }
}
export function confirmAge() {
  try { localStorage.setItem(AGE_KEY, new Date().toISOString()); } catch { /* storage blocked: they'll be asked again */ }
}
/** Hides an age checkbox (and ticks it) if this person already confirmed their age. */
export function skipAgeIfConfirmed(input) {
  if (!input || !ageConfirmed()) return;
  input.checked = true;
  const label = input.closest('label');
  if (label) label.hidden = true;
}

/** Adds an email to the list. Returns true if Netlify saved it. */
export async function joinList(email, source, age = '18 or older') {
  if (['localhost', '127.0.0.1'].includes(location.hostname)) {
    console.info('[preview] Would add to the email list:', email, source); // Netlify Forms only works on the real site
    return true;
  }
  const body = new URLSearchParams({ 'form-name': 'email-list', email, source, age, company: '' });
  try {
    const r = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() });
    return r.ok;
  } catch {
    return false;
  }
}

/** Hooks up one sign-up form. onJoined(email) runs after it's sent. */
export function wireEmailForm(form, onJoined) {
  const msg = form.querySelector('[data-email-msg]');
  const say = (text, kind) => { msg.textContent = text; msg.className = `form-msg show ${kind}`; };
  skipAgeIfConfirmed(form.elements.age);
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const button = form.querySelector('[type="submit"]');
    if (button.disabled) return;
    const email = form.elements.email.value.trim();
    if (form.elements.company?.value) return; // a bot filled the hidden box
    if (!EMAIL_OK.test(email)) return say('That email address doesn’t look right.', 'error');
    if (!form.elements.age.checked) return say('Please check the box to confirm you’re 18 or older.', 'error');
    const label = button.textContent;
    button.disabled = true;
    button.textContent = 'One sec…';
    const ok = await joinList(email, form.elements.source.value, form.elements.age.value);
    button.disabled = false;
    button.textContent = label;
    if (!ok) return say('Your email couldn’t be saved. Please try again.', 'error');
    saveEmail(email);
    confirmAge();
    onJoined(email, say);
  });
}
