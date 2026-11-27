# Authentication map

One sign-in core serves guests, staff and the super admin. Each role adds its own
rules on top; nothing is copied per role. This page lists every entry point, where
each piece is reused, and the rules that keep it safe.

## The shared core

| Piece | File | What it does |
|---|---|---|
| Better Auth instance | `modules/users-login/src/infrastructure/auth/create-auth.ts` | Builds the sign-in library per request with all methods and limits. |
| Keys and secrets | `apps/api/src/wiring/auth-config.ts` | Reads Google and Apple keys (super admin's saved keys first, then Worker secrets). |
| Apple client secret | `modules/users-login/src/infrastructure/auth/apple-client-secret.ts` | Signs the 30-day Apple JWT from the `.p8` key. |
| Session hooks | `modules/users-login/src/infrastructure/auth/login-guard-hooks.ts` | Runs before and after each request, and before each new session and account. |
| Session start gate | `modules/users-login/src/application/use-cases/check-session-start.ts` | The one check every new session passes, whatever the method. |
| Request gate (every API call) | `modules/users-login/src/domain/request-gate.ts` | Account status, staff-only web, staff web session length, 2-step for the super admin. |
| Request actor | `apps/api/src/wiring/actor-middleware.ts` | Reads the session and runs the request gate before any route. |
| Rate limits | `modules/users-login/src/domain/rate-limit-rules.ts` | The single list of limits for sign-in, code, reset and 2-step paths. |
| Method detection | `modules/users-login/src/domain/method-of-request.ts` | Turns a request path into its sign-in method, for the switches. |
| Web or app | `modules/users-login/src/domain/request-surface.ts` | Decides whether a request comes from the staff web portal or the app. |
| Trusted-device PIN and staff card | `modules/users-login/src/infrastructure/auth/device-sign-in-plugin.ts` | Extra sign-in methods; each ends in a normal session. |

## Entry points by role

**Guests (app only).** Sign up and sign in with email and password, Google, Apple,
phone code, magic link, email code, or a trusted-device PIN. Self sign-up can be
switched off by the super admin. Guests are refused on the web portal everywhere
(request gate, session start and account creation).

**Staff.** The same methods, but the web portal needs a staff account *and* a staff
role given by the super admin. Staff web sessions end after the policy's hours. Google
and Apple never start a web session. Staff accounts are made by the super admin
(`create-staff-account.ts`), and only a verified email can be upgraded to staff.

**Super admin.** Email and password only: Google and Apple are refused for this role
at session start, whatever the switches say. Two-step sign-in must be on before the
super admin can do anything but set it up (request gate, rule 3).

**Owner, first set-up.** One-time exception: while no super admin exists, the owner's
email (`BOOTSTRAP_ADMIN_EMAIL`) may sign up and sign in on the web, to claim the
super admin role.

## Rules that must not change

- Google and Apple ID tokens are verified by Better Auth against the provider's keys:
  signature (JWKS), issuer, audience (our client IDs), algorithm and expiry. The app
  only forwards the token; it is never trusted on its own.
- Linking a Google or Apple account needs a session under 10 minutes old, and the
  provider's email must match the account's, except Apple "Hide My Email" relay
  addresses linked from inside the signed-in account.
- A session of a pending, locked or suspended account is ended on its next request.
  Changing an account's status also deletes its sessions.
- Wrong passwords are counted; after the policy's limit the email is locked for a
  while. A good sign-in clears the count.
- Every sign-in path and code path has a rate limit (see the test in
  `modules/users-login/test/rate-limits-and-revocation.test.ts`).
- Secrets are never logged. The shared logger (`packages/core/src/logging/logger.ts`)
  writes only the fields passed to it, and no auth code passes tokens, codes or
  passwords to it.

## Known, deliberate choices

- The super admin's saved keys (encrypted in the database) override the Worker's
  secrets, so the hotel can change keys in the app without a deploy.
- Staff card sign-in (NFC) is off by default: a card's ID can be copied, so turn it on
  only with the hotel's agreement.
