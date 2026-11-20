<script>
  /** One picture + its pointer caption inside a StepVisual pair. */
  let { note, children } = $props();
</script>

<figure class="m-0 min-w-0">
  {@render children?.()}
  <figcaption class="mt-2.5 flex items-center gap-1.5 text-[.85rem] font-semibold text-accent">
    <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"/></svg> {note}
  </figcaption>
</figure>
