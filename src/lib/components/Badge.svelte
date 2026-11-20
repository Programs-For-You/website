<script>
  import { cn } from '#lib/cn.js';
  /** A small mono tag. tone: 'neutral' | 'soon' (amber) | 'ok' (lime) */
  let { tone = 'neutral', class: cls = '', children, ...rest } = $props();
</script>

<span
  class={cn(
    'inline-flex h-7 items-center rounded-lg px-2.5 font-mono text-mono leading-none uppercase',
    tone === 'soon' ? 'bg-warn-soft text-warn' : tone === 'ok' ? 'bg-lime text-ink' : 'bg-surface text-ink',
    cls
  )}
  {...rest}>{@render children?.()}</span>
