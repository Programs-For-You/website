<script>
  import StatusBadge from '#lib/components/StatusBadge.svelte';
  import Showcase from '#lib/components/Showcase.svelte';
  /**
   * The top band shared by the Email Assistant, Screen Assistant and TI-84 Evo Games pages.
   * Props: icon (image url), title, statusId (app/game id for the badge), howHref (adds the "How to use it →" link),
   * req (the small requirements line), center (Showcase content centered).
   * Snippets: children = the lead text (inline content), actions = the buttons, visual = the picture on the right.
   */
  let { icon, title, statusId, howHref = '', req, children, actions, visual } = $props();
</script>

<section class="pt-16 pb-10">
  <div class="mx-auto grid w-full max-w-[1100px] grid-cols-2 items-center gap-12 px-5 max-[900px]:grid-cols-1 max-[900px]:gap-9 max-[400px]:px-4">
    <div>
      <img class="size-[84px] flex-none rounded-[21px]" src={icon} alt="" width="84" height="84">
      <h1 class="mt-[18px] text-[clamp(2.2rem,4.6vw,3.1rem)]">{title}</h1>
      <p class="mb-[18px] max-w-[620px] text-[1.15rem] text-muted max-sm:text-[1.05rem]">{@render children?.()}</p>
      <StatusBadge id={statusId} />
      <div class="mt-6 flex flex-wrap items-center gap-3 [&>*]:min-w-[214px] [&>*]:justify-center max-[480px]:[&>*]:w-full">{@render actions?.()}</div>
      {#if howHref}<p class="mt-3.5 mb-0 font-semibold"><a class="text-accent" href={howHref}>How to use it →</a></p>{/if}
      <p class="mt-3.5 mb-0 text-[.86rem] text-faint">{req}</p>
    </div>
    <Showcase center>{@render visual?.()}</Showcase>
  </div>
</section>
