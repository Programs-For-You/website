// Makes the key pair the site uses to send push notifications to the admin app. Run once: node scripts/vapid.mjs
// Then put the two values in as secrets (keep the private one private):
//   npx wrangler secret put VAPID_PUBLIC_KEY
//   npx wrangler secret put VAPID_PRIVATE_KEY
// For `vite dev`, put them in .dev.vars instead (that file is never committed).
const b64u = (b) => Buffer.from(b).toString('base64url');
const { publicKey, privateKey } = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign']);
const pub = b64u(await crypto.subtle.exportKey('raw', publicKey));
const priv = (await crypto.subtle.exportKey('jwk', privateKey)).d;
console.log(`VAPID_PUBLIC_KEY=${pub}\nVAPID_PRIVATE_KEY=${priv}`);
