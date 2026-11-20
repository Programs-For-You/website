<script>
  import MdBtn from './MdBtn.svelte';
</script>

<div class="w-[340px] max-w-full overflow-hidden rounded-lg border border-border bg-surface text-[.82rem] shadow-soft" role="img" aria-label="Example: User Account Control asking to allow this app from an unknown publisher, with Yes and No buttons">
  <div class="bg-[#e8a33d] px-4 py-[9px] text-[.78rem] font-semibold text-[#1d1d1f]">User Account Control</div>
  <div class="p-4">
    <b class="block text-[.95rem] leading-[1.35] font-semibold text-ink">Do you want to allow this app from an unknown publisher to make changes to your device?</b>
    <p class="my-2.5! mb-3.5! text-[.78rem] [overflow-wrap:anywhere]">SchoolSchedule-Windows-1.1.0-Setup.exe<br>Publisher: Unknown</p>
    <div class="grid grid-cols-2 gap-2"><MdBtn hl>Yes</MdBtn><MdBtn>No</MdBtn></div>
  </div>
</div>
