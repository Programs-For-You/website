# PocketBase (the database)

The site stores everything in PocketBase (replacing Cloudflare D1), running on the Oracle server at **https://pb.programsforyou.com**.
The Worker logs in as a PocketBase superuser; all collections have no public rules, so browsers cannot read the database.

## Collections (`pb_migrations/1700000000_init.js`)
`users` (login accounts, built in: name, role admin1/admin2, disabled, failed, locked_until; `verified` = has chosen a password),
`tokens` (hashed invite/reset links), `tickets` (contact form), `applications` (join form), `people`, `volunteers`, `push_subscriptions`, `downloads`.

## Server layout (Ubuntu, Dokploy + Traefik already on 80/443)
- Docker swarm service `pfy-pocketbase` (image `pfy-pocketbase:latest`, built from `~/pocketbase/Dockerfile`) on `dokploy-network`, with Traefik labels for `pb.programsforyou.com` and Let's Encrypt.
- Data: docker volume `pfy_pb_data`. Migrations: `~/pocketbase/pb_migrations` mounted at `/pb_migrations` (copy new files there, then `sudo docker service update --force pfy-pocketbase`).
- Dashboard: https://pb.programsforyou.com/_/ (log in with the superuser).
- **Back up the volume**: `sudo docker run --rm -v pfy_pb_data:/d -v $PWD:/b alpine tar czf /b/pb-backup.tgz -C /d .` (or use PocketBase Settings → Backups, S3 optional).

## Secrets the Worker needs
`PB_URL`, `PB_EMAIL`, `PB_PASSWORD`, `RESEND_API_KEY`, `ADMIN_PASSWORD` (+ optional `NOTIFY_TO`, VAPID keys). Set with `npx wrangler secret put NAME`; for local dev they go in `.dev.vars`.

## Move the old data
`npm run pb:import` (see `import-d1.mjs`). Accounts are not copied; log in with `ADMIN_PASSWORD` to recreate Admin 1, then invite the others.
