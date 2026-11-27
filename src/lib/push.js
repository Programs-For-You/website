// Web Push for the admin app: tells every phone/browser that turned on notifications in /admin.
// Standard Web Push (RFC 8030 + VAPID RFC 8292 + aes128gcm encryption RFC 8291), done with WebCrypto so it runs in a Worker.
// Needs the VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY secrets (make them with `node scripts/vapid.mjs`). Without them nothing is sent.
import { env } from 'cloudflare:workers';
import { records } from '#lib/pb.js';

const enc = new TextEncoder();
const b64u = (bytes) => btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64u = (s) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));
const concat = (...parts) => {
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let at = 0;
  for (const p of parts) { out.set(p, at); at += p.length; }
  return out;
};

export const pushReady = () => Boolean(env.VAPID_PUBLIC_KEY && env.VAPID_PRIVATE_KEY);

// The Authorization header that proves to the push service that the site sent this.
async function vapidHeader(endpoint) {
  const pub = unb64u(env.VAPID_PUBLIC_KEY);
  const key = await crypto.subtle.importKey('jwk',
    { kty: 'EC', crv: 'P-256', x: b64u(pub.slice(1, 33)), y: b64u(pub.slice(33, 65)), d: env.VAPID_PRIVATE_KEY },
    { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
  const head = b64u(enc.encode(JSON.stringify({ typ: 'JWT', alg: 'ES256' })));
  const body = b64u(enc.encode(JSON.stringify({
    aud: new URL(endpoint).origin,
    exp: Math.floor(Date.now() / 1000) + 12 * 3600,
    sub: env.VAPID_SUBJECT || 'mailto:admin@programsforyou.org'
  })));
  const sig = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, key, enc.encode(`${head}.${body}`));
  return `vapid t=${head}.${body}.${b64u(sig)}, k=${env.VAPID_PUBLIC_KEY}`;
}

const hkdf = async (ikm, salt, info, bytes) =>
  new Uint8Array(await crypto.subtle.deriveBits({ name: 'HKDF', hash: 'SHA-256', salt, info },
    await crypto.subtle.importKey('raw', ikm, 'HKDF', false, ['deriveBits']), bytes * 8));

// Encrypt the payload for one device (RFC 8291, a single aes128gcm record).
export async function encrypt(sub, text) {
  const uaPublic = unb64u(sub.p256dh);
  const authSecret = unb64u(sub.auth);
  const pair = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']);
  const asPublic = new Uint8Array(await crypto.subtle.exportKey('raw', pair.publicKey));
  const uaKey = await crypto.subtle.importKey('raw', uaPublic, { name: 'ECDH', namedCurve: 'P-256' }, false, []);
  const shared = new Uint8Array(await crypto.subtle.deriveBits({ name: 'ECDH', public: uaKey }, pair.privateKey, 256));
  const ikm = await hkdf(shared, authSecret, concat(enc.encode('WebPush: info\0'), uaPublic, asPublic), 32);
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const cek = await hkdf(ikm, salt, enc.encode('Content-Encoding: aes128gcm\0'), 16);
  const nonce = await hkdf(ikm, salt, enc.encode('Content-Encoding: nonce\0'), 12);
  const aes = await crypto.subtle.importKey('raw', cek, 'AES-GCM', false, ['encrypt']);
  const data = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: nonce }, aes, concat(enc.encode(text), new Uint8Array([2]))));
  return concat(salt, new Uint8Array([0, 0, 0x10, 0]), new Uint8Array([asPublic.length]), asPublic, data); // record size 4096
}

/**
 * Sends a notification to every subscribed device: { title, body, url, tag }.
 * Best effort, like notify(): the submission is already saved, so a failure here never breaks the form.
 */
export async function pushAdmins(message) {
  if (!pushReady()) return;
  try {
    const results = await records.list('push_subscriptions', { fields: 'id,endpoint,p256dh,auth' });
    const payload = JSON.stringify(message);
    await Promise.all(results.map(async (sub) => {
      try {
        const res = await fetch(sub.endpoint, {
          method: 'POST',
          headers: {
            authorization: await vapidHeader(sub.endpoint),
            'content-encoding': 'aes128gcm',
            'content-type': 'application/octet-stream',
            ttl: '86400',
            urgency: 'high'
          },
          body: await encrypt(sub, payload)
        });
        // 404/410: the device uninstalled the app or turned notifications off. Forget it.
        if (res.status === 404 || res.status === 410) await records.remove('push_subscriptions', sub.id);
        else if (!res.ok) console.error('push failed', res.status, (await res.text()).slice(0, 200));
      } catch (e) {
        console.error('push failed', e);
      }
    }));
  } catch (e) {
    console.error('push failed', e);
  }
}
