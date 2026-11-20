<script>
  import { onMount } from 'svelte';
  import Button from '../Button.svelte';
  import DlCard from './DlCard.svelte';
  import { savedEmail } from '#lib/emaillist.js';
  import { cn } from '#lib/cn.js';

  /**
   * A Mac + Windows download card. isWindows: the visitor is on Windows, so the Windows button comes first and is the big one.
   * Owen Wang's Terms of Service must be agreed to (per app, remembered in localStorage) before the Windows download or code.
   */
  let { app, isWindows = false } = $props();

  const TERMS_KEY = 'pfy-windows-terms';
  const w = $derived(app.windows);
  const mac = $derived(app.status === 'available' && app.file);
  const win = $derived(w && w.status === 'available' && w.file);
  const macMeta = $derived(['Mac', app.requires, mac && app.version && `Version ${app.version}`, mac && app.size].filter(Boolean).join(' · '));
  const winMeta = $derived(win ? ['Windows', w.requires, w.version && `Version ${w.version}`, w.size].filter(Boolean).join(' · ') : 'Windows · coming soon');
  const note = $derived(mac && (app.history || []).find((h) => h.version === app.version));
  const hasNote = $derived(note && (note.fixed || note.added));
  const needsTerms = $derived(Boolean(win && w.terms));
  const page = $derived(app.page.replace(/\.html(?=#|$)/, ''));

  let agreed = $state(false);
  let showMsg = $state(false);
  let termsLabel = $state();

  onMount(() => {
    try { agreed = !w?.terms || localStorage.getItem(`${TERMS_KEY}-${app.id}`) === w.termsVersion; } catch { agreed = !w?.terms; }
  });
  const locked = $derived(needsTerms && !agreed);

  async function recordAgreement() {
    const body = new URLSearchParams({ 'form-name': 'windows-terms', email: savedEmail() || '', app: app.name,
      terms: w.terms, version: w.termsVersion, agreed_at: new Date().toISOString() });
    if (['localhost', '127.0.0.1'].includes(location.hostname)) { console.info('[preview] Would save agreement', Object.fromEntries(body)); return; }
    try { await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() }); } catch { /* the download still works */ }
  }

  function onAgree(e) {
    agreed = e.currentTarget.checked;
    try {
      if (agreed) localStorage.setItem(`${TERMS_KEY}-${app.id}`, w.termsVersion);
      else localStorage.removeItem(`${TERMS_KEY}-${app.id}`);
    } catch { /* storage blocked: they can still agree each visit */ }
    if (agreed) { showMsg = false; recordAgreement(); }
  }

  // Locked until they agree. (Not "disabled": a click still shows what to do.)
  function guard(e) {
    if (!locked) return;
    e.preventDefault();
    showMsg = true;
    termsLabel.classList.remove('animate-nudge'); void termsLabel.offsetWidth; termsLabel.classList.add('animate-nudge');
    termsLabel.querySelector('input').focus();
  }
  const lockTitle = $derived(locked ? 'Agree to the Terms of Service first (the box below)' : undefined);
  const lockCls = $derived(locked && 'opacity-[.55] cursor-not-allowed');
</script>

<DlCard icon={app.icon} name={app.name} blurb={app.blurb}>
  {#snippet body()}
    <p class="m-0 mt-1 text-[.8rem] text-faint">{macMeta}</p>
    <p class="m-0 mt-1 text-[.8rem] text-faint">{winMeta}</p>
    {#if hasNote}
      <details class="group mt-2 text-[.84rem]">
        <summary class="w-fit cursor-pointer font-semibold text-accent">What’s new in Mac version {app.version}</summary>
        {#if note.fixed}<p class="m-0 mt-1.5 text-muted"><b class="text-ink">Fixed:</b> {note.fixed}</p>{/if}
        {#if note.added}<p class="m-0 mt-1.5 text-muted"><b class="text-ink">Added:</b> {note.added}</p>{/if}
      </details>
    {/if}
  {/snippet}
  {#snippet actions()}
    {#snippet macBtn()}
      {#if mac}
        <Button variant={isWindows ? 'ghost' : 'primary'} href={app.file} download class="max-[640px]:flex-1">Mac Download</Button>
      {:else}
        <Button tag="span" variant="ghost" aria-disabled="true" class="max-[640px]:flex-1">Mac: coming soon</Button>
      {/if}
    {/snippet}
    {#snippet winBtn()}
      {#if win}
        <Button variant={isWindows ? 'primary' : 'ghost'} href={w.file} download title={lockTitle} data-locked={locked ? '' : undefined} onclick={guard} class={cn('max-[640px]:flex-1', lockCls)}>Windows Download</Button>
      {:else}
        <Button tag="span" variant="ghost" aria-disabled="true" class="max-[640px]:flex-1">Windows: coming soon</Button>
      {/if}
    {/snippet}
    <div class="flex flex-wrap gap-2 max-[640px]:w-full">
      {#if isWindows}{@render winBtn()}{@render macBtn()}{:else}{@render macBtn()}{@render winBtn()}{/if}
    </div>
    {#if needsTerms}
      <label bind:this={termsLabel} class="mt-0.5 flex basis-full cursor-pointer items-start gap-2 text-[.8rem] leading-[1.4] text-muted motion-reduce:animate-none! [&_input]:mt-px [&_input]:size-4 [&_input]:flex-none [&_input]:cursor-pointer [&_input]:accent-accent">
        <input type="checkbox" checked={agreed} onchange={onAgree}>
        <span>For the Windows version, I agree to <a class="font-semibold" href={w.terms} target="_blank" rel="noopener">{w.termsBy || 'its maker'}’s Terms of Service</a>.</span>
      </label>
      <p class="m-0 basis-full text-[.8rem] font-semibold text-warn" role="alert" hidden={!showMsg}>Check the box to agree to {w.termsBy || 'the maker'}’s Terms of Service first.</p>
    {/if}
    <a class="text-[.9rem] whitespace-nowrap" href="{page}#how-to-use">How to use it</a>
    {#if app.source}
      <a class="text-[.8rem] whitespace-nowrap text-faint" href={app.source} download>Mac source code ({app.license || 'license'})</a>
    {/if}
    {#if win && w.source}
      <a class={cn('text-[.8rem] whitespace-nowrap text-faint', lockCls)} href={w.source} rel="noopener" title={lockTitle} data-locked={locked ? '' : undefined} onclick={guard}>Windows source code ({app.license || 'license'})</a>
    {/if}
  {/snippet}
</DlCard>
