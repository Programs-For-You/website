<script>
  import Card from '#lib/components/Card.svelte';
  /** One small card in the right-hand column. */
  let { title, children } = $props();
</script>

<Card class="p-[22px]">
  <h3 class="mb-2.5 text-[1.02rem]">{title}</h3>
  {@render children?.()}
</Card>
