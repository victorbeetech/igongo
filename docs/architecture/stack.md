# Tech stack

This is the stack, reviewed against the requirements: one app for every role, a super admin who configures everything without code, 83 independent modules, permanent searchable records, strong offline attendance, NFC and QR cards, and reusable wristbands.

[Back to README](../../README.md)

## What changed in the review and why

| Change | Why |
| --- | --- |
| **One Flutter app** instead of a guest app and a staff app | Everyone uses one entry point, and the interface is built from the person's roles. |
| **Server-driven UI**: the app downloads each role's menus, tiles and screen layout as JSON | A new role, such as Chef, works the moment the super admin saves it, with no app store update. |
| **A permission engine in the database**, cached in Workers KV | Roles and permissions are data, so they can't be hard-coded. Every API call and screen is checked against them. |
| **One code folder and one Postgres schema per module**, with an API gateway in front | Keeps the 83 modules truly independent. A broken module can be switched off without touching the others. |
| **Cloudflare Queues as the event bus**, with an outbox table in each module | Modules talk by events (such as `order.placed`), never by reading each other's tables. If one is down, its events wait in the queue. |
| **Cloudflare Workflows and Cron Triggers** | For long processes such as approval escalation, pre-order timers, payroll runs, reminders and scheduled reports. |
| **Offline-first app storage with Drift (SQLite)** | Gate clock-in, wristband scans, meal claims and inspections must work with no network and sync later. |
| **An append-only audit log with a hash chain**, archived to R2 with Bucket Locks | Records must be permanent and tamper-proof, and searchable years back. |
| **Postgres full-text search and `pg_trgm`** on Neon | One search box over every module ("who did X two years ago") without another paid service. |
| **NTAG 424 DNA chips for staff cards**, NTAG 215/216 for wristbands | 424 DNA cards produce a new signed code on every tap, so a card can't be copied. Wristbands only need a cheap, rewritable chip, as they are reset and reused. |
| **PDF generation with Cloudflare Browser Rendering** | Receipts, invoices, payslips, earnings statements and reports, all from editable HTML templates. |
| **Sentry** for crash and error tracking in the app, web and API | You asked that no warning or error be ignored. Sentry shows every one, with the screen and the user's role. |
| **OpenAPI generated from the API**, with the Dart and TypeScript clients generated from it | The app, web and API can't drift apart across 83 modules. |
| **Remote wording and translations**, stored in the database | The super admin can change any word or add Runyankore without an app update. |
| **SEO built into the public website**: server-rendered pages, structured data, sitemaps and analytics | Victor Bee runs the hotel's marketing, so search, tracking and listings are part of the build, not an add-on. |
| **Design tokens** shared by the app and the web | One theme, one logo and one set of text sizes used everywhere, so the brand stays the same across every screen. |

## Full stack

### The Igongo app (Android and iOS)

| Need | Choice |
| --- | --- |
| Framework | Flutter (Dart), Material 3, with the Igongo theme from design tokens |
| State and data | Riverpod |
| Navigation | go_router, with routes built from the server-driven layout |
| Offline storage | Drift (SQLite), plus a sync queue |
| Secure storage | flutter_secure_storage for tokens and PINs |
| NFC | nfc_manager (NTAG 424 DNA for staff cards, NTAG 215/216 for wristbands) |
| QR scanning | mobile_scanner |
| Biometrics | local_auth (fingerprint or face to open payslips) |
| Push | Firebase Cloud Messaging |
| Maps and rider tracking | google_maps_flutter |
| Charts | fl_chart |
| Receipt printers | Bluetooth ESC/POS printing |
| Errors | Sentry |
| Tests | flutter_test, integration_test and golden tests for screens |

### Web portal and public website

| Need | Choice |
| --- | --- |
| Framework | Next.js, TypeScript and Tailwind CSS, deployed to Cloudflare with the OpenNext adapter |
| Components | shadcn/ui, styled with the same design tokens as the app |
| Charts | Apache ECharts |
| Builders (forms, workflows, layouts) | React Flow and dnd-kit for drag and drop |
| Tests | Vitest and Playwright |

### API and back end

| Need | Choice |
| --- | --- |
| API | Hono on Cloudflare Workers: a gateway plus one router per module |
| Validation and API docs | Zod with `@hono/zod-openapi` |
| Database | Neon Postgres through Cloudflare Hyperdrive, Drizzle ORM, one schema per module |
| Event bus | Cloudflare Queues, with an outbox table in each module |
| Long processes and schedules | Cloudflare Workflows and Cron Triggers |
| Realtime | Durable Objects (live attendance board, kitchen display, rider tracking, chat) |
| Config and permission cache | Workers KV |
| Files | Cloudflare R2, with Cloudflare Images for resizing |
| Audit archive | R2 with Bucket Locks |
| Search | Postgres full-text and `pg_trgm` |
| PDFs | Cloudflare Browser Rendering |
| Auth | Better Auth (phone OTP, password, PIN, card tap, Google and Apple sign-in, 2FA) |
| Errors and logs | Sentry and Cloudflare Workers Logs |

### Outside services

| Need | Choice |
| --- | --- |
| SMS | Africa's Talking |
| WhatsApp | Meta WhatsApp Business Cloud API |
| Email | Resend |
| Mobile money and cards | MTN MoMo, Airtel Money and Flutterwave |
| Maps | Google Maps Platform |
| Tax invoices, if needed | URA EFRIS |
| Search engines | Google Search Console and Bing Webmaster Tools |
| Analytics and ads tracking | Google Analytics 4, Google Tag Manager, Meta Pixel, TikTok Pixel and Google Ads conversions, behind a consent banner |
| Local listings | Google Business Profile, Apple Business Connect, Bing Places and TripAdvisor |
| Existing hotel system | APEX, through whatever link the vendor offers (API, database or file exchange) |

### Tooling

| Need | Choice |
| --- | --- |
| Monorepo | pnpm workspaces and Turborepo (TypeScript), Melos (Dart) |
| CI | GitHub Actions: lint, type check, tests and build on every pull request, with warnings treated as errors |
| Environments | Development, staging and production, each with its own database branch on Neon |

No keys, passwords or prices are kept in this repository. Secrets live in Cloudflare and GitHub secrets.
