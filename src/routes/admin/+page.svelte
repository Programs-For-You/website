<script>
  import { enhance } from '$app/forms';
  import Container from '#lib/components/Container.svelte';
  import Button from '#lib/components/Button.svelte';
  import FormMessage from '#lib/components/FormMessage.svelte';
  import PageHead from '#lib/components/contact/PageHead.svelte';
  import { cn } from '#lib/cn.js';
  import { input, field, fieldLabel, check } from '#lib/ui.js';

  let { data, form } = $props();

  const card = 'rounded-card-lg border border-border bg-surface p-6';
  const blank = { id: '', sort: 0, name: '', initials: '', g1: '#15803d', g2: '#0f766e', title: '', note: '', founder: 0, soon: 0 };
  const color = 'h-[46px] w-full cursor-pointer rounded-xl border border-border-strong bg-bg p-1';
</script>

<svelte:head>
  <title>Admin · Programs For You</title>
  <meta name="robots" content="noindex, nofollow">
</svelte:head>

<PageHead eyebrow="Admin" title="Team members" lead="Add, edit or remove the people shown on the Team page." />

<section class="pt-2 pb-18">
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

      {#snippet editor(p, isNew)}
        <form class={cn(card, 'mb-4')} method="POST" action="?/save" use:enhance={() => async ({ update }) => update({ reset: isNew })}>
          {#if !isNew}<input type="hidden" name="id" value={p.id}>{/if}
          <div class="grid grid-cols-[1fr_1fr_90px_80px] gap-x-3.5 max-[640px]:grid-cols-2">
            <div class={field}><label class={fieldLabel} for="n{p.id}">Name</label>
              <input class={input} id="n{p.id}" name="name" value={p.name ?? ''} autocomplete="off"></div>
            <div class={field}><label class={fieldLabel} for="t{p.id}">Title</label>
              <input class={input} id="t{p.id}" name="title" value={p.title} autocomplete="off"></div>
            <div class={field}><label class={fieldLabel} for="i{p.id}">Initials</label>
              <input class={input} id="i{p.id}" name="initials" value={p.initials ?? ''} maxlength="3" autocomplete="off"></div>
            <div class={field}><label class={fieldLabel} for="s{p.id}">Order</label>
              <input class={input} id="s{p.id}" name="sort" type="number" value={p.sort}></div>
          </div>
          <div class={field}><label class={fieldLabel} for="o{p.id}">Note <span class="text-faint">(optional)</span></label>
            <input class={input} id="o{p.id}" name="note" value={p.note ?? ''} maxlength="300" autocomplete="off"></div>
          <div class="grid grid-cols-2 gap-x-3.5">
            <div class={field}><label class={fieldLabel} for="a{p.id}">Avatar color 1</label>
              <input class={color} id="a{p.id}" name="g1" type="color" value={p.g1}></div>
            <div class={field}><label class={fieldLabel} for="b{p.id}">Avatar color 2</label>
              <input class={color} id="b{p.id}" name="g2" type="color" value={p.g2}></div>
          </div>
          <div class="flex flex-wrap items-center gap-x-6">
            <label class={cn(check, 'mb-3')}><input type="checkbox" name="founder" checked={Boolean(p.founder)}><span>Founder</span></label>
            <label class={cn(check, 'mb-3')}><input type="checkbox" name="soon" checked={Boolean(p.soon)}><span>Open spot (“Coming soon”)</span></label>
          </div>
          <div class="flex gap-2.5">
            <Button type="submit">{isNew ? 'Add person' : 'Save'}</Button>
            {#if !isNew}
              <Button type="submit" variant="outline" formaction="?/remove" formnovalidate
                onclick={(e) => { if (!confirm(`Remove ${p.name || 'this spot'} from the Team page?`)) e.preventDefault(); }}>Remove</Button>
            {/if}
          </div>
        </form>
      {/snippet}

      {#each data.people as p (p.id)}{@render editor(p, false)}{/each}
      <h2 class="mt-8 mb-3 text-[1.2rem]">Add someone</h2>
      {@render editor(blank, true)}
    {/if}
  </Container>
</section>
