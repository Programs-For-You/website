<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import Seo from '#lib/components/Seo.svelte';
  import Container from '#lib/components/Container.svelte';
  import FormMessage from '#lib/components/FormMessage.svelte';
  import GoogleButton from '#lib/components/signin/GoogleButton.svelte';
  import { onUser, preload, signInWithGoogle, checkRedirect, friendlyError, PREVIEW } from '#lib/auth.js';
  import { joinList, saveEmail, confirmAge, ageConfirmed } from '#lib/emaillist.js';

  // Optional Google sign-in. Most people just type their email on the Downloads page.
  let age = $state(false);
  let ageHidden = $state(false);
  let busy = $state(false);
  let msg = $state('');

  onMount(() => {
    if (PREVIEW) { goto('/download', { replaceState: true }); return; } // Google sign-in isn't connected yet
    preload(); // so the Google window opens the instant the button is clicked
    if (ageConfirmed()) { age = true; ageHidden = true; }
    checkRedirect().catch((err) => { msg = friendlyError(err); });
    return onUser(async (user) => {
      if (!user || PREVIEW) return;
      saveEmail(user.email);
      await joinList(user.email, 'google');
      goto('/download', { replaceState: true });
    });
  });

  async function google() {
    if (!age) {
      msg = 'Please check the box to confirm you’re 18 or older before signing in.';
      document.getElementById('google-age')?.focus();
      return;
    }
    confirmAge();
    msg = '';
    busy = true;
    try { await signInWithGoogle(); } catch (err) {
      if (err?.code !== 'auth/cancelled-popup-request') msg = friendlyError(err);
    } finally { busy = false; }
  }
</script>

<Seo title="Sign in · Programs For You" description="Sign in with Google to download free Mac apps from Programs For You, or just use your email." noindex />

<section class="pt-14 pb-20 max-[480px]:pt-7 max-[480px]:pb-14">
  <Container>
    <div class="mx-auto w-full max-w-[430px] rounded-card-lg border border-border bg-surface p-8 shadow-soft max-[480px]:px-5 max-[480px]:py-[26px]">
      <div class="mb-[22px] text-center">
        <img class="mx-auto mb-3.5 size-11" src="/assets/img/logo.svg" alt="" width="44" height="44">
        <h1 class="mb-1 text-[1.6rem]">Sign in with Google</h1>
        <p class="m-0 text-[.9rem] text-muted">Or skip it: you can <a href="/download">just type your email</a>.</p>
      </div>
      <FormMessage text={msg} role="alert" />
      <label class="my-1 mb-[18px] flex cursor-pointer items-start justify-center gap-2.5 text-[.86rem] text-muted [&_input]:mt-[3px] [&_input]:size-4 [&_input]:shrink-0 [&_input]:accent-accent" hidden={ageHidden}><input id="google-age" type="checkbox" bind:checked={age}><span>I’m 18 or older.</span></label>
      <GoogleButton onclick={google} disabled={busy} />
      <p class="mt-[18px] text-center text-[.8rem] text-faint">By continuing, you confirm you’re 18 or older and agree to our <a href="/terms">Terms</a> and <a href="/privacy">Privacy Policy</a>. We’ll add your email to our list for news about new apps (unsubscribe anytime).</p>
    </div>
  </Container>
</section>
