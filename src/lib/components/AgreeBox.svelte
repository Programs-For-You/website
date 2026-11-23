<script>
  import { onMount } from 'svelte';
  import { agree, loadAgree, setAgree } from '#lib/agree.svelte.js';
  import { check } from '#lib/ui.js';
  import { cn } from '#lib/cn.js';
  /** Check this once and every download button on the page works. */
  let { class: cls = '' } = $props();
  onMount(loadAgree);
</script>

<div data-agree class={cn('basis-full text-left !min-w-0', cls)}>
  <label class={check}>
    <input type="checkbox" checked={agree.ok} onchange={(e) => setAgree(e.currentTarget.checked)}>
    <span>I’m 13 or older, and I agree to the <a href="/terms" target="_blank" rel="noopener">Terms of Service</a> and <a href="/privacy" target="_blank" rel="noopener">Privacy Policy</a>. If I’m under 18, a parent or guardian is OK with it.</span>
  </label>
  {#if agree.warn && !agree.ok}<p class="mt-2 mb-0 text-[.88rem] text-danger" role="alert">Please check the box first to download.</p>{/if}
</div>
