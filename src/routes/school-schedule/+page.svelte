<script>
  import Seo from '#lib/components/Seo.svelte';
  import Container from '#lib/components/Container.svelte';
  import Lead from '#lib/components/Lead.svelte';

  const points = ['Live countdown at the top of your screen', 'A homework plan for tonight', 'Homework list with reminders'];
</script>

<Seo title="School Schedule · Programs For You" description="Always know what period it is, how many minutes are left, and what homework is due." />

<section class="pt-16 pb-24">
  <Container narrow>
    <img class="size-[84px] rounded-[21px]" src="/assets/img/school-schedule.svg" alt="" width="84" height="84">
    <h1 class="mt-[18px] text-[clamp(2.2rem,4.6vw,3.1rem)]">School Schedule</h1>
    <Lead class="mb-6">Always know what period it is, how many minutes are left, and what homework is due.</Lead>
    <ul class="m-0 grid list-none gap-3 p-0">
      {#each points as p}
        <li class="flex items-center gap-3 text-[1.1rem]"><span class="size-2 flex-none rounded-full bg-accent"></span>{p}</li>
      {/each}
    </ul>
  </Container>
</section>
