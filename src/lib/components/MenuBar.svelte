<script>
  import { cn } from '#lib/cn.js';
  /** The pretend Mac menu bar (clock pill, mail, sparkle, wifi, battery, date). Purely decorative. */
  let { class: cls = '' } = $props();
  const svg = 'size-[15px]';
  const attrs = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.8', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true' };
</script>

<div class={cn('flex h-[30px] items-center gap-3.5 bg-(--menubar-bg) px-3.5 text-[12.5px] font-medium whitespace-nowrap text-(--menubar-ink) backdrop-blur-[20px]', cls)}>
  <div class="ml-auto flex items-center gap-3.5">
    <span class="inline-flex h-[22px] items-center gap-[5px] rounded-md bg-[rgb(127_127_140/.22)] px-2 font-bold"><svg class={svg} {...attrs}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg> P3 · 12m</span>
    <span class="relative inline-flex"><svg class={svg} {...attrs}><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 7l8.5 6 8.5-6"/></svg><i class="absolute -top-0.5 -right-[3px] size-[7px] rounded-full bg-[#ef4444]"></i></span>
    <span class="inline-flex text-(--menubar-ink)"><svg class={svg} {...attrs}><path d="M11 3l1.8 4.9L17.7 9.7l-4.9 1.8L11 16.4l-1.8-4.9L4.3 9.7l4.9-1.8z"/><path d="M18.5 14.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/></svg></span>
    <span class="max-[480px]:hidden"><svg class={svg} {...attrs}><path d="M2 8.8a15 15 0 0 1 20 0"/><path d="M5.3 12.3a10 10 0 0 1 13.4 0"/><path d="M8.7 15.7a5 5 0 0 1 6.6 0"/><path d="M12 19.2v.1"/></svg></span>
    <span class="max-[480px]:hidden"><svg class={svg} {...attrs}><rect x="2" y="7" width="17" height="10" rx="2.5"/><path d="M22 10.5v3"/><rect x="4.2" y="9.2" width="10.5" height="5.6" rx="1" fill="currentColor" stroke="none"/></svg></span>
    <span><span class="max-[480px]:hidden">Tue Nov 17&nbsp;&nbsp;</span>10:18 AM</span>
  </div>
</div>
