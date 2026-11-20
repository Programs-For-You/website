<script>
  import { cn } from '#lib/cn.js';
  /** One accordion row: a question with a plus that turns into a cross, and an answer that slides open. Put the answer inside. */
  let { q, open = false, class: cls = '', children } = $props();
  let isOpen = $state(open);
  const id = $props.id();
</script>

<div class={cn('relative -mt-px border-t border-ink/10 last:border-b', cls)} data-reveal>
  <h3 class="m-0">
    <button type="button" class="grid min-h-[90px] w-full cursor-pointer grid-cols-[1fr_48px] items-center gap-5 py-5 text-left text-[max(1rem,min(calc(1rem+.006*(100vw-27.5rem)),1.375rem))] leading-[1.15] tracking-[-.02em] text-ink desktop:min-h-[100px]"
      aria-expanded={isOpen} aria-controls="faq-{id}" onclick={() => (isOpen = !isOpen)}>
      <span class="pr-6">{q}</span>
      <span class="relative size-12" aria-hidden="true">
        <span class="absolute inset-0 m-auto h-0.5 w-7 bg-ink transition-[opacity,transform] duration-[600ms] ease-out-expo {isOpen ? 'rotate-45 opacity-0' : ''}"></span>
        <span class="absolute inset-0 m-auto h-0.5 w-7 bg-ink transition-transform duration-[600ms] ease-out-expo {isOpen ? 'rotate-180' : 'rotate-90'}"></span>
      </span>
    </button>
  </h3>
  <div id="faq-{id}" class="grid transition-[grid-template-rows,opacity] duration-[600ms] ease-out-expo {isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}" inert={!isOpen}>
    <div class="overflow-hidden"><div class="max-w-[790px] pb-[60px] text-body text-ink/70 [&_p:last-child]:m-0">{@render children?.()}</div></div>
  </div>
</div>
