<script>
  import { cn } from '#lib/cn.js';
  /**
   * The Email Assistant "daily summary" pop-up (always dark, like the real one).
   * demo = clickable: pick a reply, type your own, press Skip / Preview & Send for a pretend result (Email Assistant page).
   * Without demo it is a decorative picture (home page): pass a short options list and fakeOther.
   * size: 'md' (344px) | 'lg' (400px, full width on phones)
   */
  let { demo = false, size = 'md', fakeOther = false, options = [
    { title: 'Thanks, see you Friday!', note: 'Short and friendly' },
    { title: 'Could you share a study guide?', note: 'Asks a question back' },
    { title: 'Got it, thank you.', note: 'Simple and polite' }
  ], class: cls = '' } = $props();

  let selected = $state(0); // 0..options.length-1, or options.length for "Other"
  let note = $state('');
  let otherInput = $state();
  const total = $derived(options.length + 1);
  const choose = (i) => { selected = i; note = ''; };
  function key(e, i) {
    if (e.target.tagName === 'INPUT') return;
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); choose(i); }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const next = (i + (e.key === 'ArrowDown' ? 1 : -1) + total) % total;
      choose(next);
      e.currentTarget.parentElement.children[next].focus();
    }
  }
  const opt = 'flex items-start gap-2.5 rounded-lg border border-[#343434] bg-[#262627] px-2.5 py-2 aria-checked:border-[#a7e26e] aria-checked:bg-[rgb(167_226_110/.12)]';
  const radio = 'mt-0.5 size-3.5 flex-none rounded-full border-[1.5px] border-[#8a8a8a] group-aria-checked:border-[#a7e26e] group-aria-checked:bg-[#a7e26e] group-aria-checked:shadow-[inset_0_0_0_3px_#22282f]';
  const btn = 'inline-flex h-7 items-center rounded-md border border-[#3c3c3c] bg-[#2c2c2c] px-3 text-[12.5px] font-semibold text-[#e8e8e8]';
</script>

<div
  class={cn('rounded-xl border border-[#3a3a3a] bg-[#1f1f1f] px-4 py-3.5 text-left text-[13px] leading-[1.45] text-[#e8e8e8] shadow-[0_22px_54px_rgb(0_0_0/.38)]', size === 'lg' ? 'w-[400px] text-[13.5px] max-[480px]:w-full' : 'w-[344px]', cls)}
  role={demo ? 'group' : undefined} aria-label={demo ? 'Email Assistant demo card' : undefined}>
  <div class="mb-2.5 flex items-center gap-2"><span class="inline-flex h-5 items-center rounded-full bg-[rgb(167_226_110/.14)] px-[9px] text-[11.5px] font-semibold text-[#c4f08a]">Daily summary</span><span class="ml-auto text-[11.5px] text-[#8d8d8d]">1 of 3 important</span></div>
  <p class="m-0 text-xs text-[#9a9a9a]">Mr. Lee · Biology</p>
  <p class="mb-1 text-sm font-[650] text-white">Quiz moved to Friday</p>
  <p class="mb-3 text-[#bdbdbd]">Your quiz moved from Wednesday to Friday. He wants a quick reply so he knows you saw it.</p>
  <p class="mb-2 font-semibold text-[#ececec]">How do you want to reply?</p>
  <div class="mb-3 grid gap-1.5" role="radiogroup" aria-label="Reply choices">
    {#each options as o, i}
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <div class="group {opt} {demo ? 'cursor-pointer hover:bg-[#2b2d2e]' : ''}" role="radio" aria-checked={selected === i}
        tabindex={demo ? (selected === i ? 0 : -1) : undefined} onclick={demo ? () => choose(i) : undefined} onkeydown={demo ? (e) => key(e, i) : undefined}>
        <span class={radio}></span>
        <span class="min-w-0 flex-1"><b class="block font-semibold text-[#efefef]">{o.title}</b><small class="block text-xs text-[#9b9b9b]">{o.note}</small></span>
      </div>
    {/each}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div class="group {opt} {demo ? 'cursor-pointer hover:bg-[#2b2d2e]' : ''}" role="radio" aria-checked={selected === options.length}
      tabindex={demo ? (selected === options.length ? 0 : -1) : undefined}
      onclick={demo ? (e) => { choose(options.length); if (e.target.tagName !== 'INPUT') otherInput?.focus(); } : undefined}
      onkeydown={demo ? (e) => key(e, options.length) : undefined}>
      <span class={radio}></span>
      <span class="min-w-0 flex-1"><b class="block font-semibold text-[#efefef]">Other</b>
        {#if demo}
          <input bind:this={otherInput} type="text" placeholder="Type your own reply…" aria-label="Your own reply" onfocus={() => choose(options.length)}
            class="mt-[5px] block w-full rounded-md border border-[#3a3a3a] bg-[#191919] px-2 py-[5px] text-[12.5px] text-[#e8e8e8] focus:border-[#a7e26e] focus:outline-none">
        {:else if fakeOther}
          <span class="mt-[5px] block w-full rounded-md border border-[#3a3a3a] bg-[#191919] px-2 py-[5px] text-[12.5px] text-[#777]">Type your own reply…</span>
        {/if}
      </span>
    </div>
  </div>
  <div class="flex justify-end gap-2">
    {#if demo}
      <button class="{btn} hover:bg-[#333]" type="button" onclick={() => (note = 'Skipped. In the app, the next email shows up here.')}>Skip</button>
      <button class="{btn} border-[#a7e26e] bg-[#a7e26e] !text-[#0b1110] hover:bg-[#cef79e]" type="button" onclick={() => (note = 'Just a demo, so nothing was sent.')}>Preview &amp; Send</button>
    {:else}
      <span class={btn}>Skip</span><span class="{btn} border-[#a7e26e] bg-[#a7e26e] !text-[#0b1110]">Preview &amp; Send</span>
    {/if}
  </div>
  {#if demo}<p class="mt-2 mb-0 text-right text-[11.5px] text-[#8d8d8d] empty:hidden" aria-live="polite">{note}</p>{/if}
</div>
