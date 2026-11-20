<script>
  let { children } = $props();
</script>

<div class="mt-2 mb-3 rounded-card bg-accent-soft px-[22px] py-5 [&_p]:m-0 [&_p]:text-ink!">
  {@render children?.()}
</div>
