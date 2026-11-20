<script>
  /** The scrolling table used for the email list and Windows agreements. cells(row) renders the <td>s. */
  let { heads, rows, cells } = $props();
</script>

{#if !rows.length}
  <p class="text-muted">Nothing here yet.</p>
{:else}
  <div class="overflow-x-auto rounded-xl border border-border bg-surface">
    <table class="w-full border-collapse text-[.88rem]">
      <thead>
        <tr>
          {#each heads as h}
            <th class="whitespace-nowrap border-b border-border px-3.5 py-2.5 text-left text-[.74rem] font-bold tracking-[.05em] text-faint uppercase">{h}</th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each rows as r}
          <tr class="[&>td]:whitespace-nowrap [&>td]:border-b [&>td]:border-border [&>td]:px-3.5 [&>td]:py-2.5 [&>td]:text-left [&:last-child>td]:border-b-0">{@render cells(r)}</tr>
        {/each}
      </tbody>
    </table>
  </div>
{/if}
