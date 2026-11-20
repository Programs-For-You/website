<script>
  import { onMount, tick } from 'svelte';
  import Seo from '#lib/components/Seo.svelte';
  import Container from '#lib/components/Container.svelte';
  import Card from '#lib/components/Card.svelte';
  import Button from '#lib/components/Button.svelte';
  import FormMessage from '#lib/components/FormMessage.svelte';
  import PageHead from '#lib/components/contact/PageHead.svelte';
  import SideCard from '#lib/components/contact/SideCard.svelte';
  import Honeypot from '#lib/components/contact/Honeypot.svelte';
  import DoneCheck from '#lib/components/contact/DoneCheck.svelte';
  import { SITE } from '#lib/config.js';
  import { savedEmail, saveEmail } from '#lib/emaillist.js';
  import { cn } from '#lib/cn.js';
  import { input, select, field, fieldLabel, fieldHint } from '#lib/ui.js';

  // Support tickets. Each ticket gets a number (like PFY-7K3Q2) and is sent to Netlify Forms ("support-ticket").
  const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const HISTORY = 'pfy-tickets';
  const textarea = 'h-auto min-h-[140px] py-3 leading-normal resize-y';
  const cardCls = 'relative rounded-card-lg border border-border bg-surface p-7';

  let form = $state();
  let done = $state();
  let msg = $state('');
  let sending = $state(false);
  let sent = $state(false);
  let doneId = $state('');
  let doneEmail = $state('');
  let tickets = $state([]);

  const say = (text) => { msg = text; };

  function newTicketNumber() {
    const letters = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // no 0/O or 1/I mix-ups
    const bytes = crypto.getRandomValues(new Uint8Array(5));
    return 'PFY-' + Array.from(bytes, (b) => letters[b % letters.length]).join('');
  }

  function history() {
    try { return JSON.parse(localStorage.getItem(HISTORY)) || []; } catch { return []; }
  }

  onMount(() => {
    // Fill in what we already know: their email (if they gave it before) and the app (from ?app=…).
    const params = new URLSearchParams(location.search);
    if (savedEmail()) form.elements.email.value = savedEmail();
    if (params.get('app')) {
      const opt = Array.from(form.elements.app.options).find((o) => o.value === params.get('app'));
      if (opt) form.elements.app.value = opt.value;
    }
    tickets = history();
  });

  async function submit(e) {
    e.preventDefault();
    const f = form.elements;
    if (f.company.value) return; // a bot filled the hidden box
    const email = f.email.value.trim();
    if (f.name.value.trim().length < 1) { f.name.focus(); return say('Please type your name.'); }
    if (f.summary.value.trim().length < 5) { f.summary.focus(); return say('Please write a short summary of the problem or question.'); }
    if (!f.app.value) return say('Please choose what your ticket is about.');
    if (!EMAIL_OK.test(email)) { f.email.focus(); return say('Please type your email address so we can reply to you.'); }

    const id = newTicketNumber();
    f.ticket.value = id;
    sending = true;

    let ok = true;
    if (['localhost', '127.0.0.1'].includes(location.hostname)) {
      console.info('[preview] Would send support ticket', id, Object.fromEntries(new FormData(form)));
    } else {
      try {
        const r = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(new FormData(form)).toString() });
        ok = r.ok;
      } catch { ok = false; }
    }
    sending = false;
    if (!ok) return say(`Your ticket couldn’t be sent. Please try again, or email ${SITE.contactEmail}.`);

    saveEmail(email);
    try {
      localStorage.setItem(HISTORY, JSON.stringify([{ id, subject: f.summary.value.trim().slice(0, 80), at: Date.now() }, ...history()].slice(0, 10)));
    } catch { /* storage blocked: the ticket was still sent */ }
    doneId = id;
    doneEmail = email;
    sent = true;
    msg = '';
    tickets = history();
    await tick();
    done.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function another() {
    const email = form.elements.email.value, name = form.elements.name.value;
    form.reset();
    form.elements.email.value = email;
    form.elements.name.value = name;
    sent = false;
    form.elements.summary.focus();
  }
</script>

<Seo title="Contact · Programs For You" description="Something broken or have a question? Send Programs For You a support ticket and we’ll email you back." type="ContactPage" />

<PageHead eyebrow="Contact" title="Get help" lead="Something broken, or have a question? Send us a ticket and we’ll email you back, usually within a day or two." />
<section class="pt-2 pb-18">
  <Container class="grid grid-cols-[1.6fr_1fr] items-start gap-6 max-[860px]:grid-cols-1">
    <div>
      <form class={cardCls} name="support-ticket" method="POST" data-netlify="true" netlify-honeypot="company" bind:this={form} onsubmit={submit} hidden={sent}>
        <input type="hidden" name="form-name" value="support-ticket">
        <input type="hidden" name="ticket" value="">
        <Honeypot />
        <div class={field}><label class={fieldLabel} for="t-name">Name</label>
          <input class={input} id="t-name" name="name" autocomplete="name" required></div>
        <div class={field}><label class={fieldLabel} for="t-summary">Summary</label>
          <textarea class={cn(input, textarea)} id="t-summary" name="summary" rows="5" maxlength="2000" placeholder="What’s wrong, or what’s your question?" required></textarea></div>
        <div class={field}><label class={fieldLabel} for="t-app">What’s it about?</label>
          <select class={cn(input, select)} id="t-app" name="app" required><option value="">Choose one…</option><option>School Schedule</option><option>Email Assistant</option><option>Screen Assistant</option><option>TI-84 Evo games</option><option>The website</option><option>Something else</option></select></div>
        <div class={field}><label class={fieldLabel} for="t-email">Email</label>
          <input class={input} id="t-email" name="email" type="email" autocomplete="email" inputmode="email" placeholder="you@example.com" required>
          <span class={fieldHint}>We’ll reply to this address. We never share it.</span></div>
        <FormMessage text={msg} />
        <Button type="submit" disabled={sending}>{sending ? 'Sending…' : 'Send ticket'}</Button>
      </form>
      <div class={cn(cardCls, 'px-7 py-10 text-center')} bind:this={done} hidden={!sent}>
        <DoneCheck />
        <h2 class="mb-2">Ticket sent!</h2>
        <p>Your ticket number is <b>{doneId}</b>. We’ll email you at <b>{doneEmail}</b>, usually within a day or two. Keep the number in case you write back.</p>
        <Button variant="ghost" onclick={another}>Send another ticket</Button>
      </div>
      <Card class="mt-[18px]" hidden={tickets.length === 0}>
        <h3 class="mb-2.5 text-base">Tickets you sent from this computer</h3>
        <ul class="grid gap-2">
          {#each tickets as t}
            <li class="flex items-baseline gap-3 text-[.92rem]"><b>{t.id}</b><span class="min-w-0 flex-1 truncate text-muted">{t.subject}</span><time class="text-[.82rem] text-faint">{new Date(t.at).toLocaleDateString()}</time></li>
          {/each}
        </ul>
      </Card>
    </div>
    <aside class="grid gap-4">
      <SideCard title="What happens next">
        <ol class="grid list-decimal gap-1.5 pl-5 text-[.93rem] text-muted">
          <li>You get a ticket number right away.</li><li>We read every ticket ourselves.</li><li>We email you back with a fix or an answer.</li>
        </ol>
      </SideCard>
      <SideCard title="Quick fixes">
        <ul class="grid gap-2 text-[.93rem]">
          <li><a href="/install#open-anyway">My Mac won’t open the app</a></li>
          <li><a href="/school-schedule#how-to-use">School Schedule shows the wrong day</a></li>
          <li><a href="/screen-assistant#how-to-use">Screen Assistant can’t see my screen</a></li>
          <li><a href="/ti-84-evo-games#how-to-install">Putting games on my calculator</a></li>
        </ul>
      </SideCard>
      <SideCard title="Other ways to reach us">
        <p class="m-0 text-[.9rem] text-muted">Email <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a><br>or call <a href="tel:+14752661457">(475) 266-1457</a>.</p>
      </SideCard>
    </aside>
  </Container>
</section>
