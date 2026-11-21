<script>
  import Button from '../Button.svelte';
  import DlCard from './DlCard.svelte';

  /** A Mac + Windows download card. isWindows: the visitor is on Windows, so the Windows button comes first and is the big one. */
  let { app, isWindows = false } = $props();

  const w = $derived(app.windows);
  const mac = $derived(app.status === 'available' && app.file);
  const win = $derived(w && w.status === 'available' && w.file);
  const macMeta = $derived(['Mac', app.requires, mac && app.version && `Version ${app.version}`, mac && app.size].filter(Boolean).join(' · '));
  const winMeta = $derived(win ? ['Windows', w.requires, w.version && `Version ${w.version}`, w.size].filter(Boolean).join(' · ') : 'Windows · coming soon');
  const note = $derived(mac && (app.history || []).find((h) => h.version === app.version));
  const hasNote = $derived(note && (note.fixed || note.added));
  const page = $derived(app.page.replace(/\.html(?=#|$)/, ''));
</script>

<DlCard icon={app.icon} name={app.name} blurb={app.blurb}>
  {#snippet body()}
    <p class="m-0 mt-1 text-[.8rem] text-faint">{macMeta}</p>
    <p class="m-0 mt-1 text-[.8rem] text-faint">{winMeta}</p>
    {#if hasNote}
      <details class="group mt-2 text-[.84rem]">
        <summary class="w-fit cursor-pointer font-semibold text-accent">What’s new in Mac version {app.version}</summary>
        {#if note.fixed}<p class="m-0 mt-1.5 text-muted"><b class="text-ink">Fixed:</b> {note.fixed}</p>{/if}
        {#if note.added}<p class="m-0 mt-1.5 text-muted"><b class="text-ink">Added:</b> {note.added}</p>{/if}
      </details>
    {/if}
  {/snippet}
  {#snippet actions()}
    {#snippet macBtn()}
      {#if mac}
        <Button variant={isWindows ? 'ghost' : 'primary'} href={app.file} download class="max-[640px]:flex-1">Mac Download</Button>
      {:else}
        <Button tag="span" variant="ghost" aria-disabled="true" class="max-[640px]:flex-1">Mac: coming soon</Button>
      {/if}
    {/snippet}
    {#snippet winBtn()}
      {#if win}
        <Button variant={isWindows ? 'primary' : 'ghost'} href={w.file} download class="max-[640px]:flex-1">Windows Download</Button>
      {:else}
        <Button tag="span" variant="ghost" aria-disabled="true" class="max-[640px]:flex-1">Windows: coming soon</Button>
      {/if}
    {/snippet}
    <div class="flex flex-wrap gap-2 max-[640px]:w-full">
      {#if isWindows}{@render winBtn()}{@render macBtn()}{:else}{@render macBtn()}{@render winBtn()}{/if}
    </div>
    <a class="text-[.9rem] whitespace-nowrap" href="{page}#how-to-use">{mac ? 'How to use it' : 'Learn more'}</a>
    {#if app.source}
      <a class="text-[.8rem] whitespace-nowrap text-faint" href={app.source} download>Mac source code ({app.license || 'license'})</a>
    {/if}
    {#if win && w.source}
      <a class="text-[.8rem] whitespace-nowrap text-faint" href={w.source} rel="noopener">Windows source code ({app.license || 'license'})</a>
    {/if}
  {/snippet}
</DlCard>
