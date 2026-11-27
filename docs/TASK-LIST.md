# Igongo task list (rebuilt 27 Nov 2026)

One line per item, taken from the owner's own words in the project chat, the owner's spec notes, and the repo docs. Nothing is grouped away: each small item has its own row.

**Status key**
- DONE: merged to main, with the proof PR named.
- PARTLY: some of it is built or merged, the rest is open.
- NOT DONE: not started, or started only as a plan.
- NEEDS OWNER: cannot move until the owner supplies a key, photo, decision or Mac step.

**Proof** is the PR, file or doc that shows the status. Where a status comes from a chat report and not from a merged PR, the row says so.

**Scope note:** The chat was read up to 27 Nov 2026 00:41 UTC. Later messages (00:41 to 01:57) are not reflected here yet and will be checked in the next pass.

---

## 1. Guest app screens

| # | Item (owner's words) | Status | Proof | Next step |
|---|---|---|---|---|
| 1.1 | Five-tab bottom bar: Home, Food, Bookings, Cart, Me | PARTLY | PR #34 (open) | Owner checks on simulator, then merge |
| 1.2 | Wavy bottom nav ("that design is cool") | PARTLY | PR #34 | Owner checks label visibility |
| 1.3 | Bottom nav labels must show (owner: "label is not seen") | PARTLY | PR #34 (reported fixed) | Confirm on simulator |
| 1.4 | Header: time greeting and first name only, no logo, no "Home" title, no "Guest" | PARTLY | PR #34 (reported) | Owner checks |
| 1.5 | Greeting and bell on their own red gradient, always readable over any banner | PARTLY | PR #34 (reported) | Confirm no visible seam |
| 1.6 | Top banner: 2 slides, crossfade, full red header with no margins | PARTLY | PR #34 (reported) | Confirm on simulator |
| 1.7 | Promotions carousel (3 slides, hut, restaurant, entrance) | PARTLY | PR #34 (reported) | Owner says "2 slides" in last message: confirm which |
| 1.8 | Today's menu: image-only stacked slideshow, 3 cards, 2.5 s, tap opens dish, no side margins | PARTLY | PR #34 (reported) | Dish photos still placeholders |
| 1.9 | Food screen: "Restaurants" (not "Shops"), slideshow of restaurants at same height | PARTLY | PR #34 (reported) | Owner checks |
| 1.10 | Food grid: 2 cards per row, same size, one line name, photo, bold red price, + button | PARTLY | PR #34 (reported) | Owner checks; CI had failures on card height |
| 1.11 | Dish page: optional add-ons, optional note (e.g. no tomatoes), then Add to cart | PARTLY | PR #34 (reported) | Owner checks |
| 1.12 | Remove "Order food" bracket text, one line only | DONE (reported) | PR #34 | none |
| 1.13 | Back arrow only on pages opened from a tab, not on tab screens | PARTLY | PR #34 (reported) | Shared rule for future screens |
| 1.14 | Search bar works | NOT DONE | - | Build after screens are checked |
| 1.15 | Explore Igongo grid, 2 per row, same size | PARTLY | PR #34 (reported) | Owner checks |
| 1.16 | Bookings screen matches owner's reference image (hero carousel, Hotel Booking card, 9-tile grid, shortcuts, Recent Bookings) | PARTLY | PR #34 commit 022b39c (reported) | Photos for Events, Spa, Shop, Chat still placeholders; owner checks |
| 1.17 | Cart screen matches owner's reference (photo banner, empty state, item cards, summary, checkout button) | PARTLY | PR #37 (draft) | Analyzer and screenshot tests must pass; owner checks |
| 1.18 | Me profile screen matches owner's design (wavy header, profile card, stat tiles, sections, delete in red) | PARTLY | PR #38 (draft) | CI re-running; owner checks |
| 1.19 | Points tile shows 450 as placeholder; points system later as its own module | PARTLY | PR #38 | Points module (wait list) |
| 1.20 | Past visits screen (opens account form for now) | NOT DONE | - | Build the screen |
| 1.21 | Service charge line in cart: UI now, super admin on/off and rate later | PARTLY | PR #37 (placeholder 5%) | Wait list item 8 |
| 1.22 | Floating WhatsApp button for signed-in guests (demo number) | PARTLY | PR #34 (reported) | Owner checks |
| 1.23 | "Chat with us" removed | DONE (reported) | PR #34 | none |
| 1.24 | Sign out at bottom, with Preview above (sidebar rule) | NOT DONE | - | Check in web and app |
| 1.25 | Guest sees only real data; no demo data on real screens; key-dependent screens show preview | PARTLY | docs/APP-WIRING.md; ViewRules | Owner rule, keep under test |
| 1.26 | Launcher icons (Android burgundy adaptive, iOS cream) | DONE (code) | PR #35 merged | Owner checks on real Android and iOS |
| 1.27 | Photos: hut, restaurant, rooms, dishes, outlets, entrance, cottages, pool, grounds | PARTLY | PR #34 (11 + 10 + 12 photos saved; some on screens) | Executive room bedroom photo missing; larger hut photo |
| 1.28 | Cottage gate name: Mpororo Court or Kitami's Palace | NEEDS OWNER | - | Owner chooses name |
| 1.29 | Demo menu: one switchable file, marked demo, unavailable items last and dimmed | PARTLY | docs/WAIT-LIST.md, PR #34 | Confirm switch file exists |
| 1.30 | Customisation and notes before final order | PARTLY | PR #34 (dish page) | Owner checks |
| 1.31 | Store images (Play Store and App Store) planned so screens connect | NOT DONE | Plan in memory | Build later, after screens are final |
| 1.32 | Premium animations before TestFlight | NOT DONE | docs/BUILD-CHECKLIST.md | Wait list |
| 1.33 | App light and fast (speed phase before TestFlight) | NOT DONE | docs/BUILD-CHECKLIST.md | Wait list |
| 1.34 | Super admin can switch Bookings and other banners later (banner slot) | PARTLY | PR #34 banner slot | Upload is on wait list |
| 1.35 | Search, alerts, notifications icon behaviour | NOT DONE | docs/APP-WIRING.md | Build |
| 1.36 | Preview panel for super admin only, at bottom of sidebar | PARTLY | PR #32 (roles) | Check placement |

## 2. Booking and tickets

| # | Item (owner's words) | Status | Proof | Next step |
|---|---|---|---|---|
| 2.1 | Booking home: 4-card grid (Book a room, table, events, spa), same size | PARTLY | PR #36 (draft to ready) | Owner checks |
| 2.2 | Date screen, room list with filters, booking details | PARTLY | PR #36 | Owner checks |
| 2.3 | Dine-in asks for arrival time; no order without it | PARTLY | PR #34 (reported) | Real arrival time needs API change (wait list); the time goes to kitchen as note for now |
| 2.4 | Takeaway shows container charge; super admin sets price (0 = free) | PARTLY | PR #34 (reported), super admin ordering page | Owner checks |
| 2.5 | Delivery asks zone and place; order only after "Confirm delivery" | PARTLY | PR #34 (reported) | Map pin waits for Google Maps key |
| 2.6 | Demo payment screen (mobile money or card) | PARTLY | PR #36 | Real provider keys later |
| 2.7 | Ticket-style receipt like the owner's air-ticket reference, with QR and barcode | PARTLY | PR #36 | Owner checks look against reference |
| 2.8 | Printable PDF receipt | NOT DONE | - | Build |
| 2.9 | Signed booking numbers so receipts can't be forged | NOT DONE | - | Build (needs ticket signing key, see Security) |
| 2.10 | Receipt email through Resend, sends after successful payment, off until key is added | PARTLY | PR #36 | Resend key from owner |
| 2.11 | QR image in the receipt email | NOT DONE | - | Build |
| 2.12 | My Bookings with Upcoming and Past tabs | PARTLY | PR #36 | Owner checks |
| 2.13 | Staff scanner: Valid, Used, Forged, Cancelled, Not paid | PARTLY | PR #36 | Camera scanning not built; text paste only |
| 2.14 | Check-in records who did it and when | PARTLY | PR #36 | Test |
| 2.15 | Only a valid signed QR can check a guest in (typed-code check-in removed) | DONE (code) | PR #36 | Confirm in tests |
| 2.16 | A ticket scanned twice is refused the second time | DONE (code) | PR #36 | Confirm in tests |
| 2.17 | Booking tests pass on owner's Mac (91 passed, golden excluded) | DONE | owner's Mac run, 26 Nov | Golden tests to be regenerated |
| 2.18 | Booking PR #36 merged | NOT DONE | Draft ready for review | Owner says check booking before merge |

## 3. Food

| # | Item (owner's words) | Status | Proof | Next step |
|---|---|---|---|---|
| 3.1 | FoodPanda-level features, tracker for all | PARTLY | docs/BUILD-CHECKLIST.md, food-day test (memory) | Live map waits for Google Maps key |
| 3.2 | Promo codes, discounts, double-tap guard, ratings, reorder | DONE (API) | apps/api/test/food-day.test.ts | App wiring partly |
| 3.3 | Rate order sheet, reorder refills cart | DONE (app code) | memory: igongo-food-tracker | Owner checks |
| 3.4 | Rider ratings on Riders page | NOT DONE | memory | Build |
| 3.5 | Live map and route | NOT DONE | Google Maps key | NEEDS OWNER (key) |
| 3.6 | In-app card checkout | NOT DONE | memory | Build after payment keys |
| 3.7 | Report email and WhatsApp | NOT DONE | memory | Build |
| 3.8 | Voucher approval (Requested, Issued, Redeemed) | DONE (API) | memory | Confirm in app |
| 3.9 | Payment preview list; showPreview off for App Store | PARTLY | memory | Turn off before App Store |

## 4. Staff and access

| # | Item (owner's words) | Status | Proof | Next step |
|---|---|---|---|---|
| 4.1 | Guest sign-up first; super admin upgrades to staff | PARTLY | PR #32 (merged) | Confirm flow |
| 4.2 | Staff matched by staff record (HR matching) | PARTLY | PR #32 | Test |
| 4.3 | Super admin holds all 303 permissions | DONE | PR #32 | none |
| 4.4 | Only super admin signs in with email and password for staff; web for staff only | PARTLY | owner rule; PR #32 | Check web guard (SECURITY-AUDIT 6) |
| 4.5 | Staff who want guest view create another account (no switch) | NOT DONE | owner rule | Check app |
| 4.6 | Staff subdomain later (staff.igongo.com) | NOT DONE | wait list | Later |
| 4.7 | One account per email; Google, Apple and email linked; email verified; no duplicates | NOT DONE | owner rule | Build account linking |
| 4.8 | Only one super admin email for now | DONE (config) | owner rule | Keep |
| 4.9 | Staff access by role, audited | PARTLY | roles migration 0008 | Shortcut 17, 20 |
| 4.10 | Roles from 121 pre-made roles | DONE | memory: igongo-staff-modules | none |

## 5. Super admin

| # | Item (owner's words) | Status | Proof | Next step |
|---|---|---|---|---|
| 5.1 | Change API keys without code (Resend and others) | PARTLY | Container and zone settings in PR #34; keys not yet | Build key screen |
| 5.2 | Change outlet names | NOT DONE | not checked | Check on web; build |
| 5.3 | Delivery zones and fees editable | PARTLY | PR #34 ordering settings | Owner checks |
| 5.4 | Takeaway container price (0 = free) | DONE (reported) | PR #34 | none |
| 5.5 | Change banner and logo images | NOT DONE | wait list | Upload needs R2 (see Server) |
| 5.6 | Change sender address | NOT DONE | owner rule | Build |
| 5.7 | Company WhatsApp number, default demo number | DONE (reported) | PR #34, Business settings, Hotel profile | none |
| 5.8 | Service charge on/off and rate | NOT DONE | wait list item 8 | Build (UI placeholder exists) |
| 5.9 | Points on/off | NOT DONE | wait list | Points module |
| 5.10 | Move super admin out of the guest app | NOT DONE | owner question 26 Nov; wait list | Start as own thread after bookings |
| 5.11 | Preview panel: role picker and design preview, super admin only | PARTLY | PR #32 | Check |
| 5.12 | Audit Trail for every change, sign-in and payment | NOT DONE | SECURITY-AUDIT 20 | Build |

## 6. Security (every item the owner gave)

| # | Item | Status | Proof | Next step |
|---|---|---|---|---|
| 6.1 | Secret keys not in code, repo, docs, memory or logs | PARTLY | SECURITY-AUDIT 1 (Open) | Scan history; rule kept |
| 6.2 | Ticket signing key set as Worker secret TICKET_SIGNING_KEY | DONE | Owner's Mac, 26 Nov ("Uploaded secret") | none |
| 6.3 | Ticket signing key rotation: the key pasted in chat is exposed | NEEDS OWNER | Chat 26 Nov | Owner rotates to a new key before real bookings; the old value must never be reused or repeated |
| 6.4 | Resend key rotation: key set later, stored as Worker secret or super admin setting | NEEDS OWNER | docs/NEEDS-YOU.md | Owner adds key; rotate if ever pasted in chat |
| 6.5 | QR code forgery protection (signed QR) | PARTLY | PR #36 | Signed booking numbers (2.9) still open |
| 6.6 | Bookings-only check-in (only staff in booking role can check in) | PARTLY | PR #36 | Check role gate in tests |
| 6.7 | Super admin key overrides (keys set in app, not code) | PARTLY | 5.1 | Build |
| 6.8 | Staff access checks on every server route (not only the page) | PARTLY | SECURITY-AUDIT 6 (Open) | Audit |
| 6.9 | Two-step sign-in (TOTP, recovery codes) for super admin and sensitive staff | PARTLY | SECURITY-AUDIT 9 (Open); memory: Better Auth | Check enforced |
| 6.10 | Sign-in rate limit and lockout after repeated wrong passwords | NOT DONE | SECURITY-AUDIT 4 (Open) | Build and test |
| 6.11 | Idle sign-out | NOT DONE | owner rule | Build |
| 6.12 | Safe uploads: real content check, size limit, random names, R2 storage | NOT DONE | SECURITY-AUDIT 8 (Open); R2 not enabled | Owner enables R2 storage |
| 6.13 | Twelve-check security pass | NOT DONE | docs/BUILD-CHECKLIST.md | Run before TestFlight |
| 6.14 | Twenty shortcuts (Security Audit list 1 to 20, #15 not applicable) | NOT DONE | docs/SECURITY-AUDIT.md: 19 Open, 1 N/A | Work through one by one |
| 6.15 | Master pre-deployment checklist | NOT DONE | docs/MASTER-PREDEPLOY-CHECKLIST.md | Run before go-live |
| 6.16 | Quality rules (binding) | PARTLY | docs/QUALITY-RULES.md | Keep as gate for every PR |
| 6.17 | Database not open to internet; least-privilege user | NOT DONE | SECURITY-AUDIT 2 | Verify |
| 6.18 | Passwords hashed, keys encrypted at rest, no personal data in logs | NOT DONE | SECURITY-AUDIT 16 | Verify |
| 6.19 | Errors show "Something went wrong, reference" only; details to Sentry | NOT DONE | SECURITY-AUDIT 11 | Build |
| 6.20 | Backups and one tested restore | NOT DONE | SECURITY-AUDIT 19; docs/BACKUPS.md | Owner decides backup plan |
| 6.21 | Dependencies pinned, unused removed, scan in CI | NOT DONE | SECURITY-AUDIT 12 | Build |
| 6.22 | Old routes and preview builds removed | NOT DONE | SECURITY-AUDIT 13 | Check |
| 6.23 | Payments confirmed with provider on server; callbacks verified | NOT DONE | SECURITY-AUDIT 14 | Build with real keys |
| 6.24 | No test users or demo data in production | NOT DONE | SECURITY-AUDIT 10 | Check before release |
| 6.25 | Guests cannot sign up as admin | PARTLY | SECURITY-AUDIT 17 | Verify |
| 6.26 | Server validates all input; prices recalculated on server | PARTLY | SECURITY-AUDIT 7 | Verify |
| 6.27 | Other people's data refused (403) | PARTLY | food-day test | Extend to all modules |
| 6.28 | Activity log and alerts for new devices and failed sign-ins | NOT DONE | SECURITY-AUDIT 20 | Build |
| 6.29 | Uganda legal (DPPA 2019 etc.), not US references | NOT DONE | owner rule | Review terms and privacy text |

## 7. Server and API

| # | Item | Status | Proof | Next step |
|---|---|---|---|---|
| 7.1 | Worker igongo-api with cron 0 4 * * * (7 AM Kampala) | DONE | memory: igongo-api-hosting | none |
| 7.2 | Saved and scheduled reports | DONE | PR #17 merged | none |
| 7.3 | Client path test (every /api call exists) | DONE | PR #18 merged | none |
| 7.4 | Records kit (40 thin modules) | DONE | PR #14 merged | none |
| 7.5 | Stock inventory, spa, venues, tables | DONE | PR #15 merged | none |
| 7.6 | App builder and card designs | DONE | PR #16 merged | none |
| 7.7 | Push notifications (FCM) | PARTLY | PR #8 merged | Owner registers Firebase, uploads config, sets FCM secret |
| 7.8 | Apple sign-in and Google sign-in keys | PARTLY | memory | Keys stored as Worker secrets |
| 7.9 | Booking and ticket API (PR #36) | PARTLY | PR #36 | Merge after owner check |
| 7.10 | Cloudflare R2 file storage (bucket igongo-files) | NOT DONE | NEEDS-YOU | Owner enables |
| 7.11 | Neon backups and branch restore | NOT DONE | docs/BACKUPS.md | Owner decides |
| 7.12 | API and web deploy steps | PARTLY | docs/NEEDS-YOU.md | Owner runs when ready |

## 8. Launcher icons and store images

| # | Item | Status | Proof | Next step |
|---|---|---|---|---|
| 8.1 | Android burgundy adaptive icon | DONE (code) | PR #35 | Owner checks on real phone |
| 8.2 | iOS cream icon | DONE (code) | PR #35 | Owner checks on iPhone |
| 8.3 | Play Store and App Store screenshots | NOT DONE | Two screenshot tests out of date | Regenerate on Mac after screens final |
| 8.4 | Store images connected like the owner's reference listing | NOT DONE | Plan in memory | Build later |

## 9. Mac and deploy steps (owner)

| # | Item | Status | Proof | Next step |
|---|---|---|---|---|
| 9.1 | Pull branch and run guest app on simulator | NEEDS OWNER | Commands sent in chat | Owner runs |
| 9.2 | flutter test --exclude-tags golden | DONE (once) | 26 Nov, 91 passed | Re-run after changes |
| 9.3 | Commit updated lock file after adding WhatsApp package | NEEDS OWNER | Chat 27 Nov | Owner runs flutter pub get and commits |
| 9.4 | Ticket signing key secret | DONE | Uploaded 26 Nov | Rotate (6.3) |
| 9.5 | Re-login to Cloudflare when token expires | NEEDS OWNER | Chat 26 Nov | Run wrangler login when prompted |
| 9.6 | TestFlight upload (owner only, at the very end) | NOT DONE | docs/MAC-STEPS.md | Owner, last step |
| 9.7 | Real iPhone and Android check of icons | NEEDS OWNER | PR #35 | Owner |

## 10. Later modules (wait list)

| # | Item | Status | Proof | Next step |
|---|---|---|---|---|
| 10.1 | Points system (real data, own module) | NOT DONE | Placeholder 450 shown | Later |
| 10.2 | Service charge on/off and rate | NOT DONE | Placeholder 5% | Later |
| 10.3 | Super admin WhatsApp number | DONE (reported) | PR #34 | none |
| 10.4 | Dine-in arrival time in API | PARTLY | PR #34 note only | API change |
| 10.5 | Map pin for delivery | NOT DONE | Google Maps key | NEEDS OWNER |
| 10.6 | Super admin upload of banner and logo | NOT DONE | docs/WAIT-LIST.md | Later (R2) |
| 10.7 | Launcher icon change needs a new build | NOT DONE | note | Later |
| 10.8 | Premium animations | NOT DONE | wait list | Later |
| 10.9 | Speed phase before TestFlight | NOT DONE | wait list | Later |

---

## Counts (this pass)

146 items across 10 areas:

- DONE: 26
- PARTLY: 60
- NOT DONE: 53
- NEEDS OWNER: 7

Several PARTLY rows depend on PR #34, #36, #37 and #38, which are not merged. Their status moves once the owner has checked the screens.

## Owner's top five must-dos

1. Check the guest app on your Mac: home, Food, Bookings, Cart and Me (PRs #34, #37, #38). Tell the thread what looks wrong.
2. Rotate the ticket signing key before any real booking. The old value was posted in chat and must not be reused.
3. Give the Resend API key (or set it in super admin later), and choose the sender address.
4. Send the executive room bedroom photo, and say whether the cottage gate name is Mpororo Court or Kitami's Palace.
5. Enable Cloudflare R2 storage, so safe uploads and banner and logo uploads can be built.
