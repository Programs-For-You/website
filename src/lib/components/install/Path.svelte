<script>
  /** A menu path like "System Settings → Privacy & Security" (the old .path). */
  let { children } = $props();
</script>

<span class="font-semibold text-ink">{@render children?.()}</span>
