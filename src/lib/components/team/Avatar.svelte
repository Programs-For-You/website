<script>
  import { cn } from '#lib/cn.js';
  /** Initials in a gradient circle. g1/g2 are the gradient colours (set as --g1/--g2, like the old site). */
  let { initials, g1, g2, size = 'base', class: cls = '' } = $props();
  const sizes = {
    sm: 'size-9 text-[.78rem]',
    base: 'size-11 text-[.95rem]',
    md: 'size-14 text-[1.1rem]',
    lg: 'size-[76px] text-[1.4rem]',
    xl: 'size-32 text-[2.4rem] shadow-[0_18px_40px_-14px_var(--g1)]'
  };
</script>

<span
  class={cn(
    'inline-grid flex-none place-items-center rounded-full bg-[linear-gradient(135deg,var(--g1),var(--g2))] font-semibold tracking-[.02em] text-white shadow-[0_6px_16px_-8px_var(--g1)]',
    sizes[size],
    cls
  )}
  style="--g1:{g1};--g2:{g2}"
  aria-hidden="true">{initials}</span>
