<script>
  let { data } = $props();
  import Seo from '#lib/components/Seo.svelte';
  import PageHead from '#lib/components/PageHead.svelte';
  import Section from '#lib/components/Section.svelte';
  import Card from '#lib/components/Card.svelte';
  import Button from '#lib/components/Button.svelte';

  // Volunteers page: what the volunteer teams do and how to join. No volunteers are listed by name here;
  // only list someone after they've said it's OK to be on the website (see src/lib/team.js).
  const TEAMS = [
    { name: 'Development', body: 'Help build and test our apps.' },
    { name: 'Social Media', body: 'Make posts and videos about our apps.' },
    { name: 'Advertising', body: 'Spread the word at school and online.' },
    { name: 'Hospitality', body: 'Help people who use our apps and welcome new team members.' }
  ];
</script>

<Seo title="Volunteers · Programs For You" description="Programs For You is run by student volunteers. See the volunteer teams and how to join one." type="AboutPage" />

<PageHead center eyebrow="Volunteers" title="Our volunteers" lead="Programs For You is built and run by students who give their time for free. Every team is unpaid and student-run, and every one of them helps keep the apps free." />

<Section tight>
  <div class="mx-auto grid max-w-[1100px] grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-[22px]">
    {#each TEAMS as t}
      <Card class="border border-border" data-reveal>
        <h2 class="mb-2 text-[1.4rem]">{t.name}</h2>
        <p class="m-0 text-muted">{t.body}</p>
      </Card>
    {/each}
  </div>
</Section>

{#if data.volunteers.length}
<Section tight>
  <div class="mx-auto max-w-[1100px]">
    <h2 class="mb-4 text-center">Thank you</h2>
    <ul class="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3 p-0">
      {#each data.volunteers as v}<li class="rounded-card-lg border border-border bg-surface px-5 py-3"><b>{v.name}</b><span class="block text-[.85rem] text-muted">{v.department}</span></li>{/each}
    </ul>
  </div>
</Section>
{/if}

<Section tight center>
  <h2 class="mb-3">Want to help?</h2>
  <p class="mx-auto mb-6 max-w-[560px] text-muted">Send a short application. We read every one. If it’s a fit, we email you (and a parent or guardian, if you’re under 18) to set up a quick chat.</p>
  <Button href="/apply">Apply to volunteer</Button>
  <p class="mt-6 text-[.95rem] text-muted">Looking for our founders and Board? See the <a href="/team">team page</a>.</p>
</Section>
