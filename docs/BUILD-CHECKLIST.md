# Build checklist, from start to end

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
- [ ] Empty state, error, offline and success illustrations (made with the UI designs in Phase 4).
- [ ] App Store and Play Store screenshots (made once the screens exist).
- [ ] Approve all assets.
- [ ] Check uniformity: the same logo, colours and type everywhere. See [brand assets](design/brand-assets.md).

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

- [ ] Build the design system screens: colours, type, buttons, fields, cards, lists, tabs, chips, dialogs, toasts, loaders and icons.
- [ ] Turn every approved sketch into a branded design with the theme and logo.
- [ ] Check every design at Compact and Extra large text, and in light and dark mode.
- [ ] Check contrast and tap target sizes.
- [ ] Clickable prototype of the main flows.
- [ ] Approve all designs.

## Phase 5: Foundation code

- [ ] Monorepo set up: pnpm and Turborepo, Melos, and the folder layout in the README.
- [ ] Strict lint and type check settings, with warnings as errors, and automatic formatting.
- [ ] CI on every pull request: lint, type check, tests and build.
- [ ] Shared packages: core, contracts, design tokens, brand and UI components.
- [ ] Database: Neon project, one schema per module, Drizzle migrations, and development, staging and production branches.
- [ ] Error tracking with Sentry in the app, web and API.

## Phase 6: Code the UI and connect every screen

The whole app and web portal are built as a clickable product first, with sample data and no real functions. Every screen is coded and every route is connected, from the first screen to the last, for every person, before any functionality is built in Phase 7.

- [ ] Code the reusable UI components once, with comments and tests.
- [ ] Code every approved screen, module by module, each in its own folder.
- [ ] Connect every screen from start to end, with navigation built from roles.
- [ ] Handle every state: loading, empty, error, offline and permission denied.
- [ ] Code every dialog, toast, warning, confirmation and pop-up.
- [ ] Client view switch on every staff role.
- [ ] Text size setting and the phone's text size respected on every screen.
- [ ] Zero warnings in `flutter analyze`, ESLint and the type checks.
- [ ] Widget and golden tests for every screen.

## Phase 7: Build the modules

- [ ] Core modules first: Users & Login, Roles & Permissions, App Layout & Navigation, Audit Trail, Super Admin Console.
- [ ] Event bus (Queues and outbox), Notifications, Files & Media.
- [ ] Build each module's back end (domain, use cases, database, API and events), in the agreed order.
- [ ] Connect each module's screens to its API.
- [ ] Unit and integration tests for each module.
- [ ] Check each module can be switched off without breaking the others.

## Phase 8: Integrations

- [ ] SMS (Africa's Talking) and WhatsApp (Meta).
- [ ] Payments: MTN MoMo, Airtel Money and Flutterwave, with signed callbacks.
- [ ] Push notifications (FCM) and email.
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

Victor Bee Technologies runs marketing for the hotel, so none of this is skipped. See [SEO & Online Presence](modules/83-seo-online-presence.md).

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
