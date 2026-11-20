{#snippet check(label, on = false)}
  <span class="flex items-center gap-2 py-[3px] pl-3 text-ink">
    <i class={['relative size-3.5 flex-none rounded-[3px] border not-italic', on ? "border-accent bg-accent after:absolute after:top-px after:left-1 after:h-[7px] after:w-[3px] after:rotate-45 after:border-solid after:border-accent-ink after:border-r-2 after:border-b-2 after:content-['']" : 'border-faint bg-surface']}></i>{label}
  </span>
{/snippet}
{#snippet btn(label, hl = false, cls = '')}
  <span class={['grid h-[26px] min-w-[68px] place-items-center rounded-[4px] border bg-surface px-2.5 text-[.76rem] whitespace-nowrap text-ink', hl ? 'border-accent font-semibold shadow-[0_0_0_3px_var(--accent-soft)]' : 'border-border-strong', cls]}>{label}</span>
{/snippet}

<div class="w-[450px] max-w-full overflow-hidden rounded-lg border border-border-strong bg-surface text-[.8rem] shadow-soft" role="img" aria-label="Example: the installer’s Select Additional Tasks page with two checkboxes and Back, Next and Cancel buttons">
  <div class="flex h-8 items-center border-b border-border pl-3 text-[.76rem] text-muted">
    <span class="min-w-0 flex-1 truncate">Setup - WHS School Schedule Manager</span>
    <i class="w-9 flex-none text-center text-[.8rem] not-italic">&ndash;</i>
    <i class="w-9 flex-none text-center text-[.8rem] not-italic">&#9633;</i>
    <i class="w-9 flex-none text-center text-[.8rem] not-italic">&#10005;</i>
  </div>
  <div class="grid gap-0.5 border-b border-border px-4 py-3">
    <b class="text-[.86rem] text-ink">Select Additional Tasks</b>
    <span class="pl-3.5 text-muted">Which additional tasks should be performed?</span>
  </div>
  <div class="bg-surface-2 pt-3.5 pr-4 pb-[18px] pl-[30px]">
    <p class="mb-2! text-[.8rem] text-ink!">Additional shortcuts:</p>
    {@render check('Create a desktop shortcut')}
    {@render check('Create a shortcut to launch the app on computer startup', true)}
  </div>
  <div class="flex justify-end gap-2 border-t border-border bg-surface-2 px-3.5 py-2.5">
    {@render btn('< Back')}{@render btn('Next >', true, 'mr-1.5')}{@render btn('Cancel')}
  </div>
</div>
