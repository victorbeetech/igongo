# Security checklist: results of the code review (28 Nov 2026)

This is the item-by-item ledger for the master pre-deployment checklist ([MASTER-PREDEPLOY-CHECKLIST.md](MASTER-PREDEPLOY-CHECKLIST.md)) for the parts that apply to Igongo. Each line is one of:

- **pass**: checked in the code, with the file or test as evidence.
- **fixed**: a gap was found and fixed in this change, with the file named.
- **open**: not done or not proven yet. It is listed in [NEEDS-YOU.md](NEEDS-YOU.md) when it needs Victor, or here with the owner and fix when it is code work.

Nothing here is a declaration that the app is production-ready. The release gate (section 28) stays open until the full [SECURITY-AUDIT.md](SECURITY-AUDIT.md) run is done and every line below is pass or fixed. The tests named here run in CI (`.github/workflows/api.yml`); this review read the code and did not run the suite locally.

## 1. Security: authentication and sign-in

| Item | Result | Evidence |
|------|--------|----------|
| Password hashing, no plaintext | pass | Better Auth handles hashing; `modules/users-login/src/domain/password-rules.ts` sets the policy. |
| Password length and complexity policy | pass | `modules/users-login/test/password-minimum.test.ts`. |
| Brute-force and rate limit on every sign-in path | pass | `modules/users-login/src/domain/rate-limit-rules.ts` covers each path in `SIGN_IN_PATHS`; `modules/users-login/test/rate-limits-and-revocation.test.ts`. Client IP comes from `cf-connecting-ip` (`create-auth.ts`), which is correct on Cloudflare. |
| Lockout after wrong passwords | pass | `login-guard-hooks.ts` counts failures; `application/use-cases/login-lockout.ts`. |
| Web sign-in is email and password only for staff and super admin | pass | `check-session-start.ts` step 6 refuses Google and Apple on the web; step 7 refuses them for the super admin everywhere. |
| Staff need a super-admin role before web sign-in | pass | `check-session-start.ts` step 3 and `request-gate.ts` rule 1. |
| Guests refused on the web | pass | `request-gate.ts` rule 1; `login-guard-hooks.ts` refuses web sign-up. |
| Session expiry for web staff | pass | `request-gate.ts` rule 2 (`staffWebSessionHours`). |
| Session revocation, sign out others | pass | `users-router.ts` (`/me/sessions`, `sign-out-others`). |
| 2-step required for super admin | pass | `request-gate.ts` rule 3; `check-session-start.ts` step 5. |
| Account enumeration on password reset | open | Not yet tested. Owner: code. Check that the reset reply is the same for known and unknown emails. |
| Suspicious login alerts | pass | `noteSignInDevice` and the new-device alert in `login-guard-hooks.ts`. |
| Surface (web or app) is read from the `Origin` header | open | `domain/request-surface.ts`. A non-browser client can leave out `Origin` and be treated as the app. This is a policy gap, not a bypass of identity: the caller still needs valid credentials. Owner: code. Fix: send a signed or server-only surface marker for the web portal. |

## 1.2 Authorization and access control

| Item | Result | Evidence |
|------|--------|----------|
| Every protected route needs a signed-in caller | pass | `actorOf` throws `sign_in_required` (`packages/core/src/http/guards.ts`). Routes without a `requirePermission` call use helpers that call `actorOf` or `can` (e.g. delivery `dispatcher` and `rider`, notice `visible` and `mayChange`, files `DELETE`). |
| Permission checked on sensitive writes | pass | `requirePermission` and `requireStaffPermission` on the write routes of payroll, payments, menu, CRM, roles, super admin keys. |
| Object-level checks (IDOR) | pass | HR `GET /staff/:id` uses `staffScope`; out of scope returns 404, the same as missing (`hr-router.ts`). Notice board returns 404 for posts the caller may not see. |
| Gate on every signed-in request | pass | `actorMiddleware` runs `requestGate` on each `/api/*` call and signs out a refused web session. |
| Super admin protection | pass | Google and Apple refused for the super admin; `claim-first-super-admin.ts` claims once, only for the owner's verified email. |
| Routes with no guard at all | open | Public read routes are deliberate (menu, outlets, zones, public settings). `food-ordering` `GET /rules`, `attendance` `GET /rules`, `/on-site` and `/board` should be checked one by one for what they return. Owner: code. |

## 1.3 API security

| Item | Result | Evidence |
|------|--------|----------|
| CORS only for the web origins | pass | `apps/api/src/shell/cors.ts`; no wildcard, credentials only for listed origins. |
| Security headers on the API | pass | `secureHeaders()` in `apps/api/src/app.ts`. |
| Error messages do not leak internals | pass | `apps/api/src/shell/error-handler.ts`: bugs return `internal_error` with a request ID. |
| Input validation | pass | Every write route uses `zValidator` with a zod schema. |
| Request size limit | pass (partly) | Upload body limit is set (`files-media/request-schemas.ts`, 30 MB base64). Other JSON bodies have no explicit byte limit. Open: add a Worker-level body limit. |
| Upload type and size checks | pass | `files-media/src/domain/file-rules.ts`; download sends `nosniff` and a `sandbox` CSP (`files-router.ts`). |
| Webhook signature checks | open | Payment and push webhooks are not built yet (payments and Africa's Talking come later). Re-check when added. |
| Unused and development routes | pass | `/health` and `/` only; no test or debug routes found in `apps/api/src`. |

## 1.4 Web vulnerabilities

| Item | Result | Evidence |
|------|--------|----------|
| XSS: unsafe HTML | pass | `dangerouslySetInnerHTML` appears only for the theme script, JSON-LD (JSON.stringify) and fixed SVG illustrations. No user content is injected. |
| `eval` or `new Function` | pass | None in `apps/`, `packages/`, `modules/`. |
| Weak random values | pass | No `Math.random` in API or modules. |
| Clickjacking | pass | `X-Frame-Options: SAMEORIGIN` on the web and API `secureHeaders`. |
| HSTS | **fixed** | `apps/web/cloudflare/_headers`: added `Strict-Transport-Security: max-age=31536000` (no `includeSubDomains`). The API already has HSTS from `secureHeaders`. |
| Permissions-Policy | **fixed** | `apps/web/cloudflare/_headers`: `camera=(), microphone=(), payment=()`. |
| Content Security Policy | open | Not set on the web. A strict CSP can break the Next.js build, so it needs a test pass on the live site first. Owner: code, after a test on the preview. |
| Vulnerable packages | open | `pnpm audit --prod` reports one moderate issue: esbuild `<=0.24.2` (fixed in `>=0.25.0`). The lock already pins esbuild 0.28.2 for the API tooling, so the old copy comes from another package. Owner: code. Find the path with `pnpm why esbuild` and update it. |

## 2. Database

| Item | Result | Evidence |
|------|--------|----------|
| Parameterised queries | pass | Drizzle ORM is used for all queries; no string-built SQL found in the API. |
| Database reached only through the API | open | Owner: Victor, at go-live (Neon connection string kept as a Worker secret, role least-privilege). |
| Audit of changes | pass | `recordChange` writes a hash-chained Audit Trail entry; `audit-router.ts` has no edit or delete route. |
| Backups and restore test | open | Owner: Victor and code. See [BACKUPS.md](BACKUPS.md). |

## 4. Secrets

| Item | Result | Evidence |
|------|--------|----------|
| No secrets in the repo | pass | `git grep` for private key blocks, Google, AWS, Stripe, Resend and Flutterwave key shapes finds only label text and test fixtures. No `.env`, `.p8` or service-account JSON is tracked. |
| Secrets in the console are not shown in full | pass | `modules/super-admin/src/application/use-cases/secrets.ts` returns `isSet` and the last four characters only. |
| Secrets encrypted at rest | pass | `sealer` in the super admin services encrypts saved keys. |
| Demo keys to be replaced before go-live | open | Owner: Victor, before the real hotel go-live. Listed in [NEEDS-YOU.md](NEEDS-YOU.md). |

## 14. Logging

| Item | Result | Evidence |
|------|--------|----------|
| No passwords or tokens in logs | pass | The shared logger writes JSON lines; the only `console` calls are in `packages/core/src/logging/logger.ts`. Error logs carry the error text and stack, not request bodies. |
| Sentry does not send personal data | pass | `apps/api/src/index.ts` does not set `sendDefaultPii`, so it stays off. The error reporter sets the user ID only. |

## 13. File uploads

| Item | Result | Evidence |
|------|--------|----------|
| Type allow-list, size limit, sandboxed download | pass | See 1.3 above. |
| Random storage names | open | Not checked in this pass. Owner: code. |

## 17, 18, 19, 22, 25, 28. Mobile, updates, backups, business logic, compliance, release gate

| Item | Result | Evidence |
|------|--------|----------|
| Business logic: prices recalculated on the server | pass | `food-ordering` `POST /quote` and `priceCart`; the client total is not trusted. |
| Dependency updates in CI | open | Owner: code. Add an audit step to CI. |
| Backups and restore test | open | See section 2. |
| Mobile binaries checked for keys | open | Owner: Victor with the Mac steps in [MAC-STEPS.md](MAC-STEPS.md) before each release. |
| Legal documents (privacy policy, terms) | open | Owner: Victor. Not part of the code review. |
| Release gate | open | Needs the full [SECURITY-AUDIT.md](SECURITY-AUDIT.md) run. |

## Rule for every agent

No agent declares its own work production-ready. Open items go to [NEEDS-YOU.md](NEEDS-YOU.md) where Victor must act, and to this file when they are code work.
