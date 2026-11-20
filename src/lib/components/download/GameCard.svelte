<script>
  import Button from '../Button.svelte';
  import DlCard from './DlCard.svelte';
  let { game } = $props();
  const ready = $derived(game.status === 'available' && game.file);
  const meta = $derived([game.requires, ready && game.size].filter(Boolean).join(' · '));
  const page = $derived(game.page.replace(/\.html(?=#|$)/, ''));
</script>

<DlCard icon={game.icon} name={game.name} blurb={game.blurb}>
  {#snippet body()}
    <p class="m-0 mt-1 text-[.8rem] text-faint">{meta}</p>
  {/snippet}
  {#snippet actions()}
    {#if ready}
      <Button variant="primary" href={game.file} download>Download</Button>
    {:else}
      <Button tag="span" variant="ghost" aria-disabled="true">Coming soon</Button>
    {/if}
    <a class="text-[.9rem] whitespace-nowrap" href="{page}#how-to-install">How to install it</a>
  {/snippet}
</DlCard>
