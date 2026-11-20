<script>
  import { cn } from '#lib/cn.js';
  import { loadGsap } from '#lib/motion/gsap.js';
  /**
   * variant: 'solid' (dark, label slides up on hover)        alias 'primary'
   *          'notch' (dark label tab + lime arrow blob that morphs on hover)   alias 'accent'
   *          'outline' (bordered)                              alias 'ghost'
   *          'light' (white, for dark backgrounds)
   * size: 'md' | 'sm' (solid / outline / light only)     tone (notch only): 'dark' | 'light' (white tab, for dark backgrounds)
   * block = full width.  Pass href for a link; without href it is a <button type="button"> unless you pass type.
   * tag="span" gives a non-clickable look-alike (use with aria-disabled="true" for "Coming soon").
   * Mono, uppercase text is automatic. Inline <svg> icons inside are sized 16px.
   */
  let { href, tag, variant = 'solid', size = 'md', tone = 'dark', block = false, class: cls = '', children, ...rest } = $props();

  const v = $derived({ primary: 'solid', accent: 'notch', ghost: 'outline' }[variant] ?? variant);
  const el = $derived(tag ?? (href ? 'a' : 'button'));
  let root = $state();

  const PATHS = {
    text: ['M0 0h5.63c7.808 0 13.536 7.337 11.642 14.91l-6.09 24.359A11.527 11.527 0 0 1 0 48V0Z', 'M0 0c5.29 0 9.9 3.6 11.183 8.731l6.09 24.359C19.165 40.663 13.437 48 5.63 48H0V0Z'],
    blob: ['M6.728 9.09A12 12 0 0 1 18.369 0H39c6.627 0 12 5.373 12 12v24c0 6.627-5.373 12-12 12H12.37C4.561 48-1.167 40.663.727 33.09l6-24Z', 'M.728 14.91C-1.166 7.338 4.562 0 12.369 0H39c6.628 0 12 5.373 12 12v24c0 6.627-5.372 12-12 12H18.37a12 12 0 0 1-11.641-9.09l-6-24Z']
  };
  // The notch and the blob change shape on hover (GSAP MorphSVG). Without it they simply keep their resting shape.
  async function morph(hover) {
    if (v !== 'notch' || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const { gsap } = await loadGsap();
    const i = hover ? 1 : 0;
    gsap.to(root.querySelector('[data-morph=text]'), { morphSVG: PATHS.text[i], duration: 0.3, ease: 'power2.out' });
    gsap.to(root.querySelector('[data-morph=blob]'), { morphSVG: PATHS.blob[i], duration: 0.3, ease: 'power2.out' });
  }

  const mono = 'font-mono text-mono uppercase leading-none';
  const base = 'relative inline-flex cursor-pointer items-center whitespace-nowrap no-underline select-none [&_svg]:size-4 [&_svg]:shrink-0 aria-disabled:pointer-events-none aria-disabled:opacity-50 disabled:pointer-events-none disabled:opacity-50';
  const classes = $derived(cn(
    base, mono, 'group',
    v === 'solid' && ['overflow-hidden rounded-xl bg-ink text-on-ink transition-colors duration-100 delay-100 hover-fine:bg-lime hover-fine:delay-150', size === 'sm' ? 'h-10 px-4' : 'h-[46px] px-5'],
    v === 'outline' && ['justify-between gap-7 rounded-xl border border-accent text-ink normal-case tracking-normal font-sans text-[15px] leading-[1.2] transition-colors duration-300 hover-fine:bg-surface-2', size === 'sm' ? 'min-h-10 px-4 py-2.5' : 'min-h-12 px-5 py-3.5'],
    v === 'light' && ['overflow-hidden rounded-xl bg-surface-2 text-ink transition-colors duration-300 hover-fine:bg-lime hover-fine:text-on-ink', size === 'sm' ? 'h-10 px-4' : 'h-[46px] px-5'],
    v === 'notch' && 'h-12 items-stretch',
    block && 'w-full justify-center',
    cls
  ));
</script>

{#snippet inner()}
  {#if v === 'solid' || v === 'light'}
    <span class="inline-flex items-center gap-2 transition-transform duration-300 ease-in-out-quart group-hover-fine:-translate-y-3">{@render children?.()}</span>
    <span aria-hidden="true" class={cn('absolute -inset-px flex translate-y-full items-center gap-2 rounded-[inherit] px-[inherit] transition-transform duration-300 ease-in-out-quart group-hover-fine:translate-y-0', 'bg-lime text-on-ink')}>{@render children?.()}</span>
  {:else if v === 'notch'}
    <span class={cn('relative mr-4 inline-flex items-center gap-2 rounded-l-xl py-2 pr-2 pl-5 transition-[background-color,color,margin,padding] duration-[600ms] ease-btn group-hover-fine:mr-3 group-hover-fine:pr-3.5', 'bg-ink text-on-ink group-hover-fine:bg-lime group-hover-fine:text-on-ink')}>
      {@render children?.()}
      <span class="absolute inset-y-0 -right-4 block w-[18px]"><svg class="absolute inset-0 size-full! transition-[fill] duration-[600ms] ease-btn fill-ink group-hover-fine:fill-lime" viewBox="0 0 18 48" preserveAspectRatio="none" aria-hidden="true"><path data-morph="text" d={PATHS.text[0]} /></svg></span>
    </span>
    <span class="relative inline-flex h-full w-[51px] origin-right overflow-hidden transition-transform duration-[600ms] ease-btn group-hover-fine:scale-[.875]">
      <svg class="absolute inset-0 size-full! fill-lime transition-[fill] duration-[600ms] ease-btn group-hover-fine:fill-ink" viewBox="0 0 51 48" aria-hidden="true"><path data-morph="blob" d={PATHS.blob[0]} /></svg>
      <svg class="absolute top-1/2 left-[calc(50%+2px)] z-10 size-2.5! -translate-x-1/2 -translate-y-1/2 text-ink transition-transform duration-[600ms] ease-btn group-hover-fine:translate-x-6" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true"><path d="M7.703 5.8H.398V4.6h7.305l-3.36-3.36.855-.84 4.8 4.8-4.8 4.8-.855-.84 3.36-3.36Z"/></svg>
      <svg class="absolute top-1/2 left-[calc(50%+2px)] z-10 size-2.5! -translate-x-[calc(50%+44px)] -translate-y-1/2 text-on-ink transition-transform duration-[600ms] ease-btn group-hover-fine:-translate-x-1/2" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true"><path d="M7.703 5.8H.398V4.6h7.305l-3.36-3.36.855-.84 4.8 4.8-4.8 4.8-.855-.84 3.36-3.36Z"/></svg>
    </span>
  {:else}
    <span class="inline-flex items-center gap-2">{@render children?.()}</span>
    <span class="text-xl leading-none transition-transform duration-300 group-hover-fine:translate-x-1" aria-hidden="true">→</span>
  {/if}
{/snippet}

{#if el === 'a'}
  <a bind:this={root} {href} class={classes} onmouseenter={() => morph(true)} onmouseleave={() => morph(false)} {...rest}>{@render inner()}</a>
{:else if el === 'button'}
  <button bind:this={root} type="button" class={classes} onmouseenter={() => morph(true)} onmouseleave={() => morph(false)} {...rest}>{@render inner()}</button>
{:else}
  <svelte:element this={el} bind:this={root} class={classes} {...rest}>{@render inner()}</svelte:element>
{/if}
