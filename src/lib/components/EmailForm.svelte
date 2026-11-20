<script>
  import { onMount } from 'svelte';
  import Button from './Button.svelte';
  import FormMessage from './FormMessage.svelte';
  import { cn } from '#lib/cn.js';
  import { input, check, fine } from '#lib/ui.js';
  import { joinList, saveEmail, confirmAge, ageConfirmed } from '#lib/emaillist.js';

  /**
   * The email-list sign-up. Posts to Netlify Forms ("email-list").
   * source: where it was placed (shows in the Netlify list).   centered: centers the checkbox and fine print.
   * onjoined({ email, say }): runs after a save. Default clears the box and says thanks.
   * fineprint: false hides the "Unsubscribe anytime" line.     children: extra content under the form.
   * bind:this and call reset() or focus() from outside (the Downloads page does).
   */
  let { source = 'home', centered = false, onjoined, fineprint = true, submitLabel = 'Sign me up', class: cls = '', children } = $props();

  const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  let email = $state('');
  let age = $state(false);
  let company = $state('');
  let ageHidden = $state(false);
  let busy = $state(false);
  let msg = $state({ text: '', kind: 'error' });
  let emailInput = $state();

  const say = (text, kind = 'error') => { msg = { text, kind }; };

  onMount(() => {
    if (ageConfirmed()) { age = true; ageHidden = true; }
  });

  export function reset() { email = ''; msg = { text: '', kind: 'error' }; }
  export function focus() { emailInput?.focus(); }

  async function submit(e) {
    e.preventDefault();
    if (busy) return;
    const clean = email.trim();
    if (company) return; // a bot filled the hidden box
    if (!EMAIL_OK.test(clean)) return say('That email address doesn’t look right.');
    if (!age) return say('Please check the box to confirm you’re 18 or older.');
    busy = true;
    const ok = await joinList(clean, source, '18 or older');
    busy = false;
    if (!ok) return say('Your email couldn’t be saved. Please try again.');
    saveEmail(clean);
    confirmAge();
    if (onjoined) onjoined({ email: clean, say });
    else { email = ''; say(`You’re on the list! We’ll email ${clean} when something new comes out.`, 'ok'); }
  }
</script>

<!-- name / method / data-netlify / netlify-honeypot are what Netlify looks for in the built HTML. -->
<form class={cn('mx-auto max-w-[460px] text-left', cls)} name="email-list" method="POST" data-netlify="true" netlify-honeypot="company" onsubmit={submit} novalidate>
  <input type="hidden" name="form-name" value="email-list">
  <input type="hidden" name="source" value={source}>
  <p class="absolute -left-[9999px] size-px overflow-hidden" aria-hidden="true"><label>Leave this empty <input name="company" tabindex="-1" autocomplete="off" bind:value={company}></label></p>
  <div class="mb-3 flex gap-2.5 max-[480px]:flex-col">
    <input class={cn(input, 'min-w-0 flex-1')} bind:this={emailInput} bind:value={email} name="email" type="email" autocomplete="email" inputmode="email" placeholder="you@example.com" aria-label="Your email" required>
    <Button variant="primary" type="submit" disabled={busy} class="h-[46px] flex-none max-[480px]:w-full">{busy ? 'One sec…' : submitLabel}</Button>
  </div>
  <label class={cn(check, 'mb-3', centered && 'justify-center text-center', ageHidden && 'hidden')}><input type="checkbox" name="age" value="18 or older" bind:checked={age} required><span>I’m 18 or older.</span></label>
  <FormMessage text={msg.text} kind={msg.kind} class="mb-3" />
  {#if fineprint}<p class={cn(fine, centered ? 'text-center' : 'text-left')}>We’ll email you about new apps and updates. Unsubscribe anytime. <a href="/privacy">Privacy</a></p>{/if}
  {@render children?.()}
</form>
