# Igongo API Worker

Live at **https://igongo-api.victorbee.com** (`GET /health`). Hono on Cloudflare Workers, Neon Postgres through Hyperdrive (`igongo-db`, query cache off), Drizzle, Better Auth and Sentry (`igongo-api`).

## What is here

- `src/shell/`: the app shell: environment and config, request IDs, CORS, error replies, Sentry, the database per request (one transaction per changing request, rolled back on any error reply) and `/health`.
- `src/wiring/`: the composition root (`request-services.ts`) and the gateway (`routes.ts`) that mounts each module's router. Modules never build each other.
- `src/migrations/`: every module's SQL migrations bundled (`pnpm gen:migrations`) and the migrator, which records what it applied in `public.igongo_migrations`.

## Settings

| Name | Kind | What |
| --- | --- | --- |
| `HYPERDRIVE` | binding | Neon through Hyperdrive |
| `API_BASE_URL`, `WEB_ORIGINS`, `GOOGLE_CLIENT_ID`, `ENVIRONMENT` | variables (`wrangler.jsonc`) | Public settings |
| `BETTER_AUTH_SECRET`, `SETTINGS_ENCRYPTION_KEY` | secrets | Random values made inside Cloudflare; nobody has seen them |
| `GOOGLE_CLIENT_SECRET`, `BOOTSTRAP_ADMIN_EMAIL`, `SENTRY_DSN` | secrets | Sign-in and error reports |
| `APNS_PRIVATE_KEY` (secret), `APNS_KEY_ID`, `APPLE_TEAM_ID` | Apple push key, for iPhone pushes | |

## Deploy

From a computer with `npx wrangler login`: `pnpm --filter @igongo/api run deploy` (plain `deploy` is a pnpm command, so `run` is needed). New migrations: add a temporary `* * * * *` cron (Workers > igongo-api > Settings > Triggers) and remove it once `public.igongo_migrations` shows them; the scheduled handler applies them. Cloud sessions use the [deploy bridge](../../tools/cf-deploy-bridge/README.md).

## Tests

`pnpm test` runs the whole API on PGlite (a real Postgres in memory) with every migration: health, errors, CORS, and the super admin's first day from sign-up to a verified audit chain.
