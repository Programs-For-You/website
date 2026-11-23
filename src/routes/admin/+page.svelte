<script>
  import { enhance } from '$app/forms';
  import Container from '#lib/components/Container.svelte';
  import Button from '#lib/components/Button.svelte';
  import FormMessage from '#lib/components/FormMessage.svelte';
  import PageHead from '#lib/components/contact/PageHead.svelte';
  import BottomNav from '#lib/components/admin/BottomNav.svelte';
  import { onMount } from 'svelte';
  import { cn } from '#lib/cn.js';
  import { input, field, fieldLabel, check } from '#lib/ui.js';

  let { data, form } = $props();

  let tab = $state('people');
  // When /admin is installed as an app (PWA), the tabs become a floating bottom bar, like a phone app.
  // ?nav=1 shows it in a normal browser tab too, for trying it out.
  let standalone = $state(false);
  onMount(() => {
    const mq = matchMedia('(display-mode: standalone)');
    const update = () => { standalone = mq.matches || navigator.standalone === true || new URLSearchParams(location.search).has('nav'); };
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  });
  let addKey = $state(0); // bumped after a save so the Add-someone card clears
  const tabs = $derived([
    ['people', 'Team', data.people.length],
    ['tickets', 'Messages', data.tickets.length],
    ['applications', 'Applications', data.applications.length]
  ]);
  const navItems = [
    { id: 'people', label: 'Team', icon: 'team' },
    { id: 'tickets', label: 'Messages', icon: 'messages' },
    { id: 'applications', label: 'Applications', icon: 'applications' }
  ];
  function pick(id) { tab = id; scrollTo({ top: 0 }); }
  // created_at is stored as UTC "YYYY-MM-DD HH:MM:SS"; show it in the viewer's timezone.
  const when = (s) => new Date(s.replace(' ', 'T') + 'Z').toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
  const tabCls = (on) => cn('rounded-full border px-4 py-2 text-[.9rem] font-semibold', on ? 'border-ink bg-ink text-bg' : 'border-border-strong text-muted');
  const card = 'rounded-card-lg border border-border bg-surface p-6';
  const blank = { id: '', sort: 0, name: '', title: '', note: '', founder: 0, soon: 0 };
</script>

<svelte:head>
  <title>Admin · Programs For You</title>
  <meta name="robots" content="noindex, nofollow">
</svelte:head>

<PageHead eyebrow="Admin" title="Dashboard" lead="Manage the Team page, and read contact messages and job applications." />

<section class={cn('pt-2', standalone ? 'pb-36' : 'pb-18')}>
  <Container class="max-w-[820px]">
    {#if !data.authed}
      <form class={card} method="POST" action="?/login" use:enhance>
        <div class={field}><label class={fieldLabel} for="pw">Password</label>
          <input class={input} id="pw" name="password" type="password" autocomplete="current-password" required></div>
        <FormMessage text={form?.error ?? ''} />
        <Button type="submit">Log in</Button>
      </form>
    {:else}
      <div class="mb-4 flex items-center justify-between gap-3">
        <a href="/team" class="text-[.9rem]">View Team page →</a>
        <form method="POST" action="?/logout" use:enhance><Button type="submit" variant="outline" size="sm">Log out</Button></form>
      </div>
      <FormMessage text={form?.message ?? ''} kind="ok" />
      <FormMessage text={form?.error ?? ''} />

      <div class={cn('mb-5 flex flex-wrap gap-2', standalone && 'hidden')} role="tablist">
        {#each tabs as [id, label, n]}
          <button type="button" role="tab" aria-selected={tab === id} class={tabCls(tab === id)} onclick={() => (tab = id)}>{label} <span class="opacity-70">({n})</span></button>
        {/each}
      </div>

      {#snippet editor(p, isNew)}
        {@const k = isNew ? 'new' : p.id}
        <div class={cn(card, 'mb-4')}>
          <input type="hidden" name="row" value={k}>
          <div class="grid grid-cols-[1fr_1fr_80px] gap-x-3.5 max-[640px]:grid-cols-2">
            <div class={field}><label class={fieldLabel} for="n{k}">Name</label>
              <input class={input} id="n{k}" name="name_{k}" value={p.name ?? ''} autocomplete="off"></div>
            <div class={field}><label class={fieldLabel} for="t{k}">Title</label>
              <input class={input} id="t{k}" name="title_{k}" value={p.title} autocomplete="off"></div>
            <div class={field}><label class={fieldLabel} for="s{k}">Order</label>
              <input class={input} id="s{k}" name="sort_{k}" type="number" value={p.sort}></div>
          </div>
          <div class={field}><label class={fieldLabel} for="o{k}">Note <span class="text-faint">(optional)</span></label>
            <input class={input} id="o{k}" name="note_{k}" value={p.note ?? ''} maxlength="300" autocomplete="off"></div>
          <div class="flex flex-wrap items-center gap-x-6">
            <label class={cn(check, 'mb-0')}><input type="checkbox" name="founder_{k}" checked={Boolean(p.founder)}><span>Founder</span></label>
            <label class={cn(check, 'mb-0')}><input type="checkbox" name="soon_{k}" checked={Boolean(p.soon)}><span>Open spot (“Coming soon”)</span></label>
            {#if !isNew}
              <Button type="submit" variant="outline" size="sm" class="ml-auto" name="removeId" value={p.id} formaction="?/remove" formnovalidate
                onclick={(e) => { if (!confirm(`Remove ${p.name || 'this spot'} from the Team page? Unsaved edits on this page are kept.`)) e.preventDefault(); }}>Remove</Button>
            {/if}
          </div>
        </div>
      {/snippet}

      {#snippet del(action, id, label)}
        <form method="POST" {action} use:enhance={() => async ({ update }) => update()}>
          <input type="hidden" name="id" value={id}>
          <Button type="submit" variant="outline" size="sm"
            onclick={(e) => { if (!confirm(`Delete ${label}? This can’t be undone.`)) e.preventDefault(); }}>Delete</Button>
        </form>
      {/snippet}

      {#if tab === 'people'}
        <form method="POST" action="?/saveAll"
          use:enhance={() => async ({ result, update }) => { if (result.type === 'success') addKey++; await update({ reset: false }); }}>
          {#each data.people as p (p.id)}{@render editor(p, false)}{/each}
          <h2 class="mt-8 mb-3 text-[1.2rem]">Add someone</h2>
          {#key addKey}{@render editor(blank, true)}{/key}
          <!-- One Save for the whole tab, always in reach at the bottom of the screen. -->
          <!-- In the installed app the bar sits above the floating tab bar. -->
          <div class={cn('sticky z-10 -mx-1 mt-2 flex items-center gap-3 border-t border-border bg-bg/95 px-1 py-3 backdrop-blur', standalone ? 'bottom-[calc(96px+env(safe-area-inset-bottom))]' : 'bottom-0')}>
            <Button type="submit">Save all changes</Button>
            <span class="text-[.85rem] text-faint">Saves every card above, including a new person if you filled one in.</span>
          </div>
        </form>
      {:else if tab === 'tickets'}
        {#each data.tickets as t (t.id)}
          <article class={cn(card, 'mb-4')}>
            <div class="mb-2 flex flex-wrap items-baseline justify-between gap-x-4">
              <h2 class="m-0 text-[1.05rem]">{t.name} <span class="font-mono text-[.8rem] font-normal text-faint">{t.id}</span></h2>
              <span class="text-[.82rem] text-faint">{when(t.created_at)}</span>
            </div>
            <p class="mb-2 text-[.9rem] text-muted"><a href={`mailto:${t.email}?subject=${encodeURIComponent('Re: ' + t.id)}`}>{t.email}</a> · {t.app}</p>
            <p class="mb-4 whitespace-pre-wrap">{t.summary}</p>
            {@render del('?/removeTicket', t.id, `ticket ${t.id}`)}
          </article>
        {:else}
          <p class="text-muted">No messages yet.</p>
        {/each}
      {:else}
        {#each data.applications as a (a.id)}
          <article class={cn(card, 'mb-4')}>
            <div class="mb-2 flex flex-wrap items-baseline justify-between gap-x-4">
              <h2 class="m-0 text-[1.05rem]">{a.name}</h2>
              <span class="text-[.82rem] text-faint">{when(a.created_at)}</span>
            </div>
            <p class="mb-3 text-[.9rem] text-muted"><a href={`mailto:${a.email}`}>{a.email}</a> · {a.grade} grade · {a.role} · {a.department}</p>
            <p class="mb-1 text-[.82rem] font-semibold">Why they want to join</p>
            <p class="mb-3 whitespace-pre-wrap">{a.why}</p>
            {#if a.skills}
              <p class="mb-1 text-[.82rem] font-semibold">Skills or experience</p>
              <p class="mb-3 whitespace-pre-wrap">{a.skills}</p>
            {/if}
            {@render del('?/removeApplication', a.id, `the application from ${a.name}`)}
          </article>
        {:else}
          <p class="text-muted">No applications yet.</p>
        {/each}
      {/if}
    {/if}
  </Container>
</section>

{#if data.authed && standalone}
  <BottomNav items={navItems} active={tab} onselect={pick} />
{/if}
