# Notifications API (module 10)

The API side of the [Notifications Engine](../../docs/modules/10-notifications.md). So far it covers **push notifications** over Firebase Cloud Messaging. SMS, WhatsApp, email, the inbox, quiet hours and digests plug into the same use cases later.

## Routes

Mounted by the API gateway at `/notifications`. The gateway's auth middleware sets the `actor` (user ID, staff or client, permission keys); this module trusts nothing else.

| Route | Who | What |
| --- | --- | --- |
| `POST /devices` | anyone signed in | Saves the phone's FCM token and answers with the broadcast topics to join |
| `DELETE /devices/:token` | the token's owner | Forgets the token at sign-out |
| `POST /push/test` | `notifications.push.test` | Sends a test push to your own phones |
| `POST /push/broadcast` | `notifications.broadcast.send` | Sends to people, roles or a topic |

Other modules never call these routes to send; they publish events, and `dispatchEvent` runs the super admin's rules.

## How sending works

1. `sendPush` gets a target: people, roles or a public topic.
2. Roles are turned into people **on the server**. Role messages never go to a topic, because any phone can join any topic.
3. People are turned into their phones' tokens, and `PushSender` sends one message per token.
4. Tokens FCM reports dead (app removed, signed out, or from an old Firebase project) are deleted.

## Settings

| Name | Kind | What |
| --- | --- | --- |
| `FCM_SERVICE_ACCOUNT` | Cloudflare secret | The whole service-account JSON file. Missing: nothing is sent, and every result says `not_configured`. See [NEEDS-YOU](../../docs/NEEDS-YOU.md). |
| `PUSH_SENDER` | variable | `mock` records pushes instead of sending (local development). |

## Folders

| Folder | What it holds |
| --- | --- |
| `src/domain/` | Device token, push payload, target, result, channels-to-topics rule, notification rule |
| `src/application/` | Ports (repository, sender, audience, rules) and one use case per file |
| `src/infrastructure/db/` | The `notifications` Postgres schema (Drizzle) and its repository |
| `src/infrastructure/fcm/` | FCM HTTP v1: key parsing, Web Crypto JWT sign-in, message body, error mapping, sender |
| `src/infrastructure/memory/` | In-memory and mock versions for tests and local development |
| `src/presentation/` | Hono routes, request validation, the caller's actor and permission keys |
| `migrations/` | SQL written by `pnpm db:generate` from `schema.ts` |
| `test/` | Unit and route tests, the FCM sender against a fake Google, and the migration on PGlite |

## Checks

```bash
pnpm lint   # ESLint (zero warnings) and strict type checks
pnpm test   # every test, no Firebase or network needed
```
