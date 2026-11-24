<script>
  import { enhance } from '$app/forms';
  import Button from '#lib/components/Button.svelte';
  import DeleteButton from './DeleteButton.svelte';
  import { cn } from '#lib/cn.js';
  import { input, select, field, fieldLabel } from '#lib/ui.js';
  import { card, ROLE_LABEL } from '#lib/admin.js';

  /** Admin level 1 only: make accounts (an invite email is sent), change roles, turn people off, delete them. */
  let { users = [], me } = $props();
  const ROLES = [['admin1', 'Admin 1 (everything)'], ['admin2', 'Admin 2 (messages and applications)']];
  const status = (u) => (u.disabled ? 'Turned off' : u.active ? 'Active' : 'Invited');
</script>

<form class={cn(card, 'mb-6')} method="POST" action="?/invite" use:enhance={() => async ({ update }) => update({ reset: true })}>
  <h2 class="mb-4 text-[1.1rem]">Add a person</h2>
  <div class="grid gap-x-4 sm:grid-cols-2">
    <div class={field}><label class={fieldLabel} for="inv-name">Name</label><input class={input} id="inv-name" name="name" required maxlength="100"></div>
    <div class={field}><label class={fieldLabel} for="inv-email">Email</label><input class={input} id="inv-email" name="email" type="email" required></div>
  </div>
  <div class={field}><label class={fieldLabel} for="inv-role">Role</label>
    <select class={cn(input, select)} id="inv-role" name="role">{#each ROLES as [v, l]}<option value={v} selected={v === 'admin2'}>{l}</option>{/each}</select></div>
  <Button type="submit">Send invite</Button>
</form>

{#each users as u (u.id)}
  <article class={cn(card, 'mb-4', u.disabled && 'opacity-60')}>
    <div class="mb-2 flex flex-wrap items-baseline justify-between gap-x-4">
      <h2 class="m-0 text-[1.05rem]">{u.name}{u.id === me ? ' (you)' : ''}</h2>
      <span class="text-[.82rem] text-faint">{status(u)} · {ROLE_LABEL[u.role]}</span>
    </div>
    <p class="mb-3 text-[.9rem] text-muted"><a href={`mailto:${u.email}`}>{u.email}</a></p>
    {#if u.id !== me}
      <div class="flex flex-wrap items-center gap-2">
        <form method="POST" action="?/setRole" use:enhance class="flex items-center gap-2">
          <input type="hidden" name="id" value={u.id}>
          <select class={cn(input, select, 'h-9 w-auto text-[.9rem]')} name="role" aria-label={`Role for ${u.name}`}>{#each ROLES as [v, l]}<option value={v} selected={v === u.role}>{l}</option>{/each}</select>
          <Button type="submit" variant="outline" size="sm">Change</Button>
        </form>
        {#if !u.disabled}
          <form method="POST" action="?/resendLink" use:enhance><input type="hidden" name="id" value={u.id}><Button type="submit" variant="outline" size="sm">{u.active ? 'Send reset link' : 'Resend invite'}</Button></form>
        {/if}
        <form method="POST" action="?/toggleUser" use:enhance><input type="hidden" name="id" value={u.id}><Button type="submit" variant="outline" size="sm">{u.disabled ? 'Turn on' : 'Turn off'}</Button></form>
        <DeleteButton action="?/removeUser" id={u.id} label={`${u.name}’s account`} />
      </div>
    {/if}
  </article>
{:else}
  <p class="text-muted">No accounts yet.</p>
{/each}
