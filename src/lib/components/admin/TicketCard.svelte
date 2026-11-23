<script>
  import { cn } from '#lib/cn.js';
  import { card, when } from '#lib/admin.js';
  import DeleteButton from './DeleteButton.svelte';

  let { ticket: t } = $props();
</script>

<article class={cn(card, 'mb-4')}>
  <div class="mb-2 flex flex-wrap items-baseline justify-between gap-x-4">
    <h2 class="m-0 text-[1.05rem]">{t.name} <span class="font-mono text-[.8rem] font-normal text-faint">{t.id}</span></h2>
    <span class="text-[.82rem] text-faint">{when(t.created_at)}</span>
  </div>
  <p class="mb-2 text-[.9rem] text-muted"><a href={`mailto:${t.email}?subject=${encodeURIComponent('Re: ' + t.id)}`}>{t.email}</a> · {t.app}</p>
  <p class="mb-4 whitespace-pre-wrap">{t.summary}</p>
  <DeleteButton action="?/removeTicket" id={t.id} label={`ticket ${t.id}`} />
</article>
