// © 2026 Brady Krupa and Arjun Bhanderi. All rights reserved.
// Sign-in for the website, powered by Firebase Authentication (free plan).
// Every page shares this one file, so the whole site knows who is signed in.
//
// If firebase-config.js still has the PASTE_ placeholders, the site runs in
// "preview mode": sign-in is pretend and only lasts until you close the tab.

import { firebaseConfig } from './firebase-config.js';

const SDK = 'https://www.gstatic.com/firebasejs/10.14.1';
const PREVIEW_KEY = 'asfy-preview-user';

export const PREVIEW = !firebaseConfig?.apiKey || firebaseConfig.apiKey.startsWith('PASTE');

// ---------- Firebase loader (only loads when it's actually set up) ----------
let loading = null;
let ready = null; // Firebase, once it has loaded (lets the Google button open its window instantly)
function firebase() {
  if (!loading) {
    loading = (async () => {
      const [{ initializeApp }, m] = await Promise.all([
        import(/* @vite-ignore */ `${SDK}/firebase-app.js`),
        import(/* @vite-ignore */ `${SDK}/firebase-auth.js`),
      ]);
      const auth = m.getAuth(initializeApp(firebaseConfig));
      auth.useDeviceLanguage();
      ready = { auth, m };
      return ready;
    })();
  }
  return loading;
}

/** Starts loading Firebase early, so sign-in buttons respond right away. */
export function preload() {
  if (!PREVIEW) firebase().catch(() => {});
}

// ---------- One simple "user" shape for the rest of the site ----------
function shape(u) {
  if (!u) return null;
  const email = u.email || '';
  return {
    name: u.displayName || email.split('@')[0] || 'there',
    email,
    verified: Boolean(u.emailVerified),
    photo: u.photoURL || '',
    provider: u.providerData?.[0]?.providerId || u.provider || 'password',
  };
}

// ---------- Listeners ----------
const listeners = new Set();
let current; // undefined = not known yet, null = signed out
let started = false;

function emit(user) {
  current = user;
  listeners.forEach((cb) => {
    try { cb(user); } catch (err) { console.error(err); }
  });
}

function start() {
  if (started) return;
  started = true;
  if (PREVIEW) {
    queueMicrotask(() => emit(shape(previewGet())));
    return;
  }
  firebase()
    .then(({ auth, m }) => m.onAuthStateChanged(auth, (u) => emit(shape(u))))
    .catch((err) => {
      console.error('Firebase did not load:', err);
      emit(null);
    });
}

/** Call cb(user) now and whenever the signed-in person changes. user is null when signed out. */
export function onUser(cb) {
  listeners.add(cb);
  if (current !== undefined) cb(current);
  start();
  return () => listeners.delete(cb);
}

// ---------- Preview mode helpers ----------
function previewGet() {
  try { return JSON.parse(sessionStorage.getItem(PREVIEW_KEY)); } catch { return null; }
}
function previewSet(u) {
  try {
    if (u) sessionStorage.setItem(PREVIEW_KEY, JSON.stringify(u));
    else sessionStorage.removeItem(PREVIEW_KEY);
  } catch { /* storage blocked: preview still works for this page */ }
  emit(shape(u));
}

// ---------- Actions ----------
export async function signInWithGoogle() {
  if (PREVIEW) return previewSet({ displayName: 'Preview Student', email: 'preview@example.com', emailVerified: true, provider: 'google.com' });
  // Browsers only allow a pop-up window that opens straight from a click. Waiting for Firebase to
  // download first can count as "not from a click," so use the copy that's already loaded.
  const { auth, m } = ready || await firebase();
  const provider = new m.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  try {
    await m.signInWithPopup(auth, provider);
  } catch (err) {
    // A full-page Google sign-in only works in today's browsers when Firebase's sign-in helper is on
    // this same web address. Otherwise it silently fails, so explain the pop-up problem instead.
    const blocked = err?.code === 'auth/popup-blocked' || err?.code === 'auth/operation-not-supported-in-this-environment';
    if (blocked && firebaseConfig.authDomain === location.host) return m.signInWithRedirect(auth, provider);
    throw err;
  }
}

/** Shows any error left over from a full-page Google sign-in. */
export async function checkRedirect() {
  if (PREVIEW) return;
  const { auth, m } = await firebase();
  await m.getRedirectResult(auth);
}

async function sendVerify(m, user) {
  try {
    await m.sendEmailVerification(user, { url: `${location.origin}/download.html` });
  } catch {
    await m.sendEmailVerification(user); // works even if the return link isn't allowed
  }
}

export async function createAccount(name, email, password) {
  if (PREVIEW) return previewSet({ displayName: name, email, emailVerified: false, provider: 'password' });
  const { auth, m } = await firebase();
  const { user } = await m.createUserWithEmailAndPassword(auth, email, password);
  // These two are "nice to have" — the account already exists, so don't fail on them.
  try { await m.updateProfile(user, { displayName: name }); } catch (err) { console.warn(err); }
  try { await sendVerify(m, user); } catch (err) { console.warn(err); }
  emit(shape(auth.currentUser));
}

export async function signInEmail(email, password) {
  if (PREVIEW) return previewSet({ displayName: email.split('@')[0], email, emailVerified: true, provider: 'password' });
  const { auth, m } = await firebase();
  await m.signInWithEmailAndPassword(auth, email, password);
}

export async function resetPassword(email) {
  if (PREVIEW) return;
  const { auth, m } = await firebase();
  await m.sendPasswordResetEmail(auth, email);
}

export async function resendVerification() {
  if (PREVIEW) return;
  const { auth, m } = await firebase();
  if (auth.currentUser) await sendVerify(m, auth.currentUser);
}

/** Re-checks the account (e.g. after clicking the email link). Returns the fresh user. */
export async function refreshUser() {
  if (PREVIEW) {
    const u = previewGet();
    if (u) { u.emailVerified = true; previewSet(u); } // pretend the link was clicked
    return shape(u);
  }
  const { auth } = await firebase();
  if (!auth.currentUser) return null;
  await auth.currentUser.reload();
  const fresh = shape(auth.currentUser);
  emit(fresh);
  return fresh;
}

export async function signOutUser() {
  if (PREVIEW) return previewSet(null);
  const { auth, m } = await firebase();
  await m.signOut(auth);
}

export async function deleteAccount() {
  if (PREVIEW) return previewSet(null);
  const { auth, m } = await firebase();
  if (auth.currentUser) await m.deleteUser(auth.currentUser);
}

// ---------- Friendly error messages ----------
const WRONG = 'That email or password doesn’t match. Try again, or reset your password.';
const MESSAGES = {
  'auth/invalid-email': 'That email address doesn’t look right.',
  'auth/missing-email': 'Please type your email.',
  'auth/missing-password': 'Please type your password.',
  'auth/invalid-credential': WRONG,
  'auth/invalid-login-credentials': WRONG,
  'auth/wrong-password': WRONG,
  'auth/user-not-found': WRONG,
  'auth/email-already-in-use': 'There’s already an account with that email. Try signing in instead.',
  'auth/weak-password': 'Pick a stronger password (at least 8 characters).',
  'auth/password-does-not-meet-requirements': 'Pick a stronger password (at least 8 characters).',
  'auth/too-many-requests': 'Too many tries. Wait a few minutes and try again.',
  'auth/popup-closed-by-user': 'The Google window closed before you finished. Try again.',
  'auth/network-request-failed': 'Can’t reach the internet. Check your connection and try again.',
  'auth/user-disabled': 'This account has been turned off.',
  'auth/account-exists-with-different-credential': 'That email already signs in a different way. Try the other sign-in option.',
  'auth/requires-recent-login': 'For safety, please sign out, sign back in, and then try again.',
  'auth/unauthorized-domain': 'This web address isn’t allowed to sign in yet. (Site owner: add it in Firebase → Authentication → Settings → Authorized domains.)',
  'auth/operation-not-allowed': 'This sign-in option isn’t turned on yet. (Site owner: turn it on in Firebase → Authentication → Sign-in method.)',
  'auth/invalid-api-key': 'Sign-in isn’t set up correctly yet. (Site owner: check firebase-config.js.)',
  'auth/api-key-not-valid.-please-pass-a-valid-api-key.': 'Sign-in isn’t set up correctly yet. (Site owner: check firebase-config.js.)',
  'auth/configuration-not-found': 'Sign-in isn’t turned on yet. (Site owner: Firebase → Authentication → Get started.)',
  'auth/popup-blocked': 'Your browser blocked the Google sign-in window. Allow pop-ups for this site (look for a blocked pop-up icon in the address bar), then click Continue with Google again.',
  'auth/operation-not-supported-in-this-environment': 'Google sign-in doesn’t work inside this app’s built-in browser. Open programsforyou.com in Safari or Chrome and try again.',
  'auth/web-storage-unsupported': 'Your browser is blocking the cookies sign-in needs. Turn off private browsing or allow cookies for this site, then try again.',
  'auth/internal-error': 'Google sign-in hit a snag. Wait a moment and try again.',
};

export function friendlyError(err) {
  // Unknown problems show their code, so the site owner can look it up.
  return MESSAGES[err?.code] || `Something went wrong${err?.code ? ` (${err.code})` : ''}. Please try again.`;
}
