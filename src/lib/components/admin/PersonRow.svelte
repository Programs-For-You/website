<script>
  import Button from '#lib/components/Button.svelte';
  import { cn } from '#lib/cn.js';

  /** One editable row of the Team table. Field names end in _<row> so the server can tell rows apart. */
  let { person: p, isNew = false } = $props();
  const k = $derived(isNew ? 'new' : p.id);

  // Quiet until hovered or focused, so a table full of inputs still reads as a table.
  const cell = 'h-14 w-full border border-transparent bg-transparent px-3 text-[1.05rem] text-ink placeholder:text-faint hover:border-border-strong focus:border-accent focus:bg-bg focus:ring-[3px] focus:ring-accent-soft focus:outline-none';
  const box = 'size-5 cursor-pointer accent-accent';
</script>

<tr class={cn('border-b border-border last:border-b-0 [&>td]:px-1.5 [&>td]:py-2 max-md:grid max-md:grid-cols-2 max-md:items-center max-md:p-2', isNew ? 'bg-accent-soft' : 'hover:bg-surface-2/50')}>
  <td class="pl-3! max-md:col-span-1 max-md:pl-1.5!">
    <input type="hidden" name="row" value={k}>
    <input class={cell} name="name_{k}" value={p.name ?? ''} placeholder={isNew ? 'Add someone…' : 'Name'} aria-label="Name" autocomplete="off">
  </td>
  <td class="max-md:col-span-1"><input class={cell} name="title_{k}" value={p.title} placeholder="Title" aria-label="Title" autocomplete="off"></td>
  <td class="max-md:col-span-2"><input class={cell} name="note_{k}" value={p.note ?? ''} placeholder="Note (optional)" aria-label="Note" maxlength="300" autocomplete="off"></td>
  <td class="max-md:flex max-md:items-center max-md:gap-2"><span class="text-[.8rem] text-muted md:hidden">Order</span><input class={cn(cell, 'text-center')} name="sort_{k}" type="number" value={p.sort} aria-label="Order"></td>
  <td class="text-center max-md:flex max-md:items-center max-md:gap-2 max-md:text-left"><input class={box} type="checkbox" name="founder_{k}" checked={Boolean(p.founder)} aria-label="Founder"><span class="text-[.8rem] text-muted md:hidden">Founder</span></td>
  <td class="text-center max-md:flex max-md:items-center max-md:gap-2 max-md:text-left"><input class={box} type="checkbox" name="soon_{k}" checked={Boolean(p.soon)} aria-label="Open spot (Coming soon)"><span class="text-[.8rem] text-muted md:hidden">Open spot</span></td>
  <td class="pr-3! text-right max-md:pr-1.5!">
    {#if isNew}
      <span class="text-[.78rem] font-semibold tracking-[.05em] text-accent uppercase">New</span>
    {:else}
      <Button type="submit" variant="outline" size="sm" name="removeId" value={p.id} formaction="?/remove" formnovalidate
        onclick={(e) => { if (!confirm(`Remove ${p.name || 'this spot'} from the Team page? Unsaved edits on this page are kept.`)) e.preventDefault(); }}>Remove</Button>
    {/if}
  </td>
</tr>
