<script>
  import MdBtn from './MdBtn.svelte';
</script>

<div class="w-[380px] max-w-full overflow-hidden rounded-xl border border-border bg-surface text-[.84rem] shadow-soft" role="img" aria-label="Example: a browser’s download list warning that the Setup file isn’t commonly downloaded, with Keep and Delete buttons">
  <div class="border-b border-border px-3.5 py-2.5 font-[650]">Downloads</div>
  <div class="grid grid-cols-[34px_minmax(0,1fr)] gap-3 p-3.5">
    <span class="grid size-[34px] place-items-center rounded-lg bg-surface-2 text-muted"><svg class="size-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12M7 10l5 5 5-5"/><path d="M5 21h14"/></svg></span>
    <div>
      <b class="block text-ink [overflow-wrap:anywhere]">SchoolSchedule-Windows-1.1.0-Setup.exe</b>
      <p class="mt-1! mb-3! text-[.8rem] leading-[1.45] text-muted!">This file isn’t commonly downloaded. Make sure you trust it before you open it.</p>
      <div class="flex gap-2"><MdBtn hl class="px-[18px]">Keep</MdBtn><MdBtn class="px-[18px]">Delete</MdBtn></div>
    </div>
  </div>
</div>
