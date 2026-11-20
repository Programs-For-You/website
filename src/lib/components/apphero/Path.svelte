<script>
  /** A menu path or setting name inside a sentence (bold, main text colour). */
  let { children } = $props();
</script>

<span class="font-semibold text-ink">{@render children?.()}</span>
