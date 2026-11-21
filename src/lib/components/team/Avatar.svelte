<script>
  import { cn } from '#lib/cn.js';
  /**
   * Initials in a gradient circle. g1/g2 are the gradient colours (set as --g1/--g2, like the old site).
   * open = an empty spot ("Coming soon"): a dashed circle with a "?" instead of initials.
   */
  let { initials = '', g1 = '#4f46e5', g2 = '#9333ea', size = 'base', open = false, class: cls = '' } = $props();
  const sizes = {
    sm: 'size-9 text-[.78rem]',
    base: 'size-11 text-[.95rem]',
    md: 'size-14 text-[1.1rem]',
    lg: 'size-[76px] text-[1.4rem]',
    xl: 'size-28 text-[2.15rem]'
  };
</script>

<span
  class={cn(
    'inline-grid flex-none place-items-center rounded-full font-semibold tracking-[.02em]',
    open
      ? 'border-[1.5px] border-dashed border-border-strong bg-transparent text-faint'
      : cn('bg-[linear-gradient(135deg,var(--g1),var(--g2))] text-white shadow-[0_6px_16px_-8px_var(--g1)]', size === 'xl' && 'shadow-[0_18px_40px_-14px_var(--g1)]'),
    sizes[size],
    cls
  )}
  style="--g1:{g1};--g2:{g2}"
  aria-hidden="true">{open ? '?' : initials}</span>
