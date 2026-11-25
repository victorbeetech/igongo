# Build checklist, from start to end

This is the order the project must follow. Each phase ends with an approval before the next one starts. Tick a box only when the item is done **and** checked.

Every phase follows the [code standards](architecture/code-standards.md): clean architecture, a folder for each module, reusable and separated shared code, minimal code, comments on every process, and zero warnings.

## Phase 0: Scope and plan

- [x] Agree the deliverables: one Igongo app for everyone, the web portal and the public website.
- [x] Write the [modules spec](modules/README.md): 83 independent modules.
- [x] Write the [roles spec](roles/README.md): 72 pre-made roles, all editable by the super admin.
- [x] Review the [tech stack](architecture/stack.md) against the requirements.
- [x] Write the [code standards](architecture/code-standards.md).
- [ ] Agree the build order of modules (which are in the first release and which follow), and the timeline that matches it.
- [ ] Confirm open questions with the hotel: Humura (spa), staff headcount, APEX vendor contact and link type, card and wristband quantities, card printer model.

## Phase 1: Theme

- [x] Propose the theme in Igongo's reddish brand: colours, fonts, text sizes, light and dark mode. See [theme](design/theme.md).
- [x] Put every value in one [design tokens file](../packages/design-tokens/tokens.json).
- [ ] Match the colours exactly to the official logo file.
- [ ] Approve the palette.
- [ ] Approve the fonts (Playfair Display and Inter).
- [ ] Approve the text sizes: small by default, sized for their part of the screen, and a text size setting from Compact to Extra large.
- [ ] Lock the tokens as version 1.0.

## Phase 2: Logo and brand assets

- [ ] Get the original logo file from the hotel (SVG, AI, EPS or PDF), and any brand guide.
- [ ] Clean the master logo: full logo, emblem only and wordmark, in colour, white and dark.
- [ ] Launcher icons: Android adaptive (with themed monochrome) and the iOS icon set.
- [ ] Notification icon.
- [ ] Splash screens, light and dark, for Android and iOS.
- [ ] Branded loader animation, and skeleton loading styles.
- [ ] Favicon set, Apple touch icon, web manifest icons and the social sharing image.
- [ ] Store listing graphics.
- [ ] Staff card designs (front and back, NFC and QR) for each card type.
- [ ] Wristband design with number and QR.
- [ ] Receipt headers (58 mm and 80 mm) and invoice letterhead.
- [ ] QR stickers for tables, assets, rooms, exhibits and patrol points.
- [ ] Empty state, error, offline and success illustrations.
- [ ] Approve all assets.
- [ ] Check uniformity: the same logo, colours and type everywhere. See [brand assets](design/brand-assets.md).

## Phase 3: UI sketches (wireframes)

- [ ] Build the screen inventory: every screen of every module, for every role, including the client view. Number every screen.
- [ ] Map the flows from start to end: first open, login, home for each role, each task, and back.
- [ ] Sketch every screen in low detail.
- [ ] Sketch every state of every screen: loading, empty, error, offline, permission denied and success.
- [ ] Sketch every dialog, bottom sheet, toast, confirmation, warning and pop-up.
- [ ] Sketch the super admin builders: role builder, layout editor, form builder and workflow builder.
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
- [ ] Core modules first: Users & Login, Roles & Permissions, App Layout & Navigation, Audit Trail, Super Admin Console.
- [ ] Event bus (Queues and outbox), Notifications, Files & Media.
- [ ] Error tracking with Sentry in the app, web and API.

## Phase 6: Code the UI and connect every screen

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

- [ ] Buy and test the staff cards (NTAG 424 DNA) and the wristbands (NTAG 215/216).
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
