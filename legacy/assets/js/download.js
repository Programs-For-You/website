// © 2026 Brady Krupa and Arjun Bhanderi. All rights reserved.
// The Downloads page: type your email (no password) and the download buttons open up.
// Every email goes to the email list. Google sign-in also works, once Firebase is connected.

import { onUser, signInWithGoogle, signOutUser, friendlyError, PREVIEW } from './auth.js';
import { APPS, GAMES } from './config.js';
import { esc } from './util.js';
import { savedEmail, saveEmail, forgetEmail, joinList, wireEmailForm, confirmAge, skipAgeIfConfirmed } from './emaillist.js';

const $ = (sel) => document.querySelector(sel);
const views = document.querySelectorAll('[data-view]');
const show = (name) => views.forEach((v) => { v.hidden = v.dataset.view !== name; });
const fill = (sel, text) => document.querySelectorAll(sel).forEach((el) => { el.textContent = text; });

const ua = navigator.userAgent;
const isMac = /Macintosh|Mac OS X/i.test(ua) && !/iPhone|iPad|iPod/i.test(ua) && (navigator.maxTouchPoints || 0) < 2;
const isWindows = /Windows/i.test(ua);
const isComputer = isMac || isWindows || /Linux|CrOS/i.test(ua) && !/Android/i.test(ua);

// What the newest Mac update fixed and added (from the app's history in config.js). Windows doesn't get updates.
function notes(app, mac) {
  const n = mac && (app.history || []).find((h) => h.version === app.version);
  if (!n || (!n.fixed && !n.added)) return '';
  return `<details class="dl-notes"><summary>What’s new in Mac version ${esc(app.version)}</summary>
    ${n.fixed ? `<p><b>Fixed:</b> ${esc(n.fixed)}</p>` : ''}${n.added ? `<p><b>Added:</b> ${esc(n.added)}</p>` : ''}</details>`;
}

// ---------- Owen Wang's Terms of Service for the Windows version ----------
// The Windows app is Owen's original School Schedule Manager. Before anyone downloads it (or its code), they check a box
// to agree to his Terms of Service. Each agreement is saved with their email (Netlify → Forms → windows-terms).
const TERMS_KEY = 'pfy-windows-terms';
function agreedTo(app) {
  const w = app && app.windows;
  if (!w || !w.terms) return true;
  try { return localStorage.getItem(`${TERMS_KEY}-${app.id}`) === w.termsVersion; } catch { return false; }
}

function winTerms(app) {
  const w = app.windows;
  if (!w.terms) return '';
  return `<label class="win-terms" data-win-terms-for="${esc(app.id)}">
      <input type="checkbox" ${agreedTo(app) ? 'checked' : ''}>
      <span>For the Windows version, I agree to <a href="${esc(w.terms)}" target="_blank" rel="noopener">${esc(w.termsBy || 'its maker')}’s Terms of Service</a>.</span>
    </label>
    <p class="win-terms-msg" role="alert" hidden>Check the box to agree to ${esc(w.termsBy || 'the maker')}’s Terms of Service first.</p>`;
}

async function recordAgreement(app) {
  const body = new URLSearchParams({ 'form-name': 'windows-terms', email: savedEmail() || '', app: app.name,
    terms: app.windows.terms, version: app.windows.termsVersion, agreed_at: new Date().toISOString() });
  if (['localhost', '127.0.0.1'].includes(location.hostname)) { console.info('[preview] Would save agreement', Object.fromEntries(body)); return; }
  try { await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() }); } catch { /* the download still works */ }
}

function wireTerms() {
  document.querySelectorAll('[data-win-terms-for]').forEach((label) => {
    const app = APPS.find((a) => a.id === label.dataset.winTermsFor);
    const box = label.querySelector('input');
    const card = label.closest('.dl-card');
    // Locked until they agree. (Not "disabled": a click still shows what to do.)
    const sync = () => card.querySelectorAll('[data-win-dl]').forEach((a) => {
      a.toggleAttribute('data-locked', !box.checked);
      if (box.checked) a.removeAttribute('title'); else a.title = 'Agree to the Terms of Service first (the box below)';
    });
    sync();
    box.addEventListener('change', () => {
      try {
        if (box.checked) localStorage.setItem(`${TERMS_KEY}-${app.id}`, app.windows.termsVersion);
        else localStorage.removeItem(`${TERMS_KEY}-${app.id}`);
      } catch { /* storage blocked: they can still agree each visit */ }
      if (box.checked) { card.querySelector('.win-terms-msg').hidden = true; recordAgreement(app); }
      sync();
    });
    card.querySelectorAll('[data-win-dl]').forEach((a) => a.addEventListener('click', (e) => {
      if (box.checked) return;
      e.preventDefault();
      card.querySelector('.win-terms-msg').hidden = false;
      label.classList.remove('nudge'); void label.offsetWidth; label.classList.add('nudge');
      box.focus();
    }));
  });
}

function renderApps() {
  const games = $('#game-list');
  if (games) games.innerHTML = GAMES.map((g) => {
    const ready = g.status === 'available' && g.file;
    const meta = [g.requires, ready && g.size].filter(Boolean).join(' · ');
    const action = ready
      ? `<a class="btn btn-primary" href="${esc(g.file)}" download>Download</a>`
      : '<span class="btn btn-ghost" aria-disabled="true">Coming soon</span>';
    return `
      <article class="card dl-card">
        <img class="app-icon" src="${esc(g.icon)}" alt="" width="64" height="64">
        <div>
          <h3>${esc(g.name)}</h3>
          <p class="muted small">${esc(g.blurb)}</p>
          <p class="faint xsmall meta">${esc(meta)}</p>
        </div>
        <div class="dl-actions">
          ${action}
          <a class="small" href="${esc(g.page)}#how-to-install">How to install it</a>
        </div>
      </article>`;
  }).join('');
  $('#app-list').innerHTML = APPS.map((app) => {
    const mac = app.status === 'available' && app.file;
    const win = app.windows && app.windows.status === 'available' && app.windows.file;
    const macMeta = ['Mac', app.requires, mac && app.version && `Version ${app.version}`, mac && app.size].filter(Boolean).join(' · ');
    const winMeta = win ? ['Windows', app.windows.requires, app.windows.version && `Version ${app.windows.version}`, app.windows.size].filter(Boolean).join(' · ')
                        : 'Windows · coming soon';
    // The button for the computer they're on is the big one.
    const macBtn = mac
      ? `<a class="btn ${isWindows ? 'btn-ghost' : 'btn-primary'}" href="${esc(app.file)}" download>Mac Download</a>`
      : '<span class="btn btn-ghost" aria-disabled="true">Mac: coming soon</span>';
    const winBtn = win
      ? `<a class="btn ${isWindows ? 'btn-primary' : 'btn-ghost'}" href="${esc(app.windows.file)}" download data-win-dl="${esc(app.id)}">Windows Download</a>`
      : '<span class="btn btn-ghost" aria-disabled="true">Windows: coming soon</span>';
    return `
      <article class="card dl-card">
        <img class="app-icon" src="${esc(app.icon)}" alt="" width="64" height="64">
        <div>
          <h3>${esc(app.name)}</h3>
          <p class="muted small">${esc(app.blurb)}</p>
          <p class="faint xsmall meta">${esc(macMeta)}</p>
          <p class="faint xsmall meta">${esc(winMeta)}</p>
          ${notes(app, mac)}
        </div>
        <div class="dl-actions">
          <div class="dl-buttons">${isWindows ? winBtn + macBtn : macBtn + winBtn}</div>
          ${win ? winTerms(app) : ''}
          <a class="small" href="${esc(app.page)}#how-to-use">How to use it</a>
          ${app.source ? `<a class="xsmall faint" href="${esc(app.source)}" download>Mac source code (${esc(app.license || 'license')})</a>` : ''}
          ${win && app.windows.source ? `<a class="xsmall faint" href="${esc(app.windows.source)}" rel="noopener" data-win-dl="${esc(app.id)}">Windows source code (${esc(app.license || 'license')})</a>` : ''}
        </div>
      </article>`;
  }).join('');
  wireTerms();
}

let viaGoogle = false;
function unlock(email) {
  fill('[data-user-email]', email);
  renderApps();
  $('[data-not-mac]').hidden = isComputer;   // only phones and tablets see the "use your computer" note
  $('[data-signout]').hidden = !viaGoogle;
  show('in');
}

function showGate() {
  $('[data-google-wrap]').hidden = PREVIEW; // Google sign-in only once Firebase is set up
  show('gate');
}

// The email box
const form = $('[data-view="gate"] form[data-email-list]');
wireEmailForm(form, (email) => unlock(email));

// Already gave us their email on this browser? Go straight to the apps.
let decided = false;
onUser((user) => {
  if (user && !PREVIEW) {
    viaGoogle = true;
    if (savedEmail() !== user.email) { joinList(user.email, 'google'); saveEmail(user.email); }
    decided = true;
    return unlock(user.email);
  }
  viaGoogle = false;
  if (decided && !user) return; // signed out of Google: handled below
  decided = true;
  const email = savedEmail();
  if (email) unlock(email); else showGate();
});

$('[data-other-email]').addEventListener('click', async () => {
  forgetEmail();
  if (viaGoogle) { try { await signOutUser(); } catch (err) { console.error(err); } }
  form.reset();
  showGate();
  form.elements.email.focus();
});

$('[data-signout]').addEventListener('click', async () => {
  try { await signOutUser(); } catch (err) { console.error(err); }
  forgetEmail();
  showGate();
});

// Optional Google button (shown only when Firebase is connected)
skipAgeIfConfirmed($('[data-google-age]'));
$('[data-google]').addEventListener('click', async (e) => {
  const b = e.currentTarget;
  const age = $('[data-google-age]');
  if (!age.checked) {
    const msg = form.querySelector('[data-email-msg]');
    msg.textContent = 'Please check the box to confirm you’re 18 or older before signing in with Google.';
    msg.className = 'form-msg show error';
    age.focus();
    return;
  }
  confirmAge();
  b.disabled = true;
  try { await signInWithGoogle(); } catch (err) {
    if (err?.code !== 'auth/cancelled-popup-request') {
      const msg = form.querySelector('[data-email-msg]');
      msg.textContent = friendlyError(err);
      msg.className = 'form-msg show error';
    }
  } finally { b.disabled = false; }
});
