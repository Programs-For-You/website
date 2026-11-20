<script>
  import { onMount, tick } from 'svelte';
  import Seo from '#lib/components/Seo.svelte';
  import Container from '#lib/components/Container.svelte';
  import Button from '#lib/components/Button.svelte';
  import FormMessage from '#lib/components/FormMessage.svelte';
  import PageHead from '#lib/components/contact/PageHead.svelte';
  import SideCard from '#lib/components/contact/SideCard.svelte';
  import Honeypot from '#lib/components/contact/Honeypot.svelte';
  import DoneCheck from '#lib/components/contact/DoneCheck.svelte';
  import { SITE } from '#lib/config.js';
  import { savedEmail } from '#lib/emaillist.js';
  import { cn } from '#lib/cn.js';
  import { input, select, field, fieldLabel, fine } from '#lib/ui.js';

  // Job applications ("Join the team"). Each one goes to Netlify Forms ("job-application").
  const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const textarea = 'h-auto min-h-[140px] py-3 leading-normal resize-y';
  const cardCls = 'relative rounded-card-lg border border-border bg-surface p-7';
  const row = 'grid gap-x-3.5 max-[600px]:grid-cols-1';

  let form = $state();
  let done = $state();
  let msg = $state('');
  let sending = $state(false);
  let sent = $state(false);
  let doneEmail = $state('');

  const say = (text) => { msg = text; };

  onMount(() => {
    if (savedEmail()) form.elements.email.value = savedEmail();
    const wanted = new URLSearchParams(location.search).get('department');
    if (wanted) {
      const opt = Array.from(form.elements.department.options).find((o) => o.value === wanted);
      if (opt) form.elements.department.value = opt.value;
    }
  });

  async function submit(e) {
    e.preventDefault();
    const f = form.elements;
    if (f.company.value) return; // a bot filled the hidden box
    if (sending) return; // already sending
    const email = f.email.value.trim();
    if (!f.name.value.trim()) { f.name.focus(); return say('Please type your name.'); }
    if (!EMAIL_OK.test(email)) { f.email.focus(); return say('Please type your email so we can get back to you.'); }
    if (!f.grade.value) { f.grade.focus(); return say('Please choose your grade.'); }
    if (!f.role.value) { f.role.focus(); return say('Please choose the role you want.'); }
    if (!f.department.value) { f.department.focus(); return say('Please choose a department (or “Not sure yet”).'); }
    if (f.why.value.trim().length < 20) { f.why.focus(); return say('Please tell us a little more about why you want to join (a sentence or two).'); }

    sending = true;
    let ok = true;
    if (['localhost', '127.0.0.1'].includes(location.hostname)) {
      console.info('[preview] Would send job application', Object.fromEntries(new FormData(form)));
    } else {
      try {
        const r = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(new FormData(form)).toString() });
        ok = r.ok;
      } catch { ok = false; }
    }
    sending = false;
    if (!ok) return say(`Your application couldn’t be sent. Please try again, or email ${SITE.contactEmail}.`);

    doneEmail = email;
    sent = true;
    msg = '';
    await tick();
    done.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
</script>

<Seo title="Applications · Programs For You" description="Apply to join Programs For You as an intern or employee in Development, Social Media, Advertising, or Hospitality." />

<PageHead eyebrow="Applications" title="Join the team" lead="Want to help build free apps that make people’s days easier? Apply below. Brady and Arjun read every application." />
<section class="pt-2 pb-18">
  <Container class="grid grid-cols-[1.6fr_1fr] items-start gap-6 max-[860px]:grid-cols-1">
    <div>
      <form class={cardCls} name="job-application" method="POST" data-netlify="true" netlify-honeypot="company" bind:this={form} onsubmit={submit} hidden={sent} novalidate>
        <input type="hidden" name="form-name" value="job-application">
        <Honeypot />
        <div class={cn(row, 'grid-cols-2')}>
          <div class={field}><label class={fieldLabel} for="a-name">Name</label>
            <input class={input} id="a-name" name="name" autocomplete="name" required></div>
          <div class={field}><label class={fieldLabel} for="a-email">Email</label>
            <input class={input} id="a-email" name="email" type="email" autocomplete="email" inputmode="email" placeholder="you@example.com" required></div>
        </div>
        <div class={cn(row, 'grid-cols-[repeat(3,minmax(0,1fr))]')}>
          <div class={field}><label class={fieldLabel} for="a-grade">Grade</label>
            <select class={cn(input, select)} id="a-grade" name="grade" required><option value="">Choose…</option><option>9th</option><option>10th</option><option>11th</option><option>12th</option><option>Other</option></select></div>
          <div class={field}><label class={fieldLabel} for="a-role">Role</label>
            <select class={cn(input, select)} id="a-role" name="role" required><option value="">Choose…</option><option>Intern</option><option>Employee</option></select></div>
          <div class={field}><label class={fieldLabel} for="a-dept">Department</label>
            <select class={cn(input, select)} id="a-dept" name="department" required><option value="">Choose…</option><option>Development</option><option>Social Media</option><option>Advertising</option><option>Hospitality</option><option>Not sure yet</option></select></div>
        </div>
        <div class={field}><label class={fieldLabel} for="a-why">Why do you want to join?</label>
          <textarea class={cn(input, textarea)} id="a-why" name="why" rows="5" maxlength="2000" placeholder="A few sentences about you and what you’d like to do." required></textarea></div>
        <div class={field}><label class={fieldLabel} for="a-skills">Skills or experience <span class="text-faint">(optional)</span></label>
          <textarea class={cn(input, textarea)} id="a-skills" name="skills" rows="3" maxlength="1500" placeholder="Coding, design, video, writing, clubs… anything that helps."></textarea></div>
        <FormMessage text={msg} />
        <Button type="submit" disabled={sending}>{sending ? 'Sending…' : 'Send application'}</Button>
        <p class={fine}>We only use this to look at your application, and only Brady and Arjun can see it. <a href="/privacy">Privacy</a></p>
      </form>
      <div class={cn(cardCls, 'px-7 py-10 text-center')} bind:this={done} hidden={!sent}>
        <DoneCheck />
        <h2 class="mb-2">Application sent!</h2>
        <p>Thanks for applying. We’ll email you at <b>{doneEmail}</b> after we read it.</p>
      </div>
    </div>
    <aside class="grid gap-4">
      <SideCard title="Open roles">
        <p class="text-[.9rem] text-muted">Interns and employees in every department:</p>
        <ul class="mt-2.5 grid gap-2.5">
          <li class="grid gap-0.5 text-[.9rem]"><b>Development</b><span class="text-[.85rem] text-muted">Help build and test our apps.</span></li>
          <li class="grid gap-0.5 text-[.9rem]"><b>Social Media</b><span class="text-[.85rem] text-muted">Make posts and videos about our apps.</span></li>
          <li class="grid gap-0.5 text-[.9rem]"><b>Advertising</b><span class="text-[.85rem] text-muted">Spread the word at school and online.</span></li>
          <li class="grid gap-0.5 text-[.9rem]"><b>Hospitality</b><span class="text-[.85rem] text-muted">Help people who use our apps and welcome new team members.</span></li>
        </ul>
      </SideCard>
      <SideCard title="What happens next">
        <ol class="grid list-decimal gap-1.5 pl-5 text-[.93rem] text-muted">
          <li>Send your application.</li><li>Brady and Arjun read every one.</li><li>If it’s a fit, we email you to set up a quick chat.</li>
        </ol>
      </SideCard>
      <SideCard title="Questions?">
        <p class="m-0 text-[.9rem] text-muted">See who’s on the <a href="/team">team</a>, or call <a href="tel:+14752661457">(475) 266-1457</a>.</p>
      </SideCard>
    </aside>
  </Container>
</section>
