<script>
  /** Wraps FaqItem rows so their hairlines join up. */
  let { children } = $props();
</script>

<div class="flex flex-col">{@render children?.()}</div>
