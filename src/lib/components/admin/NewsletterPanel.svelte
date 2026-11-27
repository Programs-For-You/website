<script>
  import { enhance } from '$app/forms';
  import Button from '#lib/components/Button.svelte';
  import DeleteButton from './DeleteButton.svelte';
  import { cn } from '#lib/cn.js';
  import { input, field, fieldLabel, fieldHint, check } from '#lib/ui.js';
  import { card } from '#lib/admin.js';

  /** Admin level 1 only. Write a newsletter, send yourself a test, then send it to everyone still subscribed. */
  let { subscribers = [] } = $props();
  const active = $derived(subscribers.filter((s) => !s.unsubscribed));
  let busy = $state(false);
</script>

<div class={cn(card, 'mb-6')}>
  <p class="m-0 font-mono text-mono uppercase text-muted">Subscribers</p>
  <p class="m-0 text-[2.4rem] font-semibold leading-tight">{active.length.toLocaleString()}</p>
</div>

<form class={cn(card, 'mb-6')} method="POST" action="?/sendNewsletter"
  use:enhance={({ action, submitter }) => {
    if (submitter?.value !== 'test' && !confirm(`Send this to ${active.length} ${active.length === 1 ? 'person' : 'people'}? This can’t be undone.`)) return ({ cancel }) => cancel();
    busy = true;
    return async ({ update }) => { await update({ reset: false }); busy = false; };
  }}>
  <h2 class="mb-4 text-[1.1rem]">Send a newsletter</h2>
  <div class={field}><label class={fieldLabel} for="nl-subject">Subject</label><input class={input} id="nl-subject" name="subject" required maxlength="150"></div>
  <div class={field}><label class={fieldLabel} for="nl-body">Message</label>
    <textarea class={cn(input, 'h-auto min-h-[200px] resize-y py-3 leading-normal')} id="nl-body" name="body" required maxlength="8000"></textarea>
    <span class={fieldHint}>Plain text. Leave a blank line between paragraphs. Every email gets its own Unsubscribe link automatically.</span></div>
  <div class="grid gap-x-4 sm:grid-cols-2">
    <div class={field}><label class={fieldLabel} for="nl-bl">Button label (optional)</label><input class={input} id="nl-bl" name="buttonLabel" maxlength="40" placeholder="Download now"></div>
    <div class={field}><label class={fieldLabel} for="nl-bu">Button link (optional)</label><input class={input} id="nl-bu" name="buttonUrl" type="url" maxlength="500" placeholder="https://programsforyou.com/school-schedule"></div>
  </div>
  <label class={check}><input type="checkbox" name="confirm"> I checked it and want to send it to all {active.length} subscribers</label>
  <div class="flex flex-wrap gap-3">
    <Button type="submit" name="mode" value="test" variant="outline" disabled={busy}>Send me a test</Button>
    <Button type="submit" name="mode" value="all" disabled={busy || !active.length}>{busy ? 'Sending…' : 'Send to everyone'}</Button>
  </div>
</form>

<ul class="flex list-none flex-col gap-2 p-0">
  {#each subscribers as s (s.id)}
    <li class="flex items-center justify-between gap-4 rounded-[12px] border border-border px-4 py-3">
      <span class="min-w-0"><span class="block break-all font-semibold">{s.email}</span>
        <span class="block text-[.78rem] text-faint">{s.created_at} UTC{s.unsubscribed ? ' · unsubscribed' : ''}</span></span>
      <DeleteButton action="?/removeSubscriber" id={s.id} label={s.email} />
    </li>
  {:else}
    <li class="text-muted">No subscribers yet.</li>
  {/each}
</ul>
