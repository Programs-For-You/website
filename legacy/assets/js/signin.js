// © 2026 Brady Krupa and Arjun Bhanderi. All rights reserved.
// Optional Google sign-in. Most people just type their email on the Downloads page.

import { onUser, preload, signInWithGoogle, checkRedirect, friendlyError, PREVIEW } from './auth.js';
import { joinList, saveEmail, confirmAge, skipAgeIfConfirmed } from './emaillist.js';

if (PREVIEW) location.replace('/download.html'); // Google sign-in isn't connected yet
preload(); // so the Google window opens the instant the button is clicked

const $ = (sel) => document.querySelector(sel);
const msg = $('[data-msg]');
skipAgeIfConfirmed($('[data-google-age]'));
const say = (text) => { msg.textContent = text; msg.className = 'form-msg show error'; };

$('[data-google]').addEventListener('click', async (e) => {
  const b = e.currentTarget;
  const age = $('[data-google-age]');
  if (!age.checked) {
    say('Please check the box to confirm you’re 18 or older before signing in.');
    age.focus();
    return;
  }
  confirmAge();
  msg.className = 'form-msg';
  b.disabled = true;
  try { await signInWithGoogle(); } catch (err) {
    if (err?.code !== 'auth/cancelled-popup-request') say(friendlyError(err));
  } finally { b.disabled = false; }
});
checkRedirect().catch((err) => say(friendlyError(err)));

onUser(async (user) => {
  if (!user || PREVIEW) return;
  saveEmail(user.email);
  await joinList(user.email, 'google');
  location.replace('/download.html');
});
