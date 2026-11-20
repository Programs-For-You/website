<script>
  /** Small shared icons for the app pages. name: download | info | lock | fixed | added */
  let { name, class: cls = 'size-5' } = $props();
  const paths = {
    download: '<path d="M12 3v12M7 10l5 5 5-5"/><path d="M5 21h14"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 7.6v.1"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2.5"/><path d="M8 11V7.5a4 4 0 0 1 8 0V11"/>',
    fixed: '<path d="M14.5 5.5a4.2 4.2 0 0 0-5.3 5.3l-5.9 5.9a1.6 1.6 0 0 0 2.3 2.3l5.9-5.9a4.2 4.2 0 0 0 5.3-5.3l-2.6 2.6-2.3-.4-.4-2.3z"/>',
    added: '<path d="M11 3l1.8 4.9L17.7 9.7l-4.9 1.8L11 16.4l-1.8-4.9L4.3 9.7l4.9-1.8z"/><path d="M18.5 14.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>'
  };
</script>

<svg class={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{@html paths[name]}</svg>
