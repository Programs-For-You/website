<!--
  From Uiverse.io by mymiamo - https://uiverse.io/mymiamo/yellow-rattlesnake-26
  MIT License, Copyright (c) mymiamo (Eray Durupınar)

  Floating glass tab bar for the admin page when it runs as an installed app (PWA).
  items: [{ id, label, icon: 'team' | 'messages' | 'applications' }].  active: the current id.  onselect(id) is called on tap.
  The glass look is the original's; its "Settings" gear and the unused hover rotate() (it had no unit, so it did nothing) are left out.
-->
<script>
  import { cn } from '#lib/cn.js';

  let { items = [], more = [], active = '', onselect = () => {}, class: cls = '' } = $props();

  // "+" opens a small menu with the sections that don't fit in the bar.
  let open = $state(false);
  const moreActive = $derived(more.some((m) => m.id === active));
  const choose = (id) => { open = false; onselect(id); };

  // Heroicons (solid), the same icons as the original.
  const ICONS = {
    team: ['M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z', 'm12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z'],
    messages: ['M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h15ZM1.5 10.146V6a3 3 0 0 1 3-3h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 0 1 3 3v1.146A4.483 4.483 0 0 0 19.5 9h-15a4.483 4.483 0 0 0-3 1.146Z'],
    applications: ['M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z']
  };

  // The calendar icon is cut out with the even-odd rule, like the original.
  const EVENODD = new Set(['applications']);

  const link = 'flex min-w-0 flex-1 basis-0 cursor-pointer flex-col items-center rounded-[999rem] border-0 bg-transparent px-1.5 py-2.5 font-[inherit] text-white/90 no-underline [-webkit-tap-highlight-color:transparent] transition-[background,color,transform,box-shadow] duration-[.18s,.18s,.18s,.3s] ease-[cubic-bezier(.34,1.56,.64,1)] hover:bg-white/30 hover:text-[rgba(0,122,255,.7)] hover:shadow-[inset_2px_2px_5px_-2px_rgba(255,255,255,.4),inset_-2px_-1px_5px_0_rgba(255,255,255,.4),inset_0_-2px_0_rgba(255,255,255,.2)] active:scale-[.98]';
</script>

<!-- fixed to the bottom, above the phone's home-indicator area -->
<nav
  aria-label="Admin sections"
  class={cn('pointer-events-none fixed inset-x-0 bottom-[calc(10px+env(safe-area-inset-bottom))] z-50 flex justify-center px-2.5', cls)}
>
  <div
    class="pointer-events-auto relative flex w-full max-w-[520px] justify-center gap-2 rounded-[99rem] bg-[rgba(0,122,255,.404)] p-2 shadow-[0_10px_30px_rgba(0,0,0,.06)] backdrop-blur-[12px] backdrop-contrast-200 backdrop-saturate-[180%] after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:rounded-[inherit] after:shadow-[inset_2px_2px_5px_-2px_rgba(255,255,255,.4),inset_-2px_-2px_5px_2px_rgba(255,255,255,.4),inset_0_-2px_0_rgba(255,255,255,.2)] after:content-['']"
  >
    {#each items as it (it.id)}
      <button
        type="button"
        class={cn(link, it.id === active && 'bg-[rgb(237,237,237,.6)] text-[rgba(0,122,255,.9)]')}
        aria-current={it.id === active ? 'page' : undefined}
        onclick={() => onselect(it.id)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-[1.4rem]" aria-hidden="true">
          {#each ICONS[it.icon] ?? [] as d}<path {d} fill-rule={EVENODD.has(it.icon) ? 'evenodd' : undefined} clip-rule={EVENODD.has(it.icon) ? 'evenodd' : undefined} />{/each}
        </svg>
        <span class="mt-1 text-[.8rem] leading-none font-semibold">{it.label}</span>
      </button>
    {/each}
    {#if more.length}
      <button
        type="button"
        class={cn(link, (open || moreActive) && 'bg-[rgb(237,237,237,.6)] text-[rgba(0,122,255,.9)]')}
        aria-label="More sections"
        aria-expanded={open}
        onclick={() => (open = !open)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class={cn('size-[1.4rem] transition-transform', open && 'rotate-45')} aria-hidden="true">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" />
        </svg>
        <span class="mt-1 text-[.8rem] leading-none font-semibold">More</span>
      </button>
      {#if open}
        <div class="absolute right-0 bottom-[calc(100%+10px)] flex min-w-[180px] flex-col gap-1 rounded-[22px] bg-[rgba(0,122,255,.404)] p-2 shadow-[0_10px_30px_rgba(0,0,0,.12)] backdrop-blur-[12px] backdrop-saturate-[180%]" role="menu">
          {#each more as m (m.id)}
            <button type="button" role="menuitem" class={cn('cursor-pointer rounded-[16px] border-0 bg-transparent px-4 py-3 text-left font-[inherit] text-[.95rem] font-semibold text-white/90', m.id === active && 'bg-[rgb(237,237,237,.6)] text-[rgba(0,122,255,.9)]')} onclick={() => choose(m.id)}>{m.label}</button>
          {/each}
        </div>
      {/if}
    {/if}
  </div>
</nav>
