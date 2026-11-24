<script>
  import { enhance } from '$app/forms';
  import Button from '#lib/components/Button.svelte';
  import DeleteButton from './DeleteButton.svelte';
  import { cn } from '#lib/cn.js';
  import { input, select, field, fieldLabel, check } from '#lib/ui.js';
  import { card } from '#lib/admin.js';

  /** Admin level 1 only. Each volunteer is one card with Save. "Show on website" puts their name and team on /volunteers. */
  let { volunteers = [] } = $props();
  const DEPARTMENTS = ['Development', 'Social Media', 'Advertising', 'Hospitality'];
</script>

{#snippet fields(v, key)}
  <div class="grid gap-x-4 sm:grid-cols-2">
    <div class={field}><label class={fieldLabel} for={`n-${key}`}>Name</label><input class={input} id={`n-${key}`} name="name" value={v.name ?? ''} required maxlength="100"></div>
    <div class={field}><label class={fieldLabel} for={`e-${key}`}>Email</label><input class={input} id={`e-${key}`} name="email" type="email" value={v.email ?? ''} required></div>
    <div class={field}><label class={fieldLabel} for={`d-${key}`}>Department</label>
      <select class={cn(input, select)} id={`d-${key}`} name="department">{#each DEPARTMENTS as d}<option selected={d === v.department}>{d}</option>{/each}{#if v.department && !DEPARTMENTS.includes(v.department)}<option selected>{v.department}</option>{/if}</select></div>
    <div class={field}><label class={fieldLabel} for={`g-${key}`}>Grade</label><input class={input} id={`g-${key}`} name="grade" value={v.grade ?? ''} maxlength="20"></div>
  </div>
  <div class={field}><label class={fieldLabel} for={`o-${key}`}>Note (private)</label><input class={input} id={`o-${key}`} name="note" value={v.note ?? ''} maxlength="300"></div>
  <label class={check}><input type="checkbox" name="listed" checked={Boolean(v.listed)}> Show on website (only after they said it’s OK)</label>
{/snippet}

<form class={cn(card, 'mb-6')} method="POST" action="?/saveVolunteer" use:enhance={() => async ({ update }) => update({ reset: true })}>
  <h2 class="mb-4 text-[1.1rem]">Add a volunteer</h2>
  {@render fields({}, 'new')}
  <Button type="submit">Add volunteer</Button>
</form>

{#each volunteers as v (v.id)}
  <article class={cn(card, 'mb-4')}>
    <form method="POST" action="?/saveVolunteer" use:enhance={() => async ({ update }) => update({ reset: false })}>
      <input type="hidden" name="id" value={v.id}>
      {@render fields(v, v.id)}
      <Button type="submit" size="sm">Save</Button>
    </form>
    <div class="mt-3"><DeleteButton action="?/removeVolunteer" id={v.id} label={`${v.name} from volunteers`} /></div>
  </article>
{:else}
  <p class="text-muted">No volunteers yet. Add one above, or use “Add as volunteer” on an application.</p>
{/each}
