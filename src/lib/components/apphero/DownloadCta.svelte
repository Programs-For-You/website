<script>
  import Button from '#lib/components/Button.svelte';
  import Icon from './Icon.svelte';
  import AgreeBox from '#lib/components/AgreeBox.svelte';
  import { gate } from '#lib/agree.svelte.js';
  /** Repeat download call-to-action at the bottom of a project page. buttons: [{ href, label }] (download: true makes the link a file download). */
  let { title, text = '', buttons = [], note = '' } = $props();
  const anyFile = $derived(buttons.some((b) => b.download));
</script>

<section class="py-22 max-sm:py-16" id="download">
  <div class="mx-auto w-full max-w-[780px] px-5 max-[400px]:px-4">
    <div class="rounded-card-lg border border-border bg-surface px-6 py-10 text-center">
      <h2 class="mb-2.5 text-[1.6rem]">{title}</h2>
      {#if text}<p class="mx-auto mb-5 max-w-[520px] text-muted">{text}</p>{/if}
      {#if anyFile}<AgreeBox class="mx-auto mb-5 max-w-[520px]" />{/if}
      <div class="flex flex-wrap items-center justify-center gap-3">
        {#each buttons as b, i}
          <Button href={b.href} download={b.download} onclick={b.download ? gate : undefined} variant={i === 0 ? 'primary' : 'ghost'}><Icon name="download" class="size-[18px]" /> {b.label}</Button>
        {/each}
      </div>
      {#if note}<p class="mt-3.5 mb-0 text-[.86rem] text-faint">{note}</p>{/if}

    </div>
  </div>
</section>
