<script>
  import { onMount } from 'svelte';
  import Seo from '#lib/components/Seo.svelte';
  import Container from '#lib/components/Container.svelte';
  import Card from '#lib/components/Card.svelte';
  import Button from '#lib/components/Button.svelte';
  import Badge from '#lib/components/Badge.svelte';
  import PageHead from '#lib/components/contact/PageHead.svelte';
  import DataTable from '#lib/components/admin/DataTable.svelte';
  import { SITE } from '#lib/config.js';
  import { cn } from '#lib/cn.js';
  import { input, field, fieldLabel, check } from '#lib/ui.js';

  // Admin (owners only): the email list, job applications (with Approve / Decline), support tickets, and Windows
  // agreements, read straight from Netlify Forms with the owner's own Netlify access token.
  // The token is kept only in this browser (and only for this visit unless "Remember" is checked). It's never sent
  // anywhere except Netlify. Approve / Decline decisions are saved as entries in the "application-decision" form,
  // so they show up on every computer.
  const API = 'https://api.netlify.com/api/v1';
  const KEY = 'pfy-admin-token';
  const linkBtn = 'cursor-pointer border-0 bg-transparent p-0 text-accent hover:underline hover:underline-offset-[3px]';

  let token = '';
  let stage = $state(''); // '' (deciding) | 'signin' | 'board'
  let note = $state({ text: '', kind: 'error' });
  let status = $state('');
  let loading = $state(false);
  let data = $state({ apps: [], list: [], tickets: [], terms: [], decisions: {} });
  let tab = $state('applications');
  let filter = $state('new');

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
    note = { text, kind };
  }

  async function load() {
    note = { text: '', kind: 'error' };
    loading = true;
    status = 'Loading from Netlify…';
    try {
      const site = await findSite();
      if (!site) throw new Error(`Couldn’t find ${SITE.domain} in your Netlify account. Is this the right token?`);
      const forms = await api(`/sites/${site.id}/forms`);
      const byName = Object.fromEntries(forms.map((f) => [f.name, f]));
      const get = async (name) => (byName[name] ? submissions(byName[name].id) : []);
      const [apps, list, tickets, terms, decisions] = await Promise.all([
        get('job-application'), get('email-list'), get('support-ticket'), get('windows-terms'), get('application-decision')]);
      const decided = {};
      // Oldest first, so the newest decision for each application wins.
      decisions.sort((a, b) => a.created_at.localeCompare(b.created_at))
        .forEach((d) => { decided[d.data.application] = d.data.decision; });
      data = { apps, list, tickets, terms, decisions: decided };
      if (!forms.length) say('Netlify doesn’t have any forms for this site yet. In Netlify, open your site → Forms → Enable form detection, then upload the website folder again.', 'info');
      status = `${site.name} · updated ${new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
    } catch (e) {
      if (e.message === 'signin') {
        forgetToken();
        showSignin('That token didn’t work (it may have expired). Make a new one and paste it here.');
      } else {
        say(e.message || 'Couldn’t reach Netlify. Check your internet and click Refresh.');
        status = '';
      }
    } finally {
      loading = false;
    }
  }

  const when = (s) => new Date(s).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  const statusOf = (a) => data.decisions[a.id] || 'new';
  const first = (name) => String(name || '').trim().split(/\s+/)[0] || 'there';

  function mailto(to, subject, body) {
    return `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  function welcome(a) {
    const d = a.data;
    return mailto(d.email, 'Welcome to the Programs For You team!',
      `Hi ${first(d.name)},\n\nThanks for applying to Programs For You. We’d love to have you join the team as ${/^[aeiou]/i.test(d.role || '') ? 'an' : 'a'} ${d.role || 'team member'}`
      + `${d.department && d.department !== 'Not sure yet' ? ` in ${d.department}` : ''}!\n\nWe’ll be in touch soon about next steps.\n\nThe Programs For You team\nProgramsForYou.com`);
  }

  function decline(a) {
    return mailto(a.data.email, 'Your Programs For You application',
      `Hi ${first(a.data.name)},\n\nThanks so much for applying to Programs For You. We can’t offer you a spot right now, but we really appreciate your interest, and you’re welcome to apply again later.\n\nThe Programs For You team\nProgramsForYou.com`);
  }

  const counts = $derived({
    applications: data.apps.filter((a) => statusOf(a) === 'new').length,
    list: new Set(data.list.map((s) => (s.data.email || '').toLowerCase())).size,
    tickets: data.tickets.length,
    terms: data.terms.length,
  });
  const tabs = [['applications', 'Applications'], ['list', 'Email list'], ['tickets', 'Tickets'], ['terms', 'Windows agreements']];
  const shown = $derived(data.apps.filter((a) => filter === 'all' || statusOf(a) === filter));
  const people = $derived.by(() => {
    const seen = new Set();
    return data.list.filter((s) => { const e = (s.data.email || '').toLowerCase(); return e && !seen.has(e) && seen.add(e); });
  });
  const badgeOf = { new: ['neutral', 'New'], approved: ['ok', 'Approved'], declined: ['soon', 'Declined'] };

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
      data.decisions = { ...data.decisions, [id]: decision };
    } catch {
      say('Couldn’t save that decision. Check your internet and try again.');
    }
  }

  function csv() {
    const rows = [['email', 'signed up from', 'date']];
    people.forEach((s) => rows.push([s.data.email, s.data.source || '', s.created_at]));
    const text = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type: 'text/csv' }));
    a.download = `email-list-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  }

  function showSignin(message) {
    token = '';
    stage = 'signin';
    if (message) say(message);
  }

  function showBoard() {
    stage = 'board';
    load();
  }

  function signin(e) {
    e.preventDefault();
    const t = e.target.elements.token.value.trim();
    if (t.length < 20) return say('Paste the whole Netlify access token.');
    token = t;
    saveToken(t, e.target.elements.remember.checked);
    e.target.reset();
    showBoard();
  }

  function signout() {
    forgetToken();
    showSignin();
    note = { text: '', kind: 'error' };
  }

  onMount(() => {
    token = savedToken();
    if (token) showBoard(); else showSignin();
  });
</script>

<Seo title="Admin · Programs For You" description="Owners only." noindex />

<PageHead eyebrow="Owners only" title="Admin" lead="Your email list, job applications (with Approve and Decline), support tickets, and Windows agreements, all in one place." />
<section class="pt-2 pb-18">
  <Container>
    <div role="status" class={cn('mb-4 rounded-[10px] px-3 py-2.5 text-[.9rem]', !note.text && 'hidden', note.kind === 'error' && 'bg-danger-soft text-danger', note.kind === 'ok' && 'bg-ok-soft text-ok')}>{note.text}</div>

    <div class="grid grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-start gap-5 max-[800px]:grid-cols-1" hidden={stage !== 'signin'}>
      <Card tag="form" onsubmit={signin} autocomplete="off">
        <h2 class="mb-1.5 text-[1.3rem]">Open with your Netlify key</h2>
        <p class="text-muted">This page reads your forms straight from Netlify, so it needs a Netlify <b>access token</b> (a long password made just for this). It stays in this browser and is only sent to Netlify.</p>
        <div class={field}><label class={fieldLabel} for="adm-token">Netlify access token</label>
          <input class={input} id="adm-token" name="token" type="password" placeholder="Paste it here" spellcheck="false" required></div>
        <label class={cn(check, 'mb-4 items-center gap-2 text-[.9rem] [&_input]:mt-0')}><input type="checkbox" name="remember"> Remember on this computer</label>
        <Button type="submit">Open admin</Button>
      </Card>
      <Card>
        <h3>How to get your token (one time)</h3>
        <ol class="grid list-decimal gap-1.5 pl-5 text-[.93rem] text-muted">
          <li>Go to <a href="https://app.netlify.com/user/applications#personal-access-tokens" target="_blank" rel="noopener">app.netlify.com → User settings → Applications</a>.</li>
          <li>Under <b>Personal access tokens</b>, click <b>New access token</b>.</li>
          <li>Name it <b>Programs For You admin</b>, pick how long it lasts, and click <b>Generate token</b>.</li>
          <li>Copy it and paste it on the left. Don’t share it with anyone: it can change your Netlify account.</li>
        </ol>
      </Card>
    </div>

    <div hidden={stage !== 'board'}>
      <div class="mb-[18px] flex flex-wrap items-center justify-between gap-3">
        <div class="flex flex-wrap gap-1 rounded-full border border-border bg-surface-2 p-1" role="tablist">
          {#each tabs as [id, label]}
            <button role="tab" aria-selected={tab === id} onclick={() => (tab = id)}
              class="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border-0 bg-transparent px-3.5 text-[.88rem] font-semibold text-muted aria-selected:bg-surface aria-selected:text-ink aria-selected:shadow-[0_1px_3px_rgb(0_0_0/.12)]">{label}
              <span class="inline-grid h-5 min-w-5 place-items-center rounded-full bg-accent-soft px-1.5 text-[.74rem] text-accent">{counts[id]}</span></button>
          {/each}
        </div>
        <div class="flex items-center gap-2.5"><span class="text-[.8rem] text-faint">{status}</span>
          <Button variant="ghost" size="sm" onclick={load} disabled={loading}>Refresh</Button>
          <button type="button" class={linkBtn} onclick={signout}>Sign out</button></div>
      </div>
      <div class="grid gap-3">
        {#if tab === 'applications'}
          <div class="flex flex-wrap gap-1.5">
            {#each ['new', 'approved', 'declined', 'all'] as f}
              <button type="button" aria-pressed={f === filter} onclick={() => (filter = f)}
                class="h-[30px] cursor-pointer rounded-full border border-border bg-surface px-3 text-[.82rem] font-semibold text-muted aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-bg">{f[0].toUpperCase() + f.slice(1)}</button>
            {/each}
          </div>
          {#if shown.length}
            {#each shown as a (a.id)}
              {@const d = a.data}
              {@const st = statusOf(a)}
              <Card tag="article" class="px-5 py-[18px] [&>p]:mt-2.5 [&>p]:mb-0 [&>p]:text-muted [&>p_b]:text-ink">
                <div class="flex items-start justify-between gap-3"><div><h3 class="mb-0.5 flex flex-wrap items-center gap-2 text-[1.05rem]">{d.name || 'No name'} <Badge tone={badgeOf[st]?.[0]} class="h-[22px] text-[.74rem]">{badgeOf[st]?.[1]}</Badge></h3>
                  <p class="text-[.9rem] text-muted"><a href={`mailto:${d.email}`}>{d.email}</a> · {d.grade || ''} grade · {d.role || ''} · {d.department || ''}</p></div>
                  <time class="text-[.8rem] text-faint">{when(a.created_at)}</time></div>
                <p><b>Why:</b> {d.why || ''}</p>
                {#if d.skills}<p><b>Skills:</b> {d.skills}</p>{/if}
                <div class="mt-3.5 flex flex-wrap items-center gap-x-3 gap-y-2">
                  {#if st === 'new'}
                    <Button size="sm" onclick={() => decide(a.id, 'approved')}>Approve</Button>
                    <Button variant="ghost" size="sm" onclick={() => decide(a.id, 'declined')}>Decline</Button>
                  {:else}
                    <Button variant={st === 'approved' ? 'primary' : 'ghost'} size="sm" href={st === 'approved' ? welcome(a) : decline(a)}>Email {first(d.name)}</Button>
                    <button type="button" class={linkBtn} onclick={() => decide(a.id, 'new')}>Undo</button>
                  {/if}
                </div>
                {#if st === 'approved'}
                  <p class="mt-2.5! mb-0 text-[.85rem]">To put {d.name} on the Team page, tell Claude: <b>“add {d.name} as {d.role || 'Intern'}{d.department && d.department !== 'Not sure yet' ? ` in ${d.department}` : ''}”</b>.</p>
                {/if}
              </Card>
            {/each}
          {:else}
            <p class="text-muted">No {filter === 'all' ? '' : filter + ' '}applications.</p>
          {/if}
        {:else if tab === 'list'}
          <div class="flex flex-wrap items-center justify-between gap-2.5"><p class="m-0 text-muted">{people.length} {people.length === 1 ? 'person' : 'people'} on the email list.</p>
            <Button variant="ghost" size="sm" onclick={csv}>Download as spreadsheet (CSV)</Button></div>
          <DataTable heads={['Email', 'Signed up from', 'When']} rows={people}>
            {#snippet cells(s)}
              <td><a href={`mailto:${s.data.email}`}>{s.data.email}</a></td><td>{s.data.source || ''}</td><td>{when(s.created_at)}</td>
            {/snippet}
          </DataTable>
        {:else if tab === 'tickets'}
          {#if data.tickets.length}
            {#each data.tickets as t}
              <Card tag="article" class="px-5 py-[18px] [&>p]:mt-2.5 [&>p]:mb-0 [&>p]:text-muted">
                <div class="flex items-start justify-between gap-3"><div><h3 class="mb-0.5 flex flex-wrap items-center gap-2 text-[1.05rem]">{t.data.ticket || 'Ticket'} · {t.data.name || ''}</h3>
                  <p class="text-[.9rem] text-muted">{t.data.app || ''} · <a href={`mailto:${t.data.email}`}>{t.data.email || ''}</a></p></div>
                  <time class="text-[.8rem] text-faint">{when(t.created_at)}</time></div>
                <p>{t.data.summary || ''}</p>
                <div class="mt-3.5 flex flex-wrap items-center gap-x-3 gap-y-2"><Button variant="ghost" size="sm" href={mailto(t.data.email, `Re: your ticket ${t.data.ticket || ''}`, `Hi ${first(t.data.name)},\n\n`)}>Reply</Button></div>
              </Card>
            {/each}
          {:else}
            <p class="text-muted">No tickets yet.</p>
          {/if}
        {:else}
          <p class="text-muted">Old records from the Windows download, which is no longer offered. You can delete them in Netlify → Forms.</p>
          <DataTable heads={['Email', 'App', 'Terms version', 'When']} rows={data.terms}>
            {#snippet cells(s)}
              <td>{s.data.email || '(not given)'}</td><td>{s.data.app || ''}</td><td>{s.data.version || ''}</td><td>{when(s.created_at)}</td>
            {/snippet}
          </DataTable>
        {/if}
      </div>
    </div>

    <form name="application-decision" method="POST" data-netlify="true" netlify-honeypot="company" hidden>
      <input type="hidden" name="form-name" value="application-decision">
      <input name="application"><input name="name"><input name="email"><input name="decision"><input name="decided_at"><input name="company">
    </form>
  </Container>
</section>
