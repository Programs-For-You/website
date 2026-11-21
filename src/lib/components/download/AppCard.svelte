<script>
  import Button from '../Button.svelte';
  import DlCard from './DlCard.svelte';
  import { APPS } from '#lib/config.js';

  /** The Programs For You download: one app, with the tools inside listed under it. */
  let { app } = $props();

  const ready = $derived(app.status === 'available' && app.file);
  const meta = $derived(['Mac', app.version && `Version ${app.version}`, app.size].filter(Boolean).join(' · '));
  const note = $derived(ready && (app.history || []).find((h) => h.version === app.version));
</script>

<DlCard icon={app.icon} name={app.name} blurb={app.blurb}>
  {#snippet body()}
    <p class="m-0 mt-1 text-[.8rem] text-faint">{meta}</p>
    <p class="m-0 mt-1 text-[.8rem] text-faint">{app.requires}</p>
    <ul class="m-0 mt-3 grid list-none gap-2 p-0">
      {#each APPS as t (t.id)}
        <li class="flex items-center gap-3">
          <img class="size-8 flex-none rounded-lg" src={t.icon} alt="" width="32" height="32">
          <span class="text-[.9rem]"><b class="text-ink">{t.name}</b> <span class="text-muted">· {t.blurb}</span> <a class="whitespace-nowrap" href={t.page}>Learn more</a></span>
        </li>
      {/each}
    </ul>
    {#if note && (note.fixed || note.added)}
      <details class="group mt-3 text-[.84rem]">
        <summary class="w-fit cursor-pointer font-semibold text-accent">What’s new in version {app.version}</summary>
        {#if note.fixed}<p class="m-0 mt-1.5 text-muted"><b class="text-ink">Fixed:</b> {note.fixed}</p>{/if}
        {#if note.added}<p class="m-0 mt-1.5 text-muted"><b class="text-ink">Added:</b> {note.added}</p>{/if}
      </details>
    {/if}
  {/snippet}
  {#snippet actions()}
    {#if ready}
      <Button variant="primary" href={app.file} download class="max-[640px]:flex-1">Download for Mac</Button>
    {:else}
      <Button tag="span" variant="ghost" aria-disabled="true" class="max-[640px]:flex-1">Coming soon</Button>
    {/if}
    <a class="text-[.9rem] whitespace-nowrap" href="/install">How to install</a>
  {/snippet}
</DlCard>
