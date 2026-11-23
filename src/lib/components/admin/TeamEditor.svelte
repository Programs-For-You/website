<script>
  import { enhance } from '$app/forms';
  import { onMount, tick } from 'svelte';
  import Button from '#lib/components/Button.svelte';
  import { cn } from '#lib/cn.js';
  import PersonRow from './PersonRow.svelte';

  /** The Team tab: every card in one form, with a Save bar that only shows once something has changed. */
  let { people, standalone = false } = $props();

  const blank = { id: '', sort: 0, name: '', title: '', note: '', founder: 0, soon: 0 };

  let formEl = $state();
  let addKey = $state(0); // bumped after a save so the Add-someone card clears
  let dirty = $state(false);
  let baseline = {};

  const snapshot = () => {
    const f = new FormData(formEl);
    const rows = new Set(f.getAll('row').map(String));
    const vals = {};
    for (const [k, v] of f.entries()) if (k !== 'row') vals[k] = String(v);
    return { rows, vals };
  };
  const rowOf = (key) => key.slice(key.lastIndexOf('_') + 1);

  function rebase() { baseline = snapshot().vals; dirty = false; }
  function check() {
    const { rows, vals } = snapshot();
    // Compare current vs. saved values (unchecked boxes are simply absent), ignoring cards that were removed.
    const keys = new Set([...Object.keys(vals), ...Object.keys(baseline).filter((k) => rows.has(rowOf(k)))]);
    dirty = [...keys].some((k) => (vals[k] ?? '') !== (baseline[k] ?? ''));
  }
  function discard() {
    formEl.reset();
    addKey++;
    tick().then(rebase);
  }

  onMount(rebase);
</script>

<form bind:this={formEl} method="POST" action="?/saveAll" oninput={check} onchange={check}
  use:enhance={() => async ({ result, update }) => {
    const saved = result.type === 'success';
    if (saved) addKey++;
    await update({ reset: false });
    await tick();
    if (saved) rebase(); else check();
  }}>
  <div class="border-y border-border">
    <table class="w-full table-fixed border-collapse max-md:block">
      <colgroup class="max-md:hidden"><col class="w-[22%]"><col class="w-[22%]"><col><col class="w-[90px]"><col class="w-[96px]"><col class="w-[110px]"><col class="w-[130px]"></colgroup>
      <thead class="max-md:hidden">
        <tr class="border-b border-border bg-surface text-left text-[.82rem] font-bold tracking-[.05em] text-faint uppercase [&>th]:px-3 [&>th]:py-3.5">
          <th class="pl-4!">Name</th><th>Title</th><th>Note</th>
          <th class="text-center">Order</th><th class="text-center">Founder</th><th class="text-center">Open spot</th><th><span class="sr-only">Actions</span></th>
        </tr>
      </thead>
      <tbody class="max-md:block">
        {#each people as p (p.id)}<PersonRow person={p} />{/each}
        {#key addKey}<PersonRow person={blank} isNew />{/key}
      </tbody>
    </table>
  </div>
  <p class="mt-2 text-[.9rem] text-faint">Fill in the last row to add someone. “Open spot” shows a “Coming soon” card instead of a name.</p>

  {#if dirty}
    <!-- Only appears once something changed. In the installed app it sits above the floating tab bar. -->
    <div class={cn('sticky z-10 -mx-1 mt-2 flex items-center gap-3 border-t border-border bg-bg/95 px-1 py-3 backdrop-blur', standalone ? 'bottom-[calc(96px+env(safe-area-inset-bottom))]' : 'bottom-0')}>
      <Button type="submit">Save changes</Button>
      <Button type="button" variant="outline" onclick={discard}>Discard</Button>
      <span class="text-[.85rem] text-faint">You have unsaved changes.</span>
    </div>
  {/if}
</form>
