<script>
  import Section from '#lib/components/Section.svelte';
  import SectionHead from '#lib/components/SectionHead.svelte';
  import Badge from '#lib/components/Badge.svelte';
  import Icon from './Icon.svelte';
  import { APP } from '#lib/config.js';
  /** The "What's new" band: Programs For You's update notes (every tool is part of that one app). */
  let { id = '' } = $props();
  const history = APP.history ?? [];
  const row = 'mb-2 grid grid-cols-[92px_minmax(0,1fr)] items-baseline gap-3 text-muted last:mb-0 max-[480px]:grid-cols-1 max-[480px]:gap-0.5';
  const tag = 'inline-flex items-center gap-[5px] text-[.8rem] font-bold [&_svg]:size-[15px]';
</script>

<Section soft narrow id="updates">
  <div class="mb-11">
    <p class="mb-3 text-[.78rem] font-semibold tracking-[.09em] text-accent uppercase">Updates</p>
    <h2>What’s new in Programs For You</h2>
    <p class="text-muted">To get the newest version, click Check for Updates in Programs For You. It never updates by itself. Here’s what recent versions fixed and added.</p>
  </div>
  <div class="grid gap-3.5">
    {#each history as h, i}
      <article class="rounded-card border border-border bg-surface px-5 py-[18px]">
        <h3 class="mb-2.5 flex items-center gap-2.5 text-[1.05rem]">Version {h.version} {#if i === 0}<Badge tone="ok" class="h-[22px] text-[.74rem]">Newest</Badge>{/if}</h3>
        {#if h.fixed}<p class={row}><span class="{tag} text-warn"><Icon name="fixed" class="size-5" /> Fixed</span><span>{h.fixed}</span></p>{/if}
        {#if h.added}<p class={row}><span class="{tag} text-accent"><Icon name="added" class="size-5" /> Added</span><span>{h.added}</span></p>{/if}
      </article>
    {/each}
  </div>
</Section>
