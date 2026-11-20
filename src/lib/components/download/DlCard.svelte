<script>
  import Card from '../Card.svelte';
  /** One download row: icon, name + blurb, and an actions area. `body` goes in the middle column, `actions` below. */
  let { icon, name, blurb, body, actions } = $props();
</script>

<Card tag="article" class="grid grid-cols-[64px_1fr] items-start gap-x-5 gap-y-3.5 px-6 py-[22px] max-[640px]:grid-cols-[52px_1fr] max-[640px]:gap-x-4 max-[640px]:p-5">
  <img class="size-16 flex-none rounded-2xl max-[640px]:size-[52px] max-[640px]:rounded-[13px]" src={icon} alt="" width="64" height="64">
  <div>
    <h3 class="mb-0.5">{name}</h3>
    <p class="m-0 text-[.9rem] text-muted">{blurb}</p>
    {@render body?.()}
  </div>
  <div class="col-start-2 flex flex-wrap items-center gap-x-4 gap-y-2.5 max-[640px]:col-start-1 max-[640px]:col-end-[-1]">
    {@render actions?.()}
  </div>
</Card>
