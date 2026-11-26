# Security audit

The written results of the full security audit. It runs twice: right after the access and security phase, and again just before TestFlight (see the [build checklist](BUILD-CHECKLIST.md)). Each check gets a result line here: passed (with the test or proof), not applicable (with the reason), or open (with the fix and who owns it). No secret, key or password is ever written in this file.

Status: **planned, not run yet** (26 Nov 2026).

What the audit covers:

1. The full security audit items and the 12-check pass in the [build checklist](BUILD-CHECKLIST.md).
2. The 20 common shortcuts below.
3. The [master pre-deployment checklist](MASTER-PREDEPLOY-CHECKLIST.md), which is the final gate before any deployment and is run with this audit.

## The 20 common shortcuts (asked by the user, 26 Nov 2026)

From a list of the 20 ways AI-built ("vibe-coded") apps get hacked. Each one gets a check and a result line before launch. The "how we check" column says what Igongo does about it.

| # | Shortcut | How we check it in Igongo | Result |
|---|----------|---------------------------|--------|
| 1 | Secret keys in code | Scan the code, the app and web bundles and the whole git history; keys live only as Cloudflare Worker secrets or in the super admin's encrypted settings. | Open |
| 2 | Database open to the internet | Neon is reached only through the API; least-privilege database user; no public connection string in any client. | Open |
| 3 | Any password works | Real sign-in (Better Auth), hashed passwords, a test that a wrong password is refused. | Open |
| 4 | No limit on tries | Sign-in rate limit and lockout after repeated wrong passwords, with a test. | Open |
| 5 | People can see each other's data | Every record read checks the owner or a staff permission on the server; a test that another person's order returns 403. | Open |
| 6 | Only `/admin` is protected | Every staff and super admin API route checks permissions on the server, not just the page; the web portal refuses guest accounts. | Open |
| 7 | Trusting whatever is sent | Every body and query is validated on the server (zod); prices and totals are always recalculated on the server. | Open |
| 8 | Unsafe file uploads | The safe-upload rules (real content check, size limits, re-encoding, random names, R2 only). | Open |
| 9 | No two-step sign-in | Mandatory 2-step sign-in for the super admin and staff in sensitive roles. | Open |
| 10 | Test accounts or test pages left live | No test users, seed accounts, demo data or development routes in production; checked before each release. | Open |
| 11 | The app tells hackers too much | Production errors show only "Something went wrong, reference …"; details go to private logs (Sentry). | Open |
| 12 | Copied code nobody checked | Every package is reviewed and pinned; unused packages removed; dependency scan in CI. | Open |
| 13 | Old pages still online | Old routes, preview builds and the old website's pages are removed or redirected. | Open |
| 14 | Payments checks skipped | Payments are confirmed with the provider on the server, callbacks verified, amounts rechecked, double pays blocked (idempotency). | Open |
| 15 | AI chatbot risks | Igongo has no AI chatbot. If one is added: no secrets or other people's data in its context, and prompt-injection tests. | Not applicable for now |
| 16 | Data kept in plain text | Passwords hashed; provider keys encrypted at rest; HTTPS everywhere; no personal data in logs. | Open |
| 17 | Anyone can sign up as admin | Nobody is admin by default; guests sign up as guests only; staff roles only by the super admin, recorded in the audit log. | Open |
| 18 | Never updating | Regular dependency updates and security patches; outdated-package check in CI. | Open |
| 19 | No backup | Automatic database snapshots and one tested restore. | Open |
| 20 | No activity log ("what happened?") | The Audit Trail records every change, sign-in and payment; alerts for new devices and failed sign-ins. | Open |
