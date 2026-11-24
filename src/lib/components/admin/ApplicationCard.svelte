<script>
  import { cn } from '#lib/cn.js';
  import { card, when } from '#lib/admin.js';
  import { enhance } from '$app/forms';
  import Button from '#lib/components/Button.svelte';
  import DeleteButton from './DeleteButton.svelte';

  let { application: a, canAdd = false } = $props();
</script>

<article class={cn(card, 'mb-4')}>
  <div class="mb-2 flex flex-wrap items-baseline justify-between gap-x-4">
    <h2 class="m-0 text-[1.05rem]">{a.name}</h2>
    <span class="text-[.82rem] text-faint">{when(a.created_at)}</span>
  </div>
  <p class="mb-3 text-[.9rem] text-muted"><a href={`mailto:${a.email}`}>{a.email}</a> · {a.grade} grade · {a.role} · {a.department}</p>
  <p class="mb-1 text-[.82rem] font-semibold">Why they want to join</p>
  <p class="mb-3 whitespace-pre-wrap">{a.why}</p>
  {#if a.skills}
    <p class="mb-1 text-[.82rem] font-semibold">Skills or experience</p>
    <p class="mb-3 whitespace-pre-wrap">{a.skills}</p>
  {/if}
  <div class="flex flex-wrap gap-2">
    {#if canAdd}
      <form method="POST" action="?/addFromApplication" use:enhance><input type="hidden" name="id" value={a.id}><Button type="submit" size="sm">Add as volunteer</Button></form>
    {/if}
    <DeleteButton action="?/removeApplication" id={a.id} label={`the application from ${a.name}`} />
  </div>
</article>
