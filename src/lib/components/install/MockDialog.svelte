<script>
  import MdBtn from './MdBtn.svelte';
</script>

<div class="w-[270px] max-w-full rounded-2xl border border-border bg-surface px-[18px] pt-5 pb-4 text-center text-[.85rem] shadow-soft" role="img" aria-label="Example message: Programs For You Not Opened, with Done and Move to Trash buttons">
  <img class="mx-auto mb-2.5 size-[52px] rounded-xl" src="/assets/img/school-schedule.svg" alt="">
  <b class="mb-1.5 block text-[.95rem] text-ink">“Programs For You” Not Opened</b>
  <p class="mb-3.5! text-[.8rem] leading-[1.45] text-muted!">Apple could not verify “Programs For You” is free of malware that may harm your Mac or compromise your privacy.</p>
  <div class="grid gap-1.5"><MdBtn hl>Done</MdBtn><MdBtn>Move to Trash</MdBtn></div>
</div>
