<script>
  import { enhance } from '$app/forms';
  import { onMount } from 'svelte';
  import Container from '#lib/components/Container.svelte';
  import Button from '#lib/components/Button.svelte';
  import FormMessage from '#lib/components/FormMessage.svelte';
  import PageHead from '#lib/components/contact/PageHead.svelte';
  import BottomNav from '#lib/components/admin/BottomNav.svelte';
  import Sidebar from '#lib/components/admin/Sidebar.svelte';
  import VolunteersEditor from '#lib/components/admin/VolunteersEditor.svelte';
  import AccountsEditor from '#lib/components/admin/AccountsEditor.svelte';
  import TeamEditor from '#lib/components/admin/TeamEditor.svelte';
  import TicketCard from '#lib/components/admin/TicketCard.svelte';
  import ApplicationCard from '#lib/components/admin/ApplicationCard.svelte';
  import DownloadsPanel from '#lib/components/admin/DownloadsPanel.svelte';
  import NewsletterPanel from '#lib/components/admin/NewsletterPanel.svelte';
  import NotifyToggle from '#lib/components/admin/NotifyToggle.svelte';
  import { cn } from '#lib/cn.js';

  let { data, form } = $props();

  // Admin 1 sees every tab. Admin 2 only gets Messages and Applications.
  const sections = [
    ...(data.level === 1 ? [{ id: 'people', label: 'Team', icon: 'team' }] : []),
    { id: 'tickets', label: 'Messages', icon: 'messages' },
    { id: 'applications', label: 'Applications', icon: 'applications' },
    { id: 'downloads', label: 'Downloads', icon: 'messages' },
    ...(data.level === 1 ? [{ id: 'newsletter', label: 'Newsletter', icon: 'messages' }] : []),
    ...(data.level === 1 ? [{ id: 'volunteers', label: 'Volunteers', icon: 'team' }] : []),
    ...(data.level === 1 ? [{ id: 'accounts', label: 'Accounts', icon: 'team' }] : [])
  ];
  const TABS = sections.map((s) => s.id);
  let tab = $state(TABS[0]);
  // When /admin is installed as an app (PWA), the tabs become a floating bottom bar, like a phone app.
  // ?nav=1 shows it in a normal browser tab too, for trying it out.
  let standalone = $state(false);
  // Installed app: the bar shows the first 4 sections, a "+" holds the rest, and a gear (top right) opens settings.
  const primary = $derived(standalone ? sections.slice(0, 4) : sections);
  const more = $derived(standalone ? sections.slice(4) : []);
  let settingsOpen = $state(false);
  onMount(() => {
    // Notifications open /admin?tab=tickets or ?tab=applications.
    const want = new URLSearchParams(location.search).get('tab');
    if (TABS.includes(want)) tab = want;
    navigator.serviceWorker?.register('/admin-sw.js', { scope: '/admin' }).catch(() => {});
    const mq = matchMedia('(display-mode: standalone)');
    const update = () => { standalone = mq.matches || navigator.standalone === true || new URLSearchParams(location.search).has('nav'); };
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  });

  const counts = $derived({ people: data.people.length, tickets: data.tickets.length, applications: data.applications.length, volunteers: data.volunteers.length, accounts: data.users.length, newsletter: data.subscribers.filter((s) => !s.unsubscribed).length, downloads: data.downloads.reduce((n, d) => n + d.count, 0) });
  const pick = (id) => { tab = id; settingsOpen = false; scrollTo({ top: 0 }); };
  const tabCls = (on) => cn('rounded-full border px-4 py-2 text-[.9rem] font-semibold', on ? 'border-ink bg-ink text-bg' : 'border-border-strong text-muted');
</script>

<svelte:head>
  <title>Admin · Programs For You</title>
  <meta name="robots" content="noindex, nofollow">
  <link rel="manifest" href="/admin.webmanifest">
</svelte:head>

<PageHead eyebrow="Admin" title="Dashboard" lead={data.level === 1 ? 'Manage the Team page, volunteers and accounts, and read contact messages and job applications.' : 'Read contact messages and job applications.'} />

<section class={cn('pt-2', standalone ? 'pb-36' : 'pb-18')}>
  <Container class={data.authed && !standalone ? 'max-w-[1760px]' : 'max-w-[820px]'}>
    {#if data.authed}
      <div class={cn(!standalone && 'lg:grid lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-10')}>
      {#if !standalone}<Sidebar class="max-lg:hidden" {sections} counts={counts} active={tab} onselect={pick} />{/if}
      <div class={cn('min-w-0', tab !== 'people' && tab !== 'accounts' && tab !== 'volunteers' && 'max-w-[820px]')}>
      {#if standalone}
        <button type="button" class="fixed top-[calc(12px+env(safe-area-inset-top))] right-3 z-50 grid size-11 cursor-pointer place-items-center rounded-full border border-border-strong bg-bg text-ink" aria-label="Settings" aria-expanded={settingsOpen} onclick={() => (settingsOpen = !settingsOpen)}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-[22px]" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" /></svg>
        </button>
      {:else}
        <div class="mb-4 flex items-center justify-between gap-3 lg:hidden">
          <a href="/account" class="text-[.9rem]">Your account</a>
          <form method="POST" action="?/logout" use:enhance><Button type="submit" variant="outline" size="sm">Log out</Button></form>
        </div>
      {/if}
      <!-- Always mounted (it asks for notification permission on first open); in the installed app it lives in the settings panel. -->
      <div class={cn(standalone && 'fixed top-[calc(64px+env(safe-area-inset-top))] right-3 left-3 z-50 mx-auto max-w-[420px] flex-col gap-4 rounded-[20px] border border-border-strong bg-bg p-4 shadow-[0_10px_30px_rgba(0,0,0,.15)]', standalone && (settingsOpen ? 'flex' : 'hidden'))}>
        <NotifyToggle vapidKey={data.vapidKey} />
        {#if standalone}
          <div class="flex items-center justify-between gap-3 border-t border-border pt-4">
            <a href="/account" class="text-[.9rem]">Your account</a>
            <form method="POST" action="?/logout" use:enhance><Button type="submit" variant="outline" size="sm">Log out</Button></form>
          </div>
        {/if}
      </div>
      <FormMessage text={form?.message ?? ''} kind="ok" />
      <FormMessage text={form?.error ?? ''} />

      <div class={cn('mb-5 flex flex-wrap gap-2', standalone ? 'hidden' : 'lg:hidden')} role="tablist">
        {#each sections as s (s.id)}
          <button type="button" role="tab" aria-selected={tab === s.id} class={tabCls(tab === s.id)} onclick={() => (tab = s.id)}>
            {s.label} <span class="opacity-70">({counts[s.id]})</span>
          </button>
        {/each}
      </div>

      {#if tab === 'people'}
        <TeamEditor people={data.people} {standalone} />
      {:else if tab === 'volunteers'}
        <VolunteersEditor volunteers={data.volunteers} />
      {:else if tab === 'accounts'}
        <AccountsEditor users={data.users} me={data.me} />
      {:else if tab === 'newsletter'}
        <NewsletterPanel subscribers={data.subscribers} />
      {:else if tab === 'downloads'}
        <DownloadsPanel downloads={data.downloads} />
      {:else if tab === 'tickets'}
        {#each data.tickets as t (t.id)}<TicketCard ticket={t} />{:else}<p class="text-muted">No messages yet.</p>{/each}
      {:else}
        {#each data.applications as a (a.id)}<ApplicationCard application={a} canAdd={data.level === 1} />{:else}<p class="text-muted">No applications yet.</p>{/each}
      {/if}
      </div>
      </div>
    {/if}
  </Container>
</section>

{#if data.authed && standalone}
  <BottomNav items={primary} {more} active={tab} onselect={pick} />
{/if}
