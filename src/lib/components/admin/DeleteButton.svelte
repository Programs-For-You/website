<script>
  import { enhance } from '$app/forms';
  import Button from '#lib/components/Button.svelte';

  /** A small form that deletes one row after a confirm. action: '?/removeX', id: the row id, label: what to name in the prompt. */
  let { action, id, label } = $props();
</script>

<form method="POST" {action} use:enhance>
  <input type="hidden" name="id" value={id}>
  <Button type="submit" variant="outline" size="sm"
    onclick={(e) => { if (!confirm(`Delete ${label}? This can’t be undone.`)) e.preventDefault(); }}>Delete</Button>
</form>
