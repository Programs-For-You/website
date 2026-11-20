<script>
  import Avatar from './Avatar.svelte';
  /** One department head card with its co-head underneath. */
  let { g1, g2, initials, icon, dept, name, role, note, co } = $props();
</script>

<article class="group relative flex flex-col gap-6 overflow-hidden rounded-card-lg bg-surface p-6 desktop:p-8" style="--g1:{g1};--g2:{g2}" data-reveal>
  <div class="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full bg-[radial-gradient(circle,var(--g1),transparent_65%)] opacity-[.18] transition-opacity duration-[600ms] ease-out-expo group-hover-fine:opacity-35"></div>
  <div class="relative flex items-start justify-between gap-4">
    <Avatar {initials} {g1} {g2} size="lg" />
    <span class="inline-flex items-center gap-1.5 rounded-lg bg-bg px-2.5 py-2 font-mono text-mono leading-none text-[color-mix(in_oklab,var(--g1)_45%,white)] uppercase">
      <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{@render icon()}</svg>{dept}</span>
  </div>
  <div class="relative">
    <h3 class="mb-1 text-[1.75rem] leading-[1.1]">{name}</h3>
    <p class="mb-3 font-mono text-mono leading-none text-faint uppercase">{role}</p>
    <p class="m-0 text-body text-ink/80">{note}</p>
  </div>
  {#if co}
  <div class="relative mt-auto flex items-center gap-3 border-t border-border pt-5">
    <Avatar initials={co.initials} g1={co.g1} g2={co.g2} size="sm" />
    <div class="min-w-0">
      <b class="block leading-tight">{co.name}</b>
      <span class="block font-mono text-[.72rem] leading-snug text-faint uppercase">{co.role}</span>
      {#if co.note}<span class="mt-1 block text-[.9rem] leading-snug text-muted">{co.note}</span>{/if}
    </div>
  </div>
  {/if}
</article>
