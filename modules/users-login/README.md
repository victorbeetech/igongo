# Users, Accounts & Login API (module 4)

The API side of [Users, Accounts & Login](../../docs/modules/04-users-login.md), built on [Better Auth](https://www.better-auth.com) at `/api/auth/*`.

## Sign-in methods

Every method in the spec is built. Each has a super admin switch (whole system, then optionally limited to some roles), stored in `users_login.login_methods` and edited at `/api/login-methods`.

| Method | Route | Default |
| --- | --- | --- |
| Email and password | `/api/auth/sign-in/email`, `/sign-up/email` | On |
| Google | `/api/auth/sign-in/social` `{provider:"google"}` | On |
| Apple | same, `{provider:"apple"}` | Off until the keys are saved in the console |
| Phone code by SMS or WhatsApp | `/api/auth/phone-number/send-otp` with header `x-otp-channel` | Off (provider not chosen) |
| Email link, email code | `/api/auth/sign-in/magic-link`, `/email-otp/*` | Off (email provider not set up) |
| PIN on a trusted device | `/api/auth/pin/set`, `/pin/sign-in` | On |
| Fingerprint or face | on the phone (unlocks the saved session) | On |
| Staff card tap or QR | `/api/auth/card/sign-in/nfc`, `/qr` | Off until Staff Cards (module 16) |

**How the switches are enforced:** a Better Auth `before` hook refuses a switched-off method at once (so no code is sent), and a database hook runs before **every** new session, whatever the path: the account must be active and the method allowed for one of the person's roles. See `src/infrastructure/auth/login-guard-hooks.ts`.

Also: 2FA (TOTP and backup codes), sessions with remote sign-out (one device, all devices, emergency sign-out of everyone), account approve/lock/suspend, sign-in rate limits stored in Postgres, and failed and successful sign-ins in the Audit Trail. Passwords and PINs use PBKDF2 (native on Workers).

## First super admin

No password is ever in the code. The owner's email is the Worker secret `BOOTSTRAP_ADMIN_EMAIL`. While nobody holds the Super Admin role, that person, signed in with a **verified** email (Google), presses **Finish set-up** on the sign-in page (`POST /api/setup/claim`). It works once.
