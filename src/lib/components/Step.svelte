<script>
  import { cn } from '#lib/cn.js';
  /** One numbered step. Body goes in as children (paragraphs, lists, a <div class="mt-4"> for a picture). */
  let { n, title, class: cls = '', children, ...rest } = $props();
</script>

<li class={cn('grid grid-cols-[40px_1fr] items-start gap-[18px] max-[480px]:grid-cols-[32px_1fr] max-[480px]:gap-3.5', cls)} {...rest}>
  <span class="grid size-9 place-items-center rounded-full bg-ink text-[.95rem] font-bold text-bg max-[480px]:size-[30px] max-[480px]:text-[.85rem]">{n}</span>
  <div class="min-w-0 [&_li]:text-muted [&_ol]:mb-2.5 [&_ol]:list-decimal [&_ol]:pl-[1.2em] [&_p]:text-muted [&_p:last-child]:mb-0 [&_ul]:mb-2.5 [&_ul]:list-disc [&_ul]:pl-[1.2em]">
    <h3 class="mt-[5px] mb-1.5 max-[480px]:mt-[3px]">{title}</h3>
    {@render children?.()}
  </div>
</li>
