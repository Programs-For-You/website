<!-- © 2026 Programs For You. All rights reserved. -->
<script>
  /** A picture of the Programs For You menu bar drop-down (the P icon, School Schedule / Email Assistant tabs,
   *  and the Screen Assistant button). Purely decorative; it matches what the Mac app shows. */
  const svg = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.8', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true' };
  const periods = [
    ['1 · English', '7:45'],
    ['2 · Algebra II', '8:41'],
    ['3 · Biology', '9:37', true],
    ['Lunch', '10:30'],
  ];
</script>

<div class="w-full max-w-[400px] text-left" aria-hidden="true">
  <!-- the menu bar -->
  <div class="flex h-[30px] items-center justify-end gap-3.5 rounded-t-xl bg-(--menubar-bg) px-3.5 text-[12.5px] font-medium text-(--menubar-ink)">
    <span class="inline-flex h-[22px] items-center gap-1.5 rounded-md bg-[rgb(127_127_140/.28)] px-2 font-bold">
      <img src="/favicon.svg" alt="" class="size-[14px]"> P3 · 12m
    </span>
    <svg class="size-[15px]" {...svg}><path d="M2 8.8a15 15 0 0 1 20 0"/><path d="M5.3 12.3a10 10 0 0 1 13.4 0"/><path d="M8.7 15.7a5 5 0 0 1 6.6 0"/></svg>
    <span>10:18 AM</span>
  </div>

  <!-- the drop-down, just under the icon -->
  <div class="mx-2 mt-1.5 overflow-hidden rounded-xl border border-border bg-bg shadow-lift">
    <div class="flex items-center gap-2 px-3.5 pt-3 pb-2.5">
      <img src="/favicon.svg" alt="" class="size-[18px]">
      <span class="text-[15px] tracking-[-.02em] text-ink">Programs For You</span>
      <span class="ml-auto font-mono text-[10px] text-accent uppercase">Open App</span>
    </div>
    <div class="mx-3 flex gap-1 rounded-[10px] bg-surface-2 p-[3px] text-[12px]">
      <span class="flex h-7 flex-1 items-center justify-center gap-1.5 rounded-lg bg-surface font-semibold text-ink">
        <svg class="size-3.5" {...svg}><rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M3 10h18M8 3v4M16 3v4"/></svg> School Schedule
      </span>
      <span class="flex h-7 flex-1 items-center justify-center gap-1.5 text-muted">
        <svg class="size-3.5" {...svg}><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 7l8.5 6 8.5-6"/></svg> Email Assistant
        <b class="rounded-full bg-accent px-1.5 text-[10px] text-bg">2</b>
      </span>
    </div>
    <div class="px-3.5 pt-3 pb-2">
      <div class="rounded-lg bg-[#1f9d55] px-3 py-2 text-white">
        <p class="m-0 text-[11px] opacity-85">Now · Period 3</p>
        <p class="m-0 text-[17px] font-bold leading-tight">Biology</p>
        <p class="m-0 text-[11px] opacity-85">11:42 left · Next: Lunch</p>
      </div>
      <ul class="m-0 mt-2 list-none p-0 text-[12.5px]">
        {#each periods as [name, time, now]}
          <li class="flex justify-between border-b border-border py-1 last:border-0 {now ? 'font-semibold text-ink' : 'text-muted'}"><span>{name}</span><span>{time}</span></li>
        {/each}
      </ul>
    </div>
    <div class="mx-3 mb-3 flex items-center gap-2.5 rounded-[10px] border border-border bg-surface p-2">
      <span class="flex size-8 items-center justify-center rounded-lg bg-surface-2 text-accent">
        <svg class="size-4" {...svg}><circle cx="11" cy="11" r="6"/><path d="M20 20l-4.2-4.2"/><path d="M11 8.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"/></svg>
      </span>
      <span class="leading-tight">
        <span class="block text-[13px] font-semibold text-ink">Screen Assistant</span>
        <span class="block text-[11px] text-muted">Works in any app, or click here</span>
      </span>
      <span class="ml-auto rounded-md border border-border bg-surface-2 px-2 py-1 text-[12px] font-semibold text-ink shadow-[0_1px_0_rgb(0_0_0/.25)]">⌥ Space</span>
    </div>
    <div class="flex gap-3.5 border-t border-border bg-bg-soft px-3.5 py-2.5 font-mono text-[10px] text-muted uppercase">
      <span>Settings</span><span>Website</span><span class="ml-auto">Quit</span>
    </div>
  </div>
</div>
