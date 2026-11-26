# Build checklist, from start to end

> Every change follows the binding [Quality rules](QUALITY-RULES.md).

This is the order the project must follow. Each phase ends with an approval before the next one starts. Tick a box only when the item is done **and** checked.

Every phase follows the [code standards](architecture/code-standards.md): clean architecture, a folder for each module, reusable and separated shared code, minimal code, comments on every process, and zero warnings.

## Phase 0: Scope and plan

- [x] Agree the deliverables: one Igongo app for everyone, the web portal and the public website.
- [x] Write the [modules spec](modules/README.md): 84 independent modules.
- [x] Write the [roles spec](roles/README.md): 121 pre-made roles (including small roles and partner roles), all editable by the super admin, who also creates new roles and gives one person several roles.
- [x] Review the [tech stack](architecture/stack.md) against the requirements.
- [x] Write the [code standards](architecture/code-standards.md).
- [x] Choose state management: Riverpod in the app, TanStack Query and Zustand on the web (see the [stack](architecture/stack.md)).
- [x] Decide what is built first: super admin on the web, then the staff app, then guests and riders (approved 25 Nov 2026). Order below.
- [ ] Agree the build order of modules (which are in the first release and which follow), and the timeline that matches it.

### Build order (approved 25 Nov 2026)

Both the app and the web portal use the same API, so the back end for each module is built once. The order is by who uses it:

1. **Foundation and super admin (web portal first).** Login, roles and permissions, app layout, audit trail and the super admin console. The super admin sets up roles, menus and settings on the web, and the app builds its screens from them, so this must exist before anything else.
2. **Staff (the app).** Staff cards with NFC and QR, gate and reception clock-in, attendance, daily reports, staff meals and notice board. These are the SOW's first items and the hotel sees value on day one.
3. **Guests and riders (the same app, client view).** Guest sign-up, food ordering, pre-orders with arrival time, delivery and the rider screens, room and venue bookings, and payments.
4. **Managers and money (web and app).** Payroll, advances, bonuses, lifetime earnings, HR records, CRM, reports and dashboards for managers, the GM and the board.
5. **Everything else**, module by module in the agreed order: events and wristbands, stock, museum, pool, spa, shop, maintenance, inspections, chat and the rest.

The UI comes first and covers everyone: the sketches and branded designs for every screen of every person (super admin, staff, managers, riders and guests) are finished and approved in Phases 3 and 4 before any coding. Only then is the code built step by step in this order, each step tested and approved before the next one starts. The public website and SEO run alongside from step 3.
- [ ] Confirm open questions with the hotel: Humura (spa), staff headcount, APEX vendor contact and link type, card and wristband quantities, card printer model.

## Phase 1: Theme

- [x] Propose the theme in Igongo's reddish brand: colours, fonts, text sizes, light and dark mode. See [theme](design/theme.md).
- [x] Match the colours exactly to the official logo file, and match the fonts to the logo (Cinzel and Lato).
- [x] Put every value in one [design tokens file](../packages/design-tokens/tokens.json).
- [ ] Approve the palette.
- [ ] Approve the fonts (Cinzel for brand moments, Lato for everything else).
- [ ] Approve the text sizes: small by default, sized for their part of the screen, and a text size setting from Compact to Extra large.
- [ ] Lock the tokens as version 1.0.

## Phase 2: Logo and brand assets

All assets are in the [brand kit](../packages/brand/README.md).

- [x] Get the logo files from the hotel.
- [x] Trace a clean master vector of the mark, with the spiral, horns and cup as separate parts.
- [x] Logos: stacked, horizontal, mark, spiral, wordmark and name, in colour, reversed, black, white and red, as SVG and PNG in four sizes.
- [x] Launcher icons: Android legacy, round and adaptive (with themed monochrome), and the iOS icon set (light, dark and tinted).
- [x] Notification icon.
- [x] Splash screens, light and dark, for Android 12+, older Android and iOS.
- [x] Animations: splash intro, stacked and horizontal logo intros (letter by letter), spiral spinner, mark loader and pulse, as Lottie, animated SVG, GIF and MP4.
- [x] Favicon set, Apple touch icon, web manifest icons and the social sharing image.
- [x] Play Store icon and feature graphic.
- [x] First staff card template (front and back, NFC and QR).
- [x] Card template library: 10 portrait and landscape designs (staff, guest-facing, operations, cultural, executive, visitor, kitchen, contractor and casual), front and back, with live fields and print-ready CR80 PDFs, for the super admin to assign by role.
- [x] Card types as data: NTAG213 (current) and NTAG 424 DNA (ready for the next order).
- [x] Wristband designs (guest, VIP, crew) with number, event and QR.
- [x] Business card, name badge, email signature and watermark.
- [x] Social media kit: profile pictures, covers for every network, post and story templates.
- [x] Receipt headers (58 mm and 80 mm), A4 letterhead and email header.
- [x] QR sticker template for tables, assets, rooms, exhibits and patrol points.
- [x] Spiral pattern for backgrounds.
- [ ] Get the original vector logo from the hotel or its designer, if one exists, and compare it with the traced master.
- [x] Empty state, error, offline, success, no access and not found illustrations, in the theme colour with the red spiral (`packages/brand/illustrations`), used by the app and web state screens.
- [x] App Store (6.9 inch) and Play Store screenshots, made from the real screens by `apps/igongo/test/store` into `packages/brand/store/screenshots`. Replace with final ones after the designs are approved.
- [ ] Approve all assets.
- [x] Check uniformity: the same logo, colours and type everywhere (`tools/brand-check/check_uniformity.py` finds no hard-coded colour, size, font or logo). See [brand assets](design/brand-assets.md).

## Phase 3: UI sketches (wireframes)

- [x] Build the [screen inventory](ui/screens/README.md): every screen and dialog of every module, for every person (super admin, staff, managers, riders and guests), including the client view, however minor. Number every screen. Includes a home screen for every role, with each tile linked to its screen ([role homes](ui/screens/role-homes.md)).
- [x] Give every screen its route (its address in the app and on the web).
- [x] Map the [flows](ui/flows.md) from start to end: first open, login, home for each role, each task, and back. Every screen lists which screens open it and which screens it opens.
- [x] Check there are no orphans: every screen and dialog can be reached from a home screen, and every one has a way back.
- [x] Sketch every screen in low detail. Done as the [clickable wireframes](ui/wireframes/index.html), drawn from `screens.json`.
- [x] Sketch every state of every screen: loading, empty, error, offline, permission denied and success.
- [x] Sketch every dialog, bottom sheet, toast, confirmation, warning and pop-up.
- [x] Sketch the super admin builders: role builder, layout editor, form builder and workflow builder.
- [ ] Review the sketches module by module.
- [ ] Approve all sketches.

## Phase 4: Branded designs

The branded designs are built straight in code (approved 25 Nov 2026): the Flutter app in `apps/igongo` and the web portal in `apps/web`, drawn from the approved wireframes by `tools/ui-gen`. This also does most of Phase 6.

- [x] Code the design system: colours, type, buttons, fields, cards, lists, chips, dialogs, sheets, toasts, loaders, banners and icons, from the tokens only.
- [x] A design system showcase screen for review: `/design-system` on the app (from the preview panel) and the web, with every token and component in light and dark.
- [x] Turn every approved sketch into a branded screen with the theme and logo: 637 screens and 175 dialogs, on the app and the web.
- [x] Check every screen in light and dark mode, and at Extra large and Compact text (automated test in `apps/igongo/test`).
- [x] Check contrast and tap target sizes on every screen with a tool: every token pair in both modes (`tools/contrast-check`, [report](design/contrast-report.md)), tap targets and labels on every app screen (`apps/igongo/test/accessibility`), and axe (WCAG 2.2 AA) on every web page in light and dark (`apps/web/e2e/a11y.spec.ts`).
- [x] Clickable prototype of every flow, with a preview panel for role, state, theme and text size.
- [ ] Approve all designs.

## Phase 5: Foundation code

- [ ] Monorepo set up: pnpm and Turborepo, Melos, and the folder layout in the README.
- [ ] Strict lint and type check settings, with warnings as errors, and automatic formatting.
- [x] CI for the API back end on every pull request (`.github/workflows/api.yml`): lint, type check, tests, bundled migrations up to date.
- [ ] CI for the app and the web.
- [ ] Shared packages: core, contracts, design tokens, brand and UI components.
- [x] Database: Neon project `igongo` (Frankfurt), reached through Hyperdrive `igongo-db`; one Postgres schema per module (`audit`, `roles`, `users_login`, `super_admin`, `notifications`); Drizzle migrations bundled into the API and applied by its migrator (`public.igongo_migrations`).
- [ ] Staging and development database branches on Neon.
- [x] Error tracking with Sentry in the API (`igongo-api`, every unexpected error with its request ID).
- [ ] Sentry in the app and the web.

## Phase 6: Code the UI and connect every screen

The whole app and web portal are built as a clickable product first, with sample data and no real functions. Every screen is coded and every route is connected, from the first screen to the last, for every person, before any functionality is built in Phase 7.

- [x] Code the reusable UI components once, with comments, with a test per component (`apps/igongo/test/shared/ui`).
- [x] Code every approved screen, module by module, each in its own folder (generated by `tools/ui-gen`, with hand-made screens where needed).
- [x] Connect every screen from start to end, with navigation built from roles.
- [x] Handle every state: loading, empty, error, offline, permission denied and success.
- [x] Code every dialog, toast, warning, confirmation and pop-up.
- [x] Client view switch on every staff role.
- [x] Sidebar on every web page: open by default, folds to icons with its own button, and searches every module, page and pop-up the role can reach (Ctrl K). The app's side menu searches too.
- [x] Payment gateways and every outside service ready for keys only: Integrations > Connection settings (MTN MoMo, Airtel Money, Flutterwave, Africa's Talking, WhatsApp, Firebase, Google and Apple sign-in, Google Maps, Sentry) and Payments > Payment methods, with switches per outlet. The super admin pastes the keys; no code changes.
- [x] A hostable clickable preview of the web portal (`pnpm build:preview`), for review links.
- [x] Text size setting and the phone's text size respected on every screen.
- [x] Zero warnings in `flutter analyze`, ESLint and the type checks.
- [x] A test that opens every screen in light, dark, Extra large and Compact text, and golden (screenshot) tests of the key screens, states and showcase in light and dark, on the app (`test/golden`) and the web (`e2e/visual.spec.ts`).
- [ ] Replace sample screens with richer hand-made designs where a review asks for it, module by module.

## Phase 7: Build the modules

- [x] Core modules first (25 Nov 2026), each its own folder, schema, routes and tests, live at igongo-api.victorbee.com:
  - [x] Users & Login (`modules/users-login`): Better Auth; email and password, Google, Apple (on once its keys are saved), phone codes by SMS or WhatsApp, email link and code, PIN, biometric, card tap and QR, each with a super admin switch per system and per role; 2FA; sessions and remote sign-out; account approve, lock and suspend; one-time first super admin set-up.
  - [x] Roles & Permissions (`modules/roles-permissions`): runtime roles, `module.feature.action` permissions with data scope, several and temporary roles per person, included roles, the 121 pre-made roles seeded from docs, `GET /api/access/me` for menus, the "who can do X" report.
  - [x] Audit Trail (`modules/audit-trail`): append-only, hash-chained, searchable, tamper check.
  - [x] Super Admin Console (`modules/super-admin`): module switches and maintenance, hotel, branding and regional settings, encrypted integration and gateway keys.
  - [x] App Layout & Navigation (module 3, `modules/app-builder`, 26 Nov 2026): menus, hidden modules, tabs and home tiles per role from `/api/layout/me`, with history and roll back, on the web and in the app.
  - [x] Web portal connected for these: sign-in, first set-up, active sessions, accounts, create account, login methods, roles list, role builder, permissions matrix, role holders, permission report, audit search, modules list and settings.
  - [x] Connect the app's sign-in to the API (email and password; the session is kept in the phone's secure storage). The console keys screen (S14-02) is still to do.
- [x] Staff modules (25 Nov 2026), each its own folder, schema, routes, permissions, audit and tests:
  - [x] HR Records (`modules/hr-records`): staff records with IGG numbers, enrolment, my profile.
  - [x] Staff Cards (`modules/staff-cards`): issue, encode, reset, lost; QR `IGG-CARD:` and NFC chip ID; card lookup for every station.
  - [x] Wristbands (`modules/wristbands`): register, assign and reset by number range (up to 5,000), gate scan with a verdict.
  - [x] Attendance (`modules/attendance`): clock in and out from the phone or a station (gate, reception, security), late rules, board, on-site list, corrections.
  - [x] Daily Reports (`modules/daily-reports`): template, my report, sign-off, return, comments, who has not reported.
  - [x] Staff Meals (`modules/staff-meals`): meal windows, serve by card tap, one claim per meal per day.
  - [x] Notice Board (`modules/notice-board`): posts by audience, likes, comments and who read it, each switchable by the super admin.
  - [x] Web staff portal pages on the real API for all seven (stations work with USB card readers).
  - [x] App screens on the real API: clock-in and station mode, my attendance, my card, notice board and post, my daily report, meal today, my profile. NFC is behind an interface with a mock off phones.
  - [ ] Real-phone NFC test (see [NEEDS-YOU](NEEDS-YOU.md)).
- [x] Guest and rider modules (26 Nov 2026), each its own folder, schema, routes, permissions, audit and tests (staff tools need a scope wider than `own`, so guests never reach them):
  - [x] Guest CRM (`modules/crm-guests`): my profile and message consent, staff guest search, tags and notes.
  - [x] Menus (`modules/menu-catalogue`): outlets, items with options and allergens, out of stock for the day.
  - [x] Food Ordering (`modules/food-ordering`): delivery, room service, dine-in, takeaway and pre-order with an arrival time; paid before, by deposit or later per type; kitchen board; ticket numbers.
  - [x] Delivery & Riders (`modules/delivery-riders`): zones and fees, automatic or dispatcher assignment, accept, pick up, deliver with the guest's 4-digit code, cash limits and hand-in.
  - [x] Payments (`modules/payments`): MTN MoMo, Airtel Money and Flutterwave adapters that read the keys the super admin saves, callbacks re-checked with the provider, cash, room charge and manual payments, method switches per outlet and module. Only the keys are missing (see [NEEDS-YOU](NEEDS-YOU.md)).
  - [x] Bookings, on one shared engine (`packages/bookings-kit`): rooms (nights), museum, events (slots and enquiries), pool (slots) and crafts and bookshop (stock). Clash and stock checks, deposits, approve, cancel, check-in by code or QR.
  - [x] Web portal pages on the real API for all of them, and app screens: book, my bookings, order food, my orders with tracking, the pay sheet, rider home and my account.
  - [ ] Tried, not finished: drawing delivery zones on a map, the rider's live location from the phone, and opening the card checkout page inside the app (the link is shown to copy). Provider refunds and the settlement report were finished in the managers phase.
- [x] Managers and money modules (26 Nov 2026), each its own folder, schema, routes, permissions, audit and tests:
  - [x] Files & Media (`modules/files-media`): photo and file upload with size and type rules; only the uploader, holders of the module's photo permission and file managers can open a file.
  - [x] Faults & Maintenance (`modules/faults-maintenance`): report with photos, categories that route to a department, assign, start, hold, fix, close, reopen, history, likes and comments (each switchable).
  - [x] Inspections (`modules/inspections`): HOD daily and weekly checklists, run with OK, fault or N/A, photos on faults, a fault report opened by itself, score, likes and comments.
  - [x] Payroll (`modules/payroll`): pay profiles, monthly pay runs, deductions as percent, fixed or tax bands (entered by the super admin, none built in), manual adjustments, maker and approver, mark paid, spreadsheet export.
  - [x] Advances & Loans (`modules/advances-loans`): request, approve, pay out, repay by payroll instalments or cash, limits per kind.
  - [x] Bonuses & Rewards (`modules/bonuses-rewards`): cash bonuses paid with payroll, buffet passes with expiry and one pass a day, the buffet station by card tap.
  - [x] Earnings Statements (`modules/earnings-statements`): payslips and the lifetime statement (by year, bonuses, passes, advances), with a spreadsheet.
  - [x] Reports & Analytics (`modules/reports-analytics`): the management dashboard from every module's numbers, failure-isolated, by role, with tile settings and a spreadsheet.
  - [x] Chat (`modules/chat`): one-to-one, groups and guest desks (front desk and others), unread counts, switches per kind.
  - [x] Records Archive & Search (`modules/records-search`): search the permanent record years back by words, module and dates, with a spreadsheet.
  - [x] Payments: refunds through Flutterwave's refund API, and the settlement report by day, method, module and outlet.
  - [x] Web portal pages on the real API for all of them, and app screens: report a fault with photos, my faults, checkups due and run, my payslips, lifetime earnings, my advances and request, my rewards, chat and the dashboard.
  - [ ] Tried, not finished: live chat push (chat checks every few seconds until the realtime service), MTN MoMo and Airtel Money refunds (still paid back by hand; their refund APIs need the hotel's accounts), targets and alerts, and photo uploads on the live site until file storage is switched on (see [NEEDS-YOU](NEEDS-YOU.md)). Saved and scheduled reports were finished in the final phase.
- [x] Final phase (26 Nov 2026): the rest of the modules on real data, each its own folder, schema, routes, permissions, audit and tests:
  - [x] 40 operations, HR, guest service and money desk modules (lost and found, leave, tasks, housekeeping, laundry, visitors, keys, shifts, training and the rest) on one shared records engine (`packages/records-kit`): record types, fields and statuses the super admin sets per module, `PREFIX-0001` numbers and QR codes.
  - [x] Stock & Inventory (`modules/stock-inventory`): stores, items with unit conversions, receive, issue, transfer, adjust, waste and counts on a ledger, average cost, who reaches which store, and a desk for requisitions, purchasing, suppliers and recipes. Categories, units and rules are all super admin settings.
  - [x] Spa, venues and equipment, and tables and dine-in on the shared bookings engine.
  - [x] Staff card designer (module 16): templates on an SVG canvas in brand colours only, card types, a template per role, printing at the exact card size. The black portrait card is the default.
  - [x] Saved and scheduled reports (module 81): save a pick of areas and days, run it by hand or every day, Monday or 1st of the month at 7 AM Kampala time; every run is kept to read or download. The API's daily 7 AM cron also applies new database tables.
  - [x] Web pages and app screens for all of them. The hosted site opens on sign-in; the previews stay at `/#/role-switcher`.
  - [x] Full pass: every address the web and app call (211) exists on the API, and the super admin's screens open without a refusal (`apps/api/test/client-paths.test.ts`, run in CI). Fixing it gave the super admin a view of the staff and money modules it configures.
  - [ ] Tried, not finished: live chat push with Durable Objects (chat still refreshes every few seconds), the push notification rule editor (waits on the Firebase steps), drawing the staff card in the app from the saved designs (the app shows the default card), and sending scheduled reports by email or WhatsApp (runs are kept in the portal until those keys are in).
- [x] Next phase A, food side and tracking (asked by the user, 26 Nov 2026; done 26 Nov, checked by `apps/api/test/food-day.test.ts`):
  - [x] Food ordering with all FoodPanda-style features (names are references only): menus and sections, cart, order types, promo codes and vouchers (module 59, rechecked on the server, a voucher used once and given back on cancel), scheduled delivery, takeaway and room service up to N days ahead (super admin setting), live tracking, ratings and reviews (food and delivery stars, one per delivered order, staff can hide a review, dish stars on the menu), order again at today's prices, rider assignment and the rider flow, the kitchen board, and a push to the guest at each status change.
  - [x] A delivery tracker for everything that moves: food, shop items, laundry, room service trays and parcels. The dispatcher sends anything by hand from the dispatch board (`D-0001` numbers), linked to the guest's app account; the guest's tracker (S66-10) shows the steps, rider, arrival time, the rider's last position on the road, and the door code. Pushes go to the rider (new job) and the guest (on the way, delivered, problem).
  - [x] Preview mode for screens that need keys: MTN MoMo, Airtel Money and card show greyed out and labelled "Preview: not connected yet" until their keys are saved, and are never payable; the super admin sees which gateways are connected and can turn preview mode off (it must be off for the App Store build). The live map shows as a labelled preview until the Google Maps key is in. No demo data on real screens.
  - [x] Safety on real data: every price, discount and total worked out on the server; a double-tapped order (checkout key) or payment (same pending charge) never happens twice; another person's order or delivery answers 403; quantities 1 to 100 checked on the server; review text shown as plain text.
  - [x] Leftover from the last phase: chat messages now send an instant push ("New message from Sam", never the words). The live chat screen itself still refreshes every few seconds.
  - [ ] Tried, not finished: the live map and turn-by-turn route (need the Google Maps key), in-app card checkout (the app shows the card link to copy), rider ratings on the Riders page (the stars are saved; the page does not show them yet), and scheduled reports by email or WhatsApp (need the email and WhatsApp keys).
- [ ] Next phase B, access and security (asked by the user, 26 Nov 2026; in progress, PRs #23 and #24; tests in `modules/users-login/test/security.test.ts` and `apps/api/test/access-day.test.ts`):
  - [x] Guests sign up in the app only. The super admin upgrades a person to staff by matching a staff record with a verified email, recorded in the audit log.
  - [x] Mandatory 2-step sign-in for the super admin (and staff in sensitive roles when the super admin switches it on), recovery codes, a warning while there is no second super admin, and the last super admin can never be removed.
  - [x] No guest and staff switch: one account is one kind. The phone app's role switch, client view and demo home are gone.
  - [x] The web portal is staff only and the server refuses guest accounts there (sessions ended on the server). The staff subdomain waits for the hotel's domain (igongo.victorbee.com for now).
  - [ ] A Security settings screen; card kill; sign out a device; sign-in alerts. Done except the instant card kill from this screen (cards are blocked on the cards page).
  - [x] Short sessions and automatic sign-out on shared computers; lockout after failed tries.
  - [ ] Database snapshots with a tested restore.
  - [x] Privacy: export and delete a person's data (download my data; delete my account in the app, staff closed by HR).
  - [ ] Biometric sign-in, and offline clock-in at the gate.
  - [x] Sidebar: one collapse button, and Preview moved to the bottom of the sidebar for the super admin only.
  - [x] Tests proving a guest cannot reach any staff data.
  - [ ] One person is one account, with several sign-in methods linked to it (email and password, Google, Apple). The same verified email never makes a second account. Each rule below has a test:
    - [ ] Link automatically only when the provider has verified the email (Google verified, Apple verified).
    - [ ] An email and password sign-up must verify its email before it can be linked or used, which blocks takeover by registering someone's email first.
    - [ ] Apple "Hide My Email" relay addresses are linked only by hand, from inside a signed-in account, after a confirmation.
    - [ ] Adding or removing a method needs a fresh sign-in, and the last method can never be removed.
    - [ ] The staff match and the roles belong to the account, so every linked method gets the same roles.
    - [ ] The list of sign-in methods, and every link and unlink, show in the audit log and send the person an email alert.
  - [x] A CI step that fails on skipped tests, secrets in code, passwords or tokens in logs, and TODO in auth code (see [Quality rules](QUALITY-RULES.md)). Done 26 Nov: `tools/quality-check/check.mjs` in the Quality workflow, which also runs the web lint.
  - [ ] Real-user hardening, each item with its own test:
    - [x] A double-tapped pay or submit never charges or creates twice (idempotency keys, and the button is disabled while sending). Tests: `modules/payments/test/pay-once.test.ts`, `apps/api/test/food-day.test.ts`.
    - [x] Emails are lowercased and trimmed everywhere: sign-up, sign-in and the staff match.
    - [x] Apostrophes and unicode in names are safe (parameterised queries, escaped output).
    - [x] iPhone photo uploads (HEIC, large files, rotation) are converted and size-limited: the app re-encodes to JPEG at 1600 px, and the server refuses raw HEIC with a clear message and anything over the limit.
    - [ ] Password reset email works end to end; tokens expire and work once. Tested with a stand-in mailbox; the real email waits on an email provider (see [NEEDS-YOU](NEEDS-YOU.md)), and until then resets are refused the same way for every address.
    - [ ] Times are stored in UTC and shown in Africa/Kampala or the viewer's time zone.
    - [x] Signal lost after paying: the payment status is settled by the gateway webhook and a "check status" retry, never lost or charged twice (the provider is always asked directly; a short payment counts as failed). Test: `modules/payments/test/pay-once.test.ts`.
    - [x] A delete my account button in the guest app (also an App Store rule). The data policy text comes with the legal phase.
    - [ ] Apple "Hide My Email" relay addresses are accepted and used for the staff match.
    - [ ] Load and abuse: rate limits per user and IP, queues, and a test with thousands of requests at once.
- [ ] Full security audit, right after the access and security phase and again just before TestFlight (asked by the user, 26 Nov 2026; not started). Each item has a check and a written result in `docs/SECURITY-AUDIT.md`:
  - [ ] Scan the git history for secrets.
  - [ ] Rate limits on every public endpoint.
  - [ ] Access checks: each person sees only their own data.
  - [ ] Passwords hashed properly.
  - [ ] API keys and settings only as Worker secrets; none in the app or the repo.
  - [ ] Proper authentication on every route that needs it.
  - [ ] Dependencies updated and unused packages removed.
  - [ ] Every form and input sanitised.
  - [ ] XSS protection.
  - [ ] Debug mode and detailed errors off in production.
  - [ ] No exposed files or routes.
  - [ ] Every admin route protected.
  - [ ] Every API endpoint secured.
  - [ ] Strict CORS, to our own hosts only.
  - [ ] Security headers (CSP, HSTS and the rest).
  - [ ] Secure database access: a least-privilege database user and no public access.
  - [ ] A final full security audit report.
  - [ ] The 12-check security pass. Each check has a test that proves it and a result line in `docs/SECURITY-AUDIT.md`. Every fix is tested after it is made. The pass ends with `security-report.pdf` showing 12 of 12 passed and 0 open holes:
    - [ ] 1. Safe database queries only (parameterised). Test: `' OR 1=1 --` returns 0 rows.
    - [ ] 2. XSS: text people write (comments, names) is always shown as plain text, never run as script.
    - [ ] 3. Sign-in rate limit: slowed or blocked after repeated wrong passwords.
    - [ ] 4. CSRF protection with a token check: a forged form from another site is rejected.
    - [ ] 5. Secure session cookies: HttpOnly, Secure, SameSite.
    - [ ] 6. Password reset links expire and work once.
    - [ ] 7. Safe uploads (asked by the user, 26 Nov 2026). Each rule has a proving test and a result in `docs/SECURITY-AUDIT.md`. Built 26 Nov in `modules/files-media` (tests in `test/file-content.test.ts` and `apps/api/test/managers-day.test.ts`):
      - [x] Check the real content of every file (magic bytes and a check that the file is whole: JPEG end marker, PNG header and end chunks, WebP size, PDF end); never trust the extension or the declared type. A full pixel decode on the server is not possible on Workers without an image library.
      - [x] A strict size limit for each file type (10 MB photos, 20 MB PDFs, and the super admin's lower limit).
      - [ ] Re-encode images, which strips hidden code and metadata, and reject anything that does not decode. Done on the phone (the app re-encodes every photo to JPEG at 1600 px before sending, which also converts iPhone HEIC); the server refuses photos with hidden code. Server-side re-encoding of web uploads is not done yet.
      - [x] Rename every upload at once to a random name that cannot be guessed (a UUID); the original name is never kept.
      - [x] Store uploads only in object storage (Cloudflare R2), never on the app server. No public listing. Files are served with the correct content type and `nosniff`, and anything that is not an image is download only.
      - [x] Uploads are never executed (served with `nosniff` and a sandbox content policy).
      - [x] Upload rate limits per person (30 files in 10 minutes).
      - [x] Tests: a fake jpg that is really a script, a file that is too big, and a double extension (`photo.jpg.php`) are all rejected.
    - [ ] 8. Admin pages locked: a normal user gets 403.
    - [ ] 9. Every price and total rechecked on the server; the browser is never trusted.
    - [ ] 10. Debug mode off in production: people see only "Something went wrong, reference A12F", with the details in private logs.
    - [ ] 11. Risky packages updated and unused ones deleted.
    - [ ] 12. The whole git history scanned for leaked keys, and any found are rotated.
    - [ ] A real sign-in, with no shortcuts.
    - [ ] Every password hashed (bcrypt or stronger, never plain text).
    - [ ] People see only their own data: another person's order returns 403.
    - [ ] API keys and gateway secrets only on the server, never in browser or app code.
    - [ ] HTTPS forced everywhere.
    - [ ] Database access locked down: not reachable from the internet except through the API.
    - [ ] Every form is checked on the server too, not only on the page (for example, quantity must be 1 to 10 and anything else is rejected).
  - [ ] The 20 common shortcuts that get AI-built apps hacked (asked by the user, 26 Nov 2026): secret keys in code, an open database, any password works, no limit on tries, seeing each other's data, only /admin protected, trusting input, file uploads, no two-step sign-in, test accounts or pages live, errors that say too much, copied code, old pages online, payment checks skipped, AI chatbot risks, plain text, sign up as admin, never updating, no backup, no activity log. Each has a check and a result line in [SECURITY-AUDIT](SECURITY-AUDIT.md) (the table is ready, all open).
- [ ] Project files docs pass (asked by the user, 26 Nov 2026): check the repo has a PRD, `ARCHITECTURE.md`, `ARCHITECTURE-ESSENTIALS.md`, `AGENTS.md` and `CLAUDE.md`, and write any that are missing from the existing spec, architecture and code-standards docs. Today only `CLAUDE.md` and `README.md` are at the top; the spec and architecture live in `docs/`.
- [ ] Last phase before TestFlight, premium animations and transitions (asked by the user, 26 Nov 2026; do after the basics, not started): booking flows, menu scroll effects and modern TikTok-style motion, mostly in the guest app and the public websites, all of premium quality.
- [ ] Speed, right after the animations (asked by the user, 26 Nov 2026: "make the app very light and speedy"; not started). The app and the web stay very light and fast, and nothing is loaded that is not needed. Each item has a check:
  - [ ] Load only what the screen needs: lazy loading of modules, screens and images, and deferred loading in the app.
  - [ ] Small bundles: code splitting on the web, tree shaking, unused packages and assets removed, bundle size budgets checked in CI.
  - [ ] Optimised images: modern formats, the right size for each screen, compressed, cached.
  - [ ] Caching: API answers and static files cached where safe; no repeated calls for the same data.
  - [ ] Pagination and virtualised long lists everywhere.
  - [ ] Quick start-up: measured cold start for the app and first load for the web, with targets.
  - [ ] Tests on low-end Android phones and on slow (3G) signal.
- [ ] Legal and compliance for Uganda, right before App Store readiness (asked by the user, 26 Nov 2026; not started). Each item has a check, and everything here is to be confirmed by a Ugandan lawyer before launch. Apple and Google store rules stay as listed under App Store readiness:
  - [ ] Data Protection and Privacy Act 2019: privacy policy and consent texts written for it; a docs note on registering with the Personal Data Protection Office (under NITA-U); a data-subject rights page (access, correct, delete); and the steps to report a data breach.
  - [ ] Children: personal data of anyone under 18 needs a parent's or guardian's consent, so the app is for ages 18 and up, or has a guardian-consent flow.
  - [ ] Electronic Transactions Act 2011 and Computer Misuse Act: terms of service accepted at sign-up, and electronic records and receipts that meet them.
  - [ ] URA EFRIS: the accountant confirms whether the hotel must issue EFRIS e-receipts for bookings and food (see [NEEDS-YOU](NEEDS-YOU.md)); a hook for it is kept either way.
  - [ ] Names and trademarks: the Igongo name and logo belong to the hotel and are used with its written permission, recorded in the docs. Trademarks are registered through URSB. No other company's name, logo or look (FoodPanda, APEX and others are references only).
  - [ ] Photos and fonts (Copyright and Neighbouring Rights Act 2006): only images the hotel owns or has licensed, and open-licence (OFL) fonts such as Cinzel and Lato. `docs/ASSETS.md` lists the source and licence of every photo, icon, logo and font.
  - [ ] Payments and cancellation: a clear booking, order and refund cancellation policy shown before paying; prices in Ugandan shillings with taxes shown; delete my account always available. The mobile-money providers handle the Bank of Uganda rules, noted in the docs.
- [ ] App Store readiness, right before TestFlight (asked by the user, 26 Nov 2026; not started). Each item has a check:
  - [ ] No crash on open, tested on the built iOS app.
  - [ ] A reviewer demo login: a guest reviewer account with working sample bookings, written into [MAC-STEPS](MAC-STEPS.md) for the App Store Connect review notes.
  - [ ] Payments: bookings and food are physical goods and services, so the gateways are allowed. Anything digital is avoided or uses in-app purchase.
  - [ ] Browsing without signing up (rooms, menu, museum); sign-up only when booking or ordering.
  - [ ] No "Coming soon" or dead buttons in release builds; unfinished modules are hidden.
  - [ ] Clear permission texts for NFC, location, camera, notifications and photos.
  - [ ] Report and block for anything users write (chat, reviews).
  - [ ] Sign in with Apple wherever Google is offered.
  - [ ] Store screenshots with nothing from Android in them.
  - [ ] Real native value (NFC, push, tracking, offline), not just a website.
  - [ ] Delete my account in the app, a privacy policy URL and a support URL.
- [ ] Run the full security audit again, just before TestFlight, and update `docs/SECURITY-AUDIT.md`.
- [ ] The final gate before any deployment (asked by the user, 26 Nov 2026): run the whole [master pre-deployment checklist](MASTER-PREDEPLOY-CHECKLIST.md) (21 sections) together with the security audit, and record each result in `docs/SECURITY-AUDIT.md`. Nothing goes to real users while an item is open.
- [ ] Event bus (Queues and outbox) and Notifications. Files & Media is done.
- [ ] Build each module's back end (domain, use cases, database, API and events), in the agreed order.
- [ ] Connect each module's screens to its API.
- [ ] Unit and integration tests for each module.
- [ ] Check each module can be switched off without breaking the others.

## Phase 8: Integrations

- [ ] SMS (Africa's Talking) and WhatsApp (Meta).
- [ ] Payments: MTN MoMo, Airtel Money and Flutterwave, with signed callbacks.
- [ ] Push notifications (FCM) and email.
  - [x] Push code, built ahead (25 Nov 2026) and tested with fakes: the app side in `apps/igongo/lib/modules/m10_notifications/` (permission explainer, token, topics, foreground, background and tap handling, Android channels) and the API side in `modules/notifications/` (device tokens table and migration, register and remove routes, test push and broadcast routes, FCM HTTP v1 sender with a mock, and the notification rules hook).
  - [ ] Firebase apps, APNs key and service-account key: waiting on the steps in [NEEDS-YOU](NEEDS-YOU.md).
  - [x] Router mounted in the gateway at `/api/notifications` (behind its module switch), with roles turned into people by Roles & Permissions.
  - [ ] Call `PushModule.start` after sign-in and `stop` at sign-out in the app, and connect the rule editor and the Firebase "Send test" button.
  - [ ] Test on a real Android phone and iPhone.
  - [ ] Later: move to Firebase's newer installation-ID "direct send" on both sides once it is documented for the HTTP v1 send API (the app uses the token calls marked deprecated in firebase_messaging 17).
  - [ ] Email.
- [ ] Google Maps for delivery and riders.
- [ ] APEX link, once the vendor confirms how.
- [ ] URA EFRIS, if the hotel needs it.

## Phase 9: Hardware

- [ ] Test the current cards (NXP NTAG213): write, password-lock, originality signature check, tap at every station.
- [ ] Decide whether the next card order moves to NTAG 424 DNA (copy-proof), and set it up as a new card type.
- [ ] Buy and test the wristbands.
- [ ] Set up the card printer as a print preset, and test one-click printing at the exact card size.
- [ ] Set up gate and station devices in kiosk mode.
- [ ] Card printer and receipt printers.
- [ ] On-site NFC tests at the gate, reception, canteen, pool and event hall.

## Phase 10: Data and setup

- [ ] Import staff, departments, menus, assets and opening balances.
- [ ] Register all wristbands.
- [ ] Set up the pre-made roles, forms, workflows and notification rules with the hotel.
- [ ] Issue staff cards.

## Phase 11: Testing

- [ ] End-to-end tests of the main flows.
- [ ] Security review: permissions, data scope, payments, audit trail and the Data Protection and Privacy Act.
- [ ] Load test for busy times (a big event, payday).
- [ ] Offline tests at the gate and food line.
- [ ] Accessibility tests at all text sizes.
- [ ] Pilot with selected staff, then with guests.
- [ ] Fix every bug and warning found.
- [ ] Sign-off by the GM.

## Phase 12: Marketing, SEO and online presence

Victor Bee Technologies runs marketing for the hotel, so none of this is skipped.

> **Deferred, not skipped (25 Nov 2026).** The user asked to leave SEO and marketing until the hotel confirms. Real accounts and domains are set up then. The in-code hooks are already built: page titles and meta tags (`pageMetadata`), the share image, sitemap and robots, the web manifest, and analytics slots behind the consent banner. The items below stay open until then. See [SEO & Online Presence](modules/83-seo-online-presence.md).

### Website SEO
- [ ] Keyword research for Igongo, Mbarara hotels, the museum, weddings, conferences and the pool.
- [ ] Page titles, descriptions and clean addresses for every page.
- [ ] Structured data: Hotel, Restaurant, Menu, Event, TouristAttraction, Product, Review, FAQ and breadcrumbs, checked with Google's Rich Results Test.
- [ ] Sitemap, robots file, canonical links and redirects from the old website's addresses.
- [ ] Core Web Vitals in the green on mobile.
- [ ] Image alt text on every image.
- [ ] Google Search Console and Bing Webmaster Tools verified, and the sitemap submitted.
- [ ] Clean up the old website, including removing the spam links in its footer, before the switch.

### Tracking
- [ ] Google Analytics 4 and Google Tag Manager, with a consent banner.
- [ ] Conversions tracked: bookings, orders, enquiries, ticket sales and app installs.
- [ ] Meta Pixel, TikTok Pixel and Google Ads conversion tags.
- [ ] UTM campaign links on every marketing message.
- [ ] Monthly marketing report set up.

### Local listings
- [ ] Google Business Profile for the hotel (and the museum, restaurant and spa if separate), with photos, hours, menu and booking links.
- [ ] Apple Business Connect, Bing Places and TripAdvisor.
- [ ] The same name, address and phone everywhere.
- [ ] Review replies set up.

### App stores
- [ ] Play Store and App Store listings: name, subtitle, keywords, descriptions, screenshots and preview video.
- [ ] Privacy policy, terms and data safety forms.
- [ ] Ratings prompt in the app.
- [ ] Deep links and smart app banners from the website to the app.

### Social and content
- [ ] Social media profiles linked and branded.
- [ ] Open Graph images for every shareable page.
- [ ] Launch content: blog posts, landing pages for weddings, conferences, school trips and the museum.
- [ ] Newsletter sign-up and first campaigns.
- [ ] Booking.com, Expedia and Hotels.com listings checked for matching content and photos.

## Phase 13: Training and launch

- [ ] Train the super admin, managers and staff, by role.
- [ ] User guides per role.
- [ ] Publish to the Play Store and the App Store.
- [ ] Go live on the production domains.
- [ ] Hand over the system, code and documents.
- [ ] Support and monitoring after launch.
