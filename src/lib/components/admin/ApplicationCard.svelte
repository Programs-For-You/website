<script>
  import { cn } from '#lib/cn.js';
  import { card, when } from '#lib/admin.js';
  import { enhance } from '$app/forms';
  import Button from '#lib/components/Button.svelte';

  let { application: a, canAdd = false } = $props();
</script>

<article class={cn(card, 'mb-4')}>
  <div class="mb-2 flex flex-wrap items-baseline justify-between gap-x-4">
    <h2 class="m-0 text-[1.05rem]">{a.name}{#if a.read_at}<span class="ml-2 text-[.78rem] font-normal text-faint">Read</span>{/if}</h2>
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
    <form method="POST" action="?/markApplicationRead" use:enhance>
      <input type="hidden" name="id" value={a.id}>
      <input type="hidden" name="read" value={a.read_at ? '0' : '1'}>
      <Button type="submit" variant="outline" size="sm">{a.read_at ? 'Mark as unread' : 'Mark as read'}</Button>
    </form>
  </div>
</article>
