<script>
  /** Download counts per file, from the downloads table (filled by /get/<file>). */
  let { downloads = [] } = $props();
  const total = $derived(downloads.reduce((n, d) => n + d.count, 0));
</script>

<div class="rounded-[14px] border border-border bg-surface p-5">
  <p class="m-0 font-mono text-mono uppercase text-muted">Total downloads</p>
  <p class="m-0 text-[2.4rem] font-semibold leading-tight">{total.toLocaleString()}</p>
</div>

<ul class="mt-4 flex list-none flex-col gap-2 p-0">
  {#each downloads as d (d.file)}
    <li class="flex items-center justify-between gap-4 rounded-[12px] border border-border px-4 py-3">
      <span class="min-w-0 break-all font-semibold">{d.file}</span>
      <span class="flex-none text-right">
        <span class="block font-semibold">{d.count.toLocaleString()}</span>
        {#if d.last_at}<span class="block text-[.78rem] text-faint">last {d.last_at} UTC</span>{/if}
      </span>
    </li>
  {:else}
    <li class="text-muted">No downloads counted yet.</li>
  {/each}
</ul>
