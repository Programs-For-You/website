<script>
  import { enhance } from '$app/forms';
  import Button from '#lib/components/Button.svelte';
  import { cn } from '#lib/cn.js';

  /** Desktop navigation for the admin page. sections: [{ id, label }]. counts: { [id]: number }. */
  let { sections = [], counts = {}, active = '', onselect = () => {}, class: cls = '' } = $props();

  const item = (on) => cn('flex w-full items-center justify-between rounded-lg px-3.5 py-2.5 text-left text-[.92rem] font-semibold transition-colors',
    on ? 'bg-ink text-bg' : 'text-muted hover:bg-surface hover:text-ink');
</script>

<aside class={cn('sticky top-24 flex flex-col gap-6 self-start', cls)}>
  <nav aria-label="Admin sections" class="flex flex-col gap-1">
    {#each sections as s (s.id)}
      <button type="button" class={item(active === s.id)} aria-current={active === s.id ? 'page' : undefined} onclick={() => onselect(s.id)}>
        <span>{s.label}</span>
        <span class="text-[.8rem] font-medium opacity-70">{counts[s.id] ?? 0}</span>
      </button>
    {/each}
  </nav>
  <div class="flex flex-col items-start gap-3 border-t border-border pt-4">
    <a href="/team" class="text-[.9rem]">View Team page →</a>
    <form method="POST" action="?/logout" use:enhance><Button type="submit" variant="outline" size="sm">Log out</Button></form>
  </div>
</aside>
