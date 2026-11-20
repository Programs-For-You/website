<script>
  /** "Windows protected your PC" (always blue, like the real one). step 1 = More info link, step 2 = Run anyway. */
  let { step = 1 } = $props();
  const p = 'mb-2.5! text-[.78rem] leading-[1.45] text-white/90! [overflow-wrap:anywhere]';
  const btn = 'grid h-[30px] place-items-center border border-white/75 px-3.5 text-[.78rem] font-semibold whitespace-nowrap';
  const hl = 'bg-white text-[#1f5fa8] shadow-[0_0_0_3px_#ffd84d]';
</script>

<div
  class="flex min-h-[236px] flex-col rounded-[4px] bg-[#1f5fa8] px-[18px] pt-[18px] pb-3.5 text-[.8rem] text-white shadow-soft"
  role="img"
  aria-label={step === 1 ? 'Example: Windows protected your PC, with a More info link and a Don’t run button' : 'Example: after More info, the app’s name, Unknown publisher, and a Run anyway button'}>
  <b class="mb-2.5 text-[1.08rem] font-semibold">Windows protected your PC</b>
  <p class={p}>Microsoft Defender SmartScreen prevented an unrecognized app from starting. Running this app might put your PC at risk.</p>
  {#if step === 1}
    <span class="-ml-1 self-start rounded-[4px] px-[5px] py-px font-semibold underline shadow-[0_0_0_3px_#ffd84d]">More info</span>
    <div class="mt-auto flex justify-end gap-2 pt-3"><span class={btn}>Don’t run</span></div>
  {:else}
    <p class="{p} text-white!">App: SchoolSchedule-Windows-1.1.0-Setup.exe<br>Publisher: Unknown publisher</p>
    <div class="mt-auto flex justify-end gap-2 pt-3"><span class="{btn} {hl}">Run anyway</span><span class={btn}>Don’t run</span></div>
  {/if}
</div>
