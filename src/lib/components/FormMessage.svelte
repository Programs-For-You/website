<script>
  import { cn } from '#lib/cn.js';
  /** The little red/green note above or below a form. Pass text="" to hide it. kind: 'error' | 'ok' */
  let { text = '', kind = 'error', class: cls = '', ...rest } = $props();
</script>

<div role="status" class={cn('mb-4 rounded-card-sm px-3.5 py-3 text-[.95rem]', !text && 'hidden', kind === 'ok' ? 'bg-lime-soft text-ink' : 'bg-danger-soft text-danger', cls)} {...rest}>{text}</div>
