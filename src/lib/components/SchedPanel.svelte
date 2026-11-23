<script>
  import { cn } from '#lib/cn.js';
  /**
   * The School Schedule drop-down from the menu bar (decorative).
   * full = all five periods plus tonight's homework (School Schedule page). Without it: just Lunch and period 4 (home page).
   * fluid = full width on phones.
   */
  let { full = false, fluid = false, class: cls = '' } = $props();
  const row = 'flex justify-between gap-2.5 border-t border-(--panel-line) px-[3px] py-[5px] [&>span:last-child]:text-(--panel-muted) [&>span:last-child]:tabular-nums';
</script>

<div class={cn('w-[252px] rounded-xl border border-(--panel-line) bg-(--panel-bg) p-3 text-[12.5px] leading-[1.4] text-(--panel-ink) shadow-[0_14px_40px_rgb(0_0_0/.18)]', fluid && 'max-[480px]:w-full', cls)}>
  <div class="mb-2 flex items-baseline justify-between px-0.5"><b class="text-[13px]">Day 2</b><span class="text-(--panel-muted)">Tuesday</span></div>
  <div class="mb-2 rounded-[9px] bg-[linear-gradient(135deg,#34d27b,#139a52)] px-[11px] py-2.5 text-[#0b1110]">
    <span class="block text-[11px] opacity-85">Now · Period 3</span>
    <span class="my-px block text-[19px] font-bold tracking-[-.02em]">Biology</span>
    <span class="block text-[11px] opacity-85">11:42 left · Next: Lunch</span>
    <span class="mt-2 block h-1 overflow-hidden rounded bg-[#0b1110]/25"><i class="block h-full w-[76%] rounded bg-[#0b1110]"></i></span>
  </div>
  <ul class="m-0 list-none p-0">
    {#if full}
      <li class="{row} opacity-45"><span>1 · English</span><span>7:45</span></li>
      <li class="{row} opacity-45"><span>2 · Algebra II</span><span>8:41</span></li>
      <li class="{row} font-[650]"><span>3 · Biology</span><span>9:37</span></li>
    {/if}
    <li class={row}><span>Lunch</span><span>10:30</span></li>
    <li class={row}><span>4 · US History</span><span>11:05</span></li>
  </ul>
  {#if full}
    <div class="mt-2 border-t border-(--panel-line) px-[3px] pt-2 pb-0.5">
      <b class="mb-1 block">Tonight · 1h 5m</b>
      <div class="flex items-center gap-2 py-[3px]"><span class="size-[13px] flex-none rounded border-[1.5px] border-(--panel-muted)"></span>Bio worksheet<em class="ml-auto text-[11px] not-italic text-(--panel-muted)">25m</em></div>
      <div class="flex items-center gap-2 py-[3px]"><span class="size-[13px] flex-none rounded border-[1.5px] border-(--panel-muted)"></span>Study: math quiz<em class="ml-auto text-[11px] not-italic text-(--panel-muted)">30m</em></div>
      <div class="flex items-center gap-2 py-[3px] text-(--panel-muted) line-through"><span class="size-[13px] flex-none rounded border-[1.5px] border-[#34d27b] bg-[#34d27b]"></span>Read ch. 5<em class="ml-auto text-[11px] not-italic text-(--panel-muted)">done</em></div>
    </div>
  {/if}
</div>
