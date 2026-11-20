// © 2026 Brady Krupa and Arjun Bhanderi. All rights reserved.
// Runs on every page: header menu, account button, app status badges,
// contact links, the scaling Mac preview, and the clickable email-card demo.

import { onUser, signOutUser, PREVIEW } from './auth.js';
import { SITE, APPS, GAMES } from './config.js';
import { esc } from './util.js';
import { wireEmailForm } from './emaillist.js';

const CHEVRON = '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';

// ---------- Mobile menu ----------
const toggle = document.querySelector('.menu-toggle');
const nav = document.getElementById('site-nav');
toggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});

// ---------- Highlight the current page in the menu ----------
const here = location.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/index';
document.querySelectorAll('#site-nav a').forEach((a) => {
  const p = new URL(a.href).pathname.replace(/\.html$/, '');
  if (p === here) a.setAttribute('aria-current', 'page');
});

// ---------- Footer year + contact email ----------
document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });
document.querySelectorAll('[data-contact]').forEach((el) => {
  el.href = `mailto:${SITE.contactEmail}`;
  if (el.hasAttribute('data-contact-text')) el.textContent = SITE.contactEmail;
});

// ---------- "Coming soon" / "Free download" badges come from config.js ----------
document.querySelectorAll('[data-status-for]').forEach((el) => {
  const app = APPS.concat(GAMES).find((a) => a.id === el.dataset.statusFor);
  if (!app) return;
  const ready = app.status === 'available' && app.file;
  el.textContent = ready ? 'Free download' : 'Coming soon';
  el.className = `badge ${ready ? 'ok' : 'soon'}`;
});
document.querySelectorAll('[data-show-when-soon]').forEach((el) => {
  const app = APPS.concat(GAMES).find((a) => a.id === el.dataset.showWhenSoon);
  el.hidden = Boolean(app && app.status === 'available' && app.file);
});

// ---------- Account button in the header ----------
const slot = document.querySelector('[data-account]');

function initials(name) {
  return (name || '?').trim().split(/\s+/).map((s) => s[0]).slice(0, 2).join('').toUpperCase();
}

function closeMenu() {
  slot?.querySelector('.account-menu')?.setAttribute('hidden', '');
  slot?.querySelector('.avatar-btn')?.setAttribute('aria-expanded', 'false');
}

function renderAccount(user) {
  if (!slot) return;
  slot.classList.remove('pending');
  if (!user || PREVIEW) {
    slot.innerHTML = '<a class="btn btn-primary btn-sm" href="/download.html">Get the apps</a>';
    return;
  }
  const face = user.photo
    ? `<img src="${esc(user.photo)}" alt="" referrerpolicy="no-referrer">`
    : esc(initials(user.name));
  slot.innerHTML = `
    <button class="avatar-btn" type="button" aria-haspopup="true" aria-expanded="false">
      <span class="avatar">${face}</span><span class="avatar-name">${esc(user.name.split(' ')[0])}</span>${CHEVRON}
    </button>
    <div class="account-menu" hidden>
      <div class="who"><b>${esc(user.name)}</b><span>${esc(user.email)}</span></div>
      <a href="/download.html">My downloads</a>
      <a href="/install.html">How to install</a>
      <button type="button" data-menu-signout>Sign out</button>
    </div>`;
  const btn = slot.querySelector('.avatar-btn');
  const menu = slot.querySelector('.account-menu');
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = menu.hasAttribute('hidden');
    menu.toggleAttribute('hidden', !open);
    btn.setAttribute('aria-expanded', String(open));
  });
  slot.querySelector('[data-menu-signout]').addEventListener('click', async () => {
    closeMenu();
    try { await signOutUser(); } catch (err) { console.error(err); }
  });
}

document.addEventListener('click', (e) => { if (!slot?.contains(e.target)) closeMenu(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
onUser(renderAccount);

// ---------- The Mac preview scales like a picture ----------
document.querySelectorAll('.mac').forEach((mac) => {
  const fit = () => mac.style.setProperty('--s', String(Math.min(1, mac.clientWidth / 980)));
  fit();
  if ('ResizeObserver' in window) new ResizeObserver(fit).observe(mac);
  else window.addEventListener('resize', fit);
});

// ---------- Clickable email-card demo ----------
document.querySelectorAll('[data-demo]').forEach((card) => {
  const opts = [...card.querySelectorAll('.ask-opt')];
  const note = card.querySelector('[data-demo-note]');
  const select = (opt) => {
    opts.forEach((o) => {
      o.setAttribute('aria-checked', String(o === opt));
      o.tabIndex = o === opt ? 0 : -1;
    });
    if (note) note.textContent = '';
  };
  opts.forEach((opt, i) => {
    opt.addEventListener('click', (e) => {
      select(opt);
      if (opt.classList.contains('other') && e.target.tagName !== 'INPUT') opt.querySelector('input')?.focus();
    });
    opt.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT') return;
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); select(opt); }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const next = opts[(i + (e.key === 'ArrowDown' ? 1 : -1) + opts.length) % opts.length];
        select(next);
        next.focus();
      }
    });
  });
  card.querySelector('.other input')?.addEventListener('focus', (e) => select(e.target.closest('.ask-opt')));
  card.querySelectorAll('[data-demo-action]').forEach((b) => b.addEventListener('click', () => {
    if (!note) return;
    note.textContent = b.dataset.demoAction === 'send'
      ? 'Just a demo, so nothing was sent.'
      : 'Skipped. In the app, the next email shows up here.';
  }));
});

// ---------- Email list sign-up forms (the Downloads page handles its own) ----------
document.querySelectorAll('form[data-email-list]').forEach((form) => {
  if (form.closest('[data-view="gate"]')) return;
  wireEmailForm(form, (email, say) => {
    form.elements.email.value = '';
    say(`You’re on the list! We’ll email ${email} when something new comes out.`, 'ok');
  });
});

// ---------- Copy buttons (like the Windows calendar code) ----------
document.querySelectorAll('[data-copy]').forEach((b) => b.addEventListener('click', async () => {
  const label = b.querySelector('span') || b;
  const before = label.textContent;
  let ok = false;
  try { await navigator.clipboard.writeText(b.dataset.copy); ok = true; } catch {
    const code = b.closest('div, li')?.querySelector('.year-code');   // fall back: select the code to copy by hand
    if (code) getSelection().selectAllChildren(code);
  }
  label.textContent = ok ? 'Copied!' : 'Press Ctrl+C to copy';
  setTimeout(() => { label.textContent = before; }, 2000);
}));
