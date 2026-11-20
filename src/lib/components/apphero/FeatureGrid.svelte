<script>
  import Feature from '#lib/components/Feature.svelte';
  /** items: [{ icon: '<path .../>', title, body: 'html' }] (static site text, so body may hold <b>). */
  let { items } = $props();
</script>

<div class="grid grid-cols-3 gap-[18px] max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
  {#each items as f}
    <Feature title={f.title}>
      {#snippet icon()}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{@html f.icon}</svg>{/snippet}
      <p>{@html f.body}</p>
    </Feature>
  {/each}
</div>
