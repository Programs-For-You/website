<script>
  import { enhance } from '$app/forms';
  import { onMount } from 'svelte';
  import Container from '#lib/components/Container.svelte';
  import Button from '#lib/components/Button.svelte';
  import FormMessage from '#lib/components/FormMessage.svelte';
  import PageHead from '#lib/components/contact/PageHead.svelte';
  import BottomNav from '#lib/components/admin/BottomNav.svelte';
  import Sidebar from '#lib/components/admin/Sidebar.svelte';
  import LoginForm from '#lib/components/admin/LoginForm.svelte';
  import TeamEditor from '#lib/components/admin/TeamEditor.svelte';
  import TicketCard from '#lib/components/admin/TicketCard.svelte';
  import ApplicationCard from '#lib/components/admin/ApplicationCard.svelte';
  import { cn } from '#lib/cn.js';

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

  const sections = [
    { id: 'people', label: 'Team', icon: 'team' },
    { id: 'tickets', label: 'Messages', icon: 'messages' },
    { id: 'applications', label: 'Applications', icon: 'applications' }
  ];
  const counts = $derived({ people: data.people.length, tickets: data.tickets.length, applications: data.applications.length });
  const pick = (id) => { tab = id; scrollTo({ top: 0 }); };
  const tabCls = (on) => cn('rounded-full border px-4 py-2 text-[.9rem] font-semibold', on ? 'border-ink bg-ink text-bg' : 'border-border-strong text-muted');
</script>

<svelte:head>
  <title>Admin · Programs For You</title>
  <meta name="robots" content="noindex, nofollow">
</svelte:head>

<PageHead eyebrow="Admin" title="Dashboard" lead="Manage the Team page, and read contact messages and job applications." />

<section class={cn('pt-2', standalone ? 'pb-36' : 'pb-18')}>
  <Container class={data.authed && !standalone ? 'max-w-[1760px]' : 'max-w-[820px]'}>
    {#if !data.authed}
      <LoginForm error={form?.error ?? ''} />
    {:else}
      <div class={cn(!standalone && 'lg:grid lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-10')}>
      {#if !standalone}<Sidebar class="max-lg:hidden" {sections} counts={counts} active={tab} onselect={pick} />{/if}
      <div class={cn('min-w-0', tab !== 'people' && 'max-w-[820px]')}>
      <div class={cn('mb-4 flex items-center justify-between gap-3', !standalone && 'lg:hidden')}>
        <a href="/team" class="text-[.9rem]">View Team page →</a>
        <form method="POST" action="?/logout" use:enhance><Button type="submit" variant="outline" size="sm">Log out</Button></form>
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
      {:else if tab === 'tickets'}
        {#each data.tickets as t (t.id)}<TicketCard ticket={t} />{:else}<p class="text-muted">No messages yet.</p>{/each}
      {:else}
        {#each data.applications as a (a.id)}<ApplicationCard application={a} />{:else}<p class="text-muted">No applications yet.</p>{/each}
      {/if}
      </div>
      </div>
    {/if}
  </Container>
</section>

{#if data.authed && standalone}
  <BottomNav items={sections} active={tab} onselect={pick} />
{/if}
