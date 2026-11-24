<script>
  import { onMount } from 'svelte';
  import Button from '#lib/components/Button.svelte';
  import { card } from '#lib/admin.js';
  import { cn } from '#lib/cn.js';

  /** Turns phone/browser notifications on or off for this device. vapidKey = the public push key from the server. */
  let { vapidKey = '' } = $props();

  // 'checking' | 'unsupported' | 'unset' (server has no keys yet) | 'blocked' | 'off' | 'on'
  let state = $state('checking');
  let busy = $state(false);
  let error = $state('');
  let sub = null;

  const keyBytes = (s) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));
  const send = (method, body, q = '') => fetch('/admin/push' + q, { method, headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  const registration = () => navigator.serviceWorker.register('/admin-sw.js', { scope: '/admin' }).then(() => navigator.serviceWorker.ready);

  const installed = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;

  onMount(async () => {
    if (!('serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window)) return (state = 'unsupported');
    if (!vapidKey) return (state = 'unset');
    if (Notification.permission === 'denied') return (state = 'blocked');
    try {
      sub = await (await registration()).pushManager.getSubscription();
      // Already on: tell the server again, in case it lost this device (or the push service changed its address).
      if (sub && Notification.permission === 'granted') await send('POST', sub.toJSON());
      state = sub ? 'on' : 'off';
    } catch { state = 'off'; return; }

    // First open of the installed app: ask for permission right away. iPhones only allow the prompt after a tap,
    // so if it didn't show, ask on the first tap instead. Never asks again once allowed or blocked.
    if (state === 'off' && Notification.permission === 'default' && installed()) {
      await turnOn();
      if (state === 'off' && Notification.permission === 'default') {
        const onTap = () => { removeEventListener('pointerdown', onTap, true); if (state === 'off') turnOn(); };
        addEventListener('pointerdown', onTap, true);
      }
    }
  });

  async function turnOn() {
    busy = true; error = '';
    try {
      if ((await Notification.requestPermission()) !== 'granted') { state = Notification.permission === 'denied' ? 'blocked' : 'off'; return; }
      const reg = await registration();
      sub = (await reg.pushManager.getSubscription()) ?? (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keyBytes(vapidKey) }));
      const res = await send('POST', sub.toJSON(), '?test');
      if (!res.ok) throw new Error((await res.json().catch(() => null))?.message || 'The server said no.');
      state = 'on';
    } catch (e) {
      error = e?.message || 'Couldn’t turn notifications on.';
    } finally { busy = false; }
  }

  async function turnOff() {
    busy = true; error = '';
    try {
      const endpoint = sub?.endpoint;
      await sub?.unsubscribe();
      if (endpoint) await send('DELETE', { endpoint });
      sub = null; state = 'off';
    } catch (e) {
      error = e?.message || 'Couldn’t turn notifications off.';
    } finally { busy = false; }
  }

  const text = $derived({
    unsupported: 'This browser can’t show notifications. On an iPhone, add this page to your Home Screen first, then open it from there.',
    unset: 'Notifications aren’t set up on the server yet (the VAPID keys are missing).',
    blocked: 'Notifications are blocked for this site. Allow them in your phone’s settings for this app, then reload.',
    off: 'Get a notification on this device when someone sends a message or applies.',
    on: 'Notifications are on for this device.'
  }[state] ?? '');
</script>

{#if state !== 'checking' && state !== 'unsupported' && state !== 'unset'}
  <div class={cn(card, 'mb-5 flex flex-wrap items-center justify-between gap-3 !p-4')}>
    <p class="m-0 min-w-0 flex-1 basis-56 text-[.9rem] text-muted">{text}</p>
    {#if state === 'off'}
      <Button size="sm" onclick={turnOn} disabled={busy}>Turn on</Button>
    {:else if state === 'on'}
      <Button size="sm" variant="outline" onclick={turnOff} disabled={busy}>Turn off</Button>
    {/if}
    {#if error}<p class="m-0 basis-full text-[.85rem]" role="alert">{error}</p>{/if}
  </div>
{/if}
