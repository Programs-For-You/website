<script>
  import Badge from './Badge.svelte';
  import { APPS, GAMES, MAC_APP } from '#lib/config.js';
  /** "Free download" or "Coming soon" for an app or game id, straight from config.js. */
  let { id, ...rest } = $props();
  const app = $derived([MAC_APP, ...APPS, ...GAMES].find((a) => a.id === id));
  const ready = $derived(Boolean(app && app.status === 'available' && app.file));
</script>

<Badge tone={ready ? 'ok' : 'soon'} {...rest}>{ready ? 'Free download' : 'Coming soon'}</Badge>
