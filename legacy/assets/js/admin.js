// © 2026 Brady Krupa and Arjun Bhanderi. All rights reserved.
// Admin (owners only): the email list, job applications (with Approve / Decline), support tickets, and Windows
// agreements, read straight from Netlify Forms with the owner's own Netlify access token.
// The token is kept only in this browser (and only for this visit unless "Remember" is checked). It's never sent
// anywhere except Netlify. Approve / Decline decisions are saved as entries in the "application-decision" form,
// so they show up on every computer.
import { SITE } from './config.js';
import { esc } from './util.js';

const API = 'https://api.netlify.com/api/v1';
const KEY = 'pfy-admin-token';
const $ = (sel, root = document) => root.querySelector(sel);
const signin = $('[data-admin-signin]');
const board = $('[data-admin-board]');
const note = $('[data-admin-msg]');

let token = '';
let data = { apps: [], list: [], tickets: [], terms: [], decisions: new Map() };
let tab = 'applications';
let filter = 'new';

function savedToken() {
  try { return sessionStorage.getItem(KEY) || localStorage.getItem(KEY) || ''; } catch { return ''; }
}
function saveToken(t, remember) {
  try {
    sessionStorage.setItem(KEY, t);
    if (remember) localStorage.setItem(KEY, t); else localStorage.removeItem(KEY);
  } catch { /* storage blocked: it works until the page closes */ }
}
function forgetToken() {
  try { sessionStorage.removeItem(KEY); localStorage.removeItem(KEY); } catch { /* nothing saved */ }
}

async function api(path) {
  const r = await fetch(API + path, { headers: { Authorization: `Bearer ${token}` } });
  if (r.status === 401 || r.status === 403) throw new Error('signin');
  if (!r.ok) throw new Error(`Netlify answered ${r.status}.`);
  return r.json();
}

/** Every entry of one form (100 per page). */
async function submissions(formId) {
  const all = [];
  for (let page = 1; page < 50; page += 1) {
    const batch = await api(`/forms/${formId}/submissions?per_page=100&page=${page}`);
    all.push(...batch);
    if (batch.length < 100) break;
  }
  return all;
}

async function findSite() {
  const sites = await api('/sites?filter=all&per_page=100');
  const domain = SITE.domain.replace(/^www\./, '');
  return sites.find((s) => [s.custom_domain, ...(s.domain_aliases || [])].filter(Boolean).some((d) => d.replace(/^www\./, '') === domain))
    || sites.find((s) => (s.url || '').includes(domain));
}

function say(text, kind = 'error') {
  note.textContent = text;
  note.className = `form-msg show ${kind}`;
}

async function load() {
  note.className = 'form-msg';
  $('[data-admin-refresh]').disabled = true;
  $('[data-admin-status]').textContent = 'Loading from Netlify…';
  try {
    const site = await findSite();
    if (!site) throw new Error(`Couldn’t find ${SITE.domain} in your Netlify account. Is this the right token?`);
    const forms = await api(`/sites/${site.id}/forms`);
    const byName = Object.fromEntries(forms.map((f) => [f.name, f]));
    const get = async (name) => (byName[name] ? submissions(byName[name].id) : []);
    const [apps, list, tickets, terms, decisions] = await Promise.all([
      get('job-application'), get('email-list'), get('support-ticket'), get('windows-terms'), get('application-decision')]);
    data = { apps, list, tickets, terms, decisions: new Map() };
    // Oldest first, so the newest decision for each application wins.
    decisions.sort((a, b) => a.created_at.localeCompare(b.created_at))
      .forEach((d) => data.decisions.set(d.data.application, d.data.decision));
    if (!forms.length) say('Netlify doesn’t have any forms for this site yet. In Netlify, open your site → Forms → Enable form detection, then upload the website folder again.', 'info');
    $('[data-admin-status]').textContent = `${site.name} · updated ${new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
    render();
  } catch (e) {
    if (e.message === 'signin') {
      forgetToken();
      showSignin('That token didn’t work (it may have expired). Make a new one and paste it here.');
    } else {
      say(e.message || 'Couldn’t reach Netlify. Check your internet and click Refresh.');
      $('[data-admin-status]').textContent = '';
    }
  } finally {
    $('[data-admin-refresh]').disabled = false;
  }
}

const when = (s) => new Date(s).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
const statusOf = (a) => data.decisions.get(a.id) || 'new';
const first = (name) => String(name || '').trim().split(/\s+/)[0] || 'there';

function mailto(to, subject, body) {
  return `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function welcome(a) {
  const d = a.data;
  return mailto(d.email, 'Welcome to the Programs For You team!',
    `Hi ${first(d.name)},\n\nThanks for applying to Programs For You. We’d love to have you join the team as ${/^[aeiou]/i.test(d.role || '') ? 'an' : 'a'} ${d.role || 'team member'}`
    + `${d.department && d.department !== 'Not sure yet' ? ` in ${d.department}` : ''}!\n\nWe’ll be in touch soon about next steps.\n\nBrady and Arjun\nProgramsForYou.com`);
}

function decline(a) {
  return mailto(a.data.email, 'Your Programs For You application',
    `Hi ${first(a.data.name)},\n\nThanks so much for applying to Programs For You. We can’t offer you a spot right now, but we really appreciate your interest, and you’re welcome to apply again later.\n\nBrady and Arjun\nProgramsForYou.com`);
}

function applicationCard(a) {
  const d = a.data;
  const st = statusOf(a);
  const badge = { new: '<span class="badge">New</span>', approved: '<span class="badge ok">Approved</span>', declined: '<span class="badge soon">Declined</span>' }[st] || '';
  const actions = st === 'new'
    ? `<button class="btn btn-primary btn-sm" data-decide="approved" data-id="${esc(a.id)}">Approve</button>
       <button class="btn btn-ghost btn-sm" data-decide="declined" data-id="${esc(a.id)}">Decline</button>`
    : `<a class="btn ${st === 'approved' ? 'btn-primary' : 'btn-ghost'} btn-sm" href="${esc(st === 'approved' ? welcome(a) : decline(a))}">Email ${esc(first(d.name))}</a>
       <button class="link-btn" data-decide="new" data-id="${esc(a.id)}">Undo</button>`;
  const team = st === 'approved'
    ? `<p class="adm-hint">To put ${esc(d.name)} on the Team page, tell Claude: <b>“add ${esc(d.name)} as ${esc(d.role || 'Intern')}${d.department && d.department !== 'Not sure yet' ? ` in ${esc(d.department)}` : ''}”</b>.</p>` : '';
  return `<article class="card adm-app">
    <div class="adm-app-head"><div><h3>${esc(d.name || 'No name')} ${badge}</h3>
      <p class="muted small"><a href="mailto:${esc(d.email)}">${esc(d.email)}</a> · ${esc(d.grade || '')} grade · ${esc(d.role || '')} · ${esc(d.department || '')}</p></div>
      <time class="faint xsmall">${esc(when(a.created_at))}</time></div>
    <p><b>Why:</b> ${esc(d.why || '')}</p>
    ${d.skills ? `<p><b>Skills:</b> ${esc(d.skills)}</p>` : ''}
    <div class="adm-actions">${actions}</div>${team}
  </article>`;
}

function table(rows, cols) {
  if (!rows.length) return '<p class="muted">Nothing here yet.</p>';
  return `<div class="adm-table-wrap"><table class="adm-table"><thead><tr>${cols.map((c) => `<th>${esc(c[0])}</th>`).join('')}</tr></thead>
    <tbody>${rows.map((r) => `<tr>${cols.map((c) => `<td>${c[1](r)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

function render() {
  const counts = {
    applications: data.apps.filter((a) => statusOf(a) === 'new').length,
    list: new Set(data.list.map((s) => (s.data.email || '').toLowerCase())).size,
    tickets: data.tickets.length,
    terms: data.terms.length,
  };
  document.querySelectorAll('[data-tab]').forEach((b) => {
    b.setAttribute('aria-selected', String(b.dataset.tab === tab));
    b.querySelector('.count').textContent = counts[b.dataset.tab];
  });
  const box = $('[data-admin-view]');
  if (tab === 'applications') {
    const shown = data.apps.filter((a) => filter === 'all' || statusOf(a) === filter);
    box.innerHTML = `<div class="adm-filters">${['new', 'approved', 'declined', 'all'].map((f) =>
      `<button class="chip-btn" data-filter="${f}" aria-pressed="${f === filter}">${f[0].toUpperCase() + f.slice(1)}</button>`).join('')}</div>`
      + (shown.length ? shown.map(applicationCard).join('') : `<p class="muted">No ${filter === 'all' ? '' : filter + ' '}applications.</p>`);
  } else if (tab === 'list') {
    const seen = new Set();
    const people = data.list.filter((s) => { const e = (s.data.email || '').toLowerCase(); return e && !seen.has(e) && seen.add(e); });
    box.innerHTML = `<div class="adm-toolbar"><p class="muted">${people.length} ${people.length === 1 ? 'person' : 'people'} on the email list.</p>
      <button class="btn btn-ghost btn-sm" data-csv>Download as spreadsheet (CSV)</button></div>`
      + table(people, [['Email', (s) => `<a href="mailto:${esc(s.data.email)}">${esc(s.data.email)}</a>`], ['Signed up from', (s) => esc(s.data.source || '')], ['When', (s) => esc(when(s.created_at))]]);
  } else if (tab === 'tickets') {
    box.innerHTML = data.tickets.length ? data.tickets.map((t) => `<article class="card adm-app">
      <div class="adm-app-head"><div><h3>${esc(t.data.ticket || 'Ticket')} · ${esc(t.data.name || '')}</h3>
        <p class="muted small">${esc(t.data.app || '')} · <a href="mailto:${esc(t.data.email)}">${esc(t.data.email || '')}</a></p></div>
        <time class="faint xsmall">${esc(when(t.created_at))}</time></div>
      <p>${esc(t.data.summary || '')}</p>
      <div class="adm-actions"><a class="btn btn-ghost btn-sm" href="${esc(mailto(t.data.email, `Re: your ticket ${t.data.ticket || ''}`, `Hi ${first(t.data.name)},\n\n`))}">Reply</a></div>
    </article>`).join('') : '<p class="muted">No tickets yet.</p>';
  } else {
    box.innerHTML = `<p class="muted">People who agreed to Owen Wang’s Terms of Service before downloading the Windows version.</p>`
      + table(data.terms, [['Email', (s) => esc(s.data.email || '(not given)')], ['App', (s) => esc(s.data.app || '')], ['Terms version', (s) => esc(s.data.version || '')], ['When', (s) => esc(when(s.created_at))]]);
  }
}

async function decide(id, decision) {
  const a = data.apps.find((x) => x.id === id);
  if (!a) return;
  const body = new URLSearchParams({ 'form-name': 'application-decision', application: id, name: a.data.name || '', email: a.data.email || '',
    decision, decided_at: new Date().toISOString() });
  try {
    if (['localhost', '127.0.0.1'].includes(location.hostname)) console.info('[preview] Would save decision', Object.fromEntries(body));
    else {
      const r = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() });
      if (!r.ok) throw new Error();
    }
    data.decisions.set(id, decision);
    render();
  } catch {
    say('Couldn’t save that decision. Check your internet and try again.');
  }
}

function csv() {
  const seen = new Set();
  const rows = [['email', 'signed up from', 'date']];
  data.list.forEach((s) => {
    const e = (s.data.email || '').toLowerCase();
    if (e && !seen.has(e)) { seen.add(e); rows.push([s.data.email, s.data.source || '', s.created_at]); }
  });
  const text = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type: 'text/csv' }));
  a.download = `email-list-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
}

function showSignin(message) {
  token = '';
  signin.hidden = false;
  board.hidden = true;
  if (message) say(message);
}

function showBoard() {
  signin.hidden = true;
  board.hidden = false;
  load();
}

$('[data-admin-form]').addEventListener('submit', (e) => {
  e.preventDefault();
  const t = e.target.elements.token.value.trim();
  if (t.length < 20) return say('Paste the whole Netlify access token.');
  token = t;
  saveToken(t, e.target.elements.remember.checked);
  e.target.reset();
  showBoard();
});
$('[data-admin-refresh]').addEventListener('click', load);
$('[data-admin-signout]').addEventListener('click', () => { forgetToken(); showSignin(); note.className = 'form-msg'; });
document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-tab]');
  if (t) { tab = t.dataset.tab; render(); return; }
  const f = e.target.closest('[data-filter]');
  if (f) { filter = f.dataset.filter; render(); return; }
  const d = e.target.closest('[data-decide]');
  if (d) { decide(d.dataset.id, d.dataset.decide); return; }
  if (e.target.closest('[data-csv]')) csv();
});

token = savedToken();
if (token) showBoard(); else showSignin();
