# Igongo Staff & Guest System

A staff management and guest experience platform for **Igongo Country Hotel & Cultural Centre**, Biharwe, Mbarara, Uganda.

Built by **Victor Bee Technologies**, Mbarara.

---

## Overview

The system replaces paper registers and scattered spreadsheets with one connected platform for the hotel's staff, guests and management.

- **Staff** clock in and out at the gate and reception with NFC staff cards, file daily department reports, receive messages and view their own pay records.
- **Guests** book rooms, dining and events, pay by mobile money or card, order food to their room, and chat with the concierge on WhatsApp.
- **Management** sees attendance, reports, payroll and bookings in real time, from anywhere.

## One app for everyone

There is **one Flutter app**, the Igongo app, for everyone: the board, the CEO, managers, staff, delivery riders and clients. There is no separate staff app, rider app or guest app.

- **One entry point.** Everyone opens the same app and uses the same login screen. All accounts are registered through the super admin's rules: staff accounts come from HR, and client accounts come from sign-up, the front desk or a booking.
- **A different interface for each role.** After login, the app reads the person's roles and builds their menus, home tiles and screens. A waiter, a rider, the GM and a guest each see a different app.
- **Roles are data, not code.** The super admin creates any role (such as Chef or Lifeguard), sets what it can do and what its app shows, and gives it to people. A new role works at once, with no app update.
- **Client view.** Any staff role can switch to the client view to see exactly what clients see, then switch back.
- **Web portal.** A Next.js portal uses the same accounts, roles and modules, for work that suits a big screen, such as payroll, reports and super admin settings.

| Surface | Platform | Who uses it |
| --- | --- | --- |
| **Igongo app** | Flutter (Android and iOS) | Everyone: staff, managers, riders, board members and clients |
| **Web portal** | Next.js (browser) | Staff, managers, the GM, the board and the hotel super admin |
| **Public website** | Next.js (browser) | Guests booking or ordering without the app |

## Modules

The system is built from **82 fully independent modules**. No module is a sub-module of another: Payroll is separate from HR records, the Notice Board is separate from Chat, and Receipts are separate from Payments. Modules talk only through APIs and events, so a problem in one never breaks the rest, and the super admin can switch each one off. Everything is configured by the super admin, with no code changes.

Each module has its own file in [docs/modules](docs/modules/README.md), with its features, super admin options, dependencies, events, and what happens when it is switched off.

### Core platform

| # | Module | What it does |
| --- | --- | --- |
| 1 | [Super Admin Console](docs/modules/01-super-admin.md) | The control room for the whole system. Everything the hotel will ever want to change, from a module being on or off to the wording of a button, is changed here by the super admin, with no code changes and no app update. |
| 2 | [Roles & Permissions](docs/modules/02-roles-permissions.md) | The role builder. Roles such as Chef, Lifeguard or Board Member are data that the super admin creates, never code. |
| 3 | [App Layout & Navigation](docs/modules/03-app-builder.md) | Builds every screen of the single Igongo app at runtime from the person's roles. |
| 4 | [Users, Accounts & Login](docs/modules/04-users-login.md) | One account system for everyone: staff, riders, managers, board members and clients. |
| 5 | [Audit Trail](docs/modules/05-audit-trail.md) | A permanent, tamper-proof record of every action in every module: who did it, what changed, when, where and from which device. |
| 6 | [Records Archive & Search](docs/modules/06-records-search.md) | One search box over every module, years back. |
| 7 | [Custom Fields](docs/modules/07-custom-fields.md) | Lets the super admin add new fields to any record in any module, such as "Shoe size" on staff, "Dietary needs" on guests or "Allergy note" on orders, with no code. |
| 8 | [Forms & Templates Builder](docs/modules/08-forms-builder.md) | A drag-and-drop builder for every form, checklist and report template in the hotel: daily reports, inspections, fault reports, applications, feedback forms and more. |
| 9 | [Workflow & Approvals](docs/modules/09-workflow-approvals.md) | A builder for every approval chain and process in the hotel: who approves what, in what order, and what happens next. |
| 10 | [Notifications Engine](docs/modules/10-notifications.md) | Delivers every message the system sends, by app push, SMS, WhatsApp, email or in-app inbox, under rules the super admin controls. |
| 11 | [Files & Media](docs/modules/11-files-media.md) | Stores every photo, document, video and voice note in the system on Cloudflare R2, with access control and links to the records they belong to. |
| 12 | [Languages, Wording & Branding](docs/modules/12-languages-wording.md) | Controls every word, label and brand element in every app, so the super admin can rename "Leave" to "Time off" or add Runyankore without a developer. |
| 13 | [Data Import, Export & Backup](docs/modules/13-data-import-export.md) | Moves data in and out of the system safely: importing existing staff lists and spreadsheets, exporting reports, and keeping backups. |
| 14 | [Integrations Hub & Webhooks](docs/modules/14-integrations-hub.md) | One place to connect outside services, such as SMS, WhatsApp, payments, maps and APEX, so no module holds its own keys. |
| 15 | [Locations & Departments](docs/modules/15-locations-departments.md) | The hotel's structure: sites, buildings, departments, teams, cost centres, rooms, outlets and tables. |

### Identity and access hardware

| # | Module | What it does |
| --- | --- | --- |
| 16 | [NFC & QR Staff Cards](docs/modules/16-staff-cards.md) | Issues and controls the staff ID card. Each card has an NFC chip and a printed QR code, and links to the staff member's full profile on the server. |
| 17 | [Event Wristbands](docs/modules/17-wristbands.md) | Manages 3,000 to 5,000 reusable NFC and QR wristbands. |
| 18 | [Devices & Stations](docs/modules/18-devices-stations.md) | A register of every phone, tablet, handheld, card reader, printer and kiosk the hotel uses, and the station each one serves. |
| 19 | [Access Control & Zones](docs/modules/19-access-zones.md) | Defines restricted areas, such as the store, kitchen, server room, VIP area or event hall, and who may enter each one and when, using staff cards, wristbands or QR codes. |
| 20 | [Visitors & Contractors](docs/modules/20-visitor-management.md) | Registers everyone who comes through the gate who is not staff or a booked guest: suppliers, contractors, job applicants, delivery drivers and official visitors. |
| 21 | [Key Control](docs/modules/21-key-control.md) | Tracks physical keys and key cards: store keys, office keys, master keys and vehicle keys. |

### Staff

| # | Module | What it does |
| --- | --- | --- |
| 22 | [HR Staff Records](docs/modules/22-hr-records.md) | The master record for every staff member, from enrolment to exit. |
| 23 | [Recruitment](docs/modules/23-recruitment.md) | Runs hiring, from a department's request for a new person to an accepted offer. |
| 24 | [Onboarding & Exit](docs/modules/24-onboarding-exit.md) | Makes sure every new staff member is set up properly, and every leaver hands back everything and is paid correctly. |
| 25 | [Attendance](docs/modules/25-attendance.md) | Strong, hard-to-cheat attendance. Staff tap their NFC card or scan their QR code at the gate and stations, and the system works out lateness, absence and overtime automatically. |
| 26 | [Shifts & Rosters](docs/modules/26-shifts-rosters.md) | Plans who works when. Rosters set the expected times that attendance is measured against. |
| 27 | [Leave Management](docs/modules/27-leave.md) | Leave requests, balances and approvals, for every leave type the hotel uses. |
| 28 | [Payroll](docs/modules/28-payroll.md) | Calculates and runs pay each period. It reads approved hours from attendance and deductions from advances, but keeps its own records, so a payroll problem never affects HR or attendance. |
| 29 | [Payslips & Lifetime Earnings](docs/modules/29-earnings-statements.md) | Gives every staff member their payslips and a lifetime earnings statement: everything they have earned from Igongo since they joined, even five or ten years back. |
| 30 | [Advances & Loans](docs/modules/30-advances-loans.md) | Salary advances and staff loans, from request to the last deduction. |
| 31 | [Bonuses & Rewards](docs/modules/31-bonuses-rewards.md) | Rewards for staff: cash bonuses, buffet access, vouchers and recognition, each with the reason recorded. |
| 32 | [Staff Meals](docs/modules/32-staff-meals.md) | Daily staff meals claimed with a card tap, with counts for the kitchen and no double claims. |
| 33 | [Performance & Appraisals](docs/modules/33-performance.md) | Sets goals and measures how staff are doing, with regular reviews. |
| 34 | [Training & Certificates](docs/modules/34-training.md) | Tracks training, skills and certificates, including food hygiene, first aid, lifeguard and fire safety. |
| 35 | [Discipline & Cases](docs/modules/35-discipline.md) | A confidential file of incidents, warnings, hearings and outcomes, handled fairly and kept permanently. |
| 36 | [Staff Requests & Welfare](docs/modules/36-staff-welfare.md) | Everyday requests and welfare: uniforms, letters, grievances, welfare contributions and staff support. |
| 37 | [Petty Cash & Expense Claims](docs/modules/37-petty-cash.md) | Controls small cash spending and staff expense claims, with receipts and approvals. |

### Operations

| # | Module | What it does |
| --- | --- | --- |
| 38 | [Daily Reports](docs/modules/38-daily-reports.md) | Each department and staff member files a daily report from a template, and the supervisor signs it off. |
| 39 | [Inspections & Checklists](docs/modules/39-inspections.md) | Daily checkups and audits of rooms, kitchen, pool, grounds, museum, vehicles and safety equipment, with scores and photos. |
| 40 | [Faults & Maintenance](docs/modules/40-faults-maintenance.md) | Anyone can report a fault with a photo, such as "the slasher's stone cracked the door glass". |
| 41 | [Asset Register](docs/modules/41-asset-register.md) | A list of the hotel's equipment and property, each with a QR tag, so anyone can scan it to see its details or report a fault on it. |
| 42 | [Tasks](docs/modules/42-tasks.md) | Assign and track work of any kind, one-off or repeating, between any staff. |
| 43 | [Housekeeping & Room Status](docs/modules/43-housekeeping.md) | Keeps rooms clean and ready: room status, cleaning assignments, minibar and amenity checks. |
| 44 | [Laundry](docs/modules/44-laundry.md) | Tracks hotel linen, staff uniforms and guest laundry orders. |
| 45 | [Security, Patrols & Incidents](docs/modules/45-security-incidents.md) | Guard patrols, incident reports and emergencies across the hotel and cultural centre. |
| 46 | [Lost & Found](docs/modules/46-lost-found.md) | Records items found and claimed, for guests and staff. |
| 47 | [Fleet & Transport](docs/modules/47-fleet-transport.md) | Hotel vehicles, drivers, trips and guest transfers, such as airport or town pickups. |
| 48 | [SOPs & Knowledge Base](docs/modules/48-knowledge-base.md) | The hotel's standard operating procedures, policies, manuals and how-to guides, in one searchable place. |

### Communication

| # | Module | What it does |
| --- | --- | --- |
| 49 | [Notice Board](docs/modules/49-notice-board.md) | Company posts and announcements for all staff or chosen groups. |
| 50 | [Chat](docs/modules/50-chat.md) | Secure messaging between staff: one-to-one, groups and department channels. |
| 51 | [Meetings & Minutes](docs/modules/51-meetings.md) | Plans meetings, records minutes and follows up action items. |
| 52 | [Surveys & Polls](docs/modules/52-surveys-polls.md) | Quick polls and full surveys for staff or guests, such as staff satisfaction or menu ideas. |
| 53 | [Company Calendar](docs/modules/53-company-calendar.md) | One calendar of hotel life: public holidays, events, meetings, training, birthdays and closures. |

### Guests and sales

| # | Module | What it does |
| --- | --- | --- |
| 54 | [CRM: Guest & Client Profiles](docs/modules/54-crm-guests.md) | One profile for every guest and client, across rooms, food, events, museum, pool, spa and shop, so staff know who they are serving. |
| 55 | [Corporate Accounts](docs/modules/55-corporate-accounts.md) | Companies, NGOs, government offices and schools that book often or on credit. |
| 56 | [Feedback, Complaints & Reviews](docs/modules/56-guest-feedback.md) | Collects guest feedback after every service, handles complaints to the end, and tracks reviews. |
| 57 | [Loyalty & Membership](docs/modules/57-loyalty.md) | Rewards returning guests with points, tiers and memberships across every outlet. |
| 58 | [Marketing Campaigns](docs/modules/58-campaigns.md) | Sends targeted offers and news to guests by SMS, WhatsApp, email and push, to people who agreed to receive them. |
| 59 | [Promotions, Vouchers & Gift Cards](docs/modules/59-promotions-vouchers.md) | Promo codes, discounts, vouchers and gift cards that work across outlets. |
| 60 | [Guest Requests & Help Desk](docs/modules/60-guest-requests.md) | Guests ask for anything from the app, WhatsApp or front desk, and the request goes to the right team and is tracked until done. |
| 61 | [Menus & Catalogue](docs/modules/61-menu-catalogue.md) | The master list of everything the kitchen, bars and coffee shops sell, kept separate from ordering so menus can be changed without touching orders. |
| 62 | [Food Ordering](docs/modules/62-food-ordering.md) | Takes every food and drink order, from any channel and of any type: delivery, room service, dine-in, takeaway and pre-order for a set arrival time, such as "fry 1 kg of beef, we arrive at 4 PM". |
| 63 | [Kitchen Display & Production](docs/modules/63-kitchen-display.md) | Shows orders to the kitchen and bar on screens or printers, by station, in the right order and at the right time. |
| 64 | [Tables & Dine-in](docs/modules/64-tables-dinein.md) | Restaurant floor plans, table reservations and the waiter's view of the dining room. |
| 65 | [Buffet Service](docs/modules/65-buffet.md) | Runs buffets for guests, events and staff bonuses: who may eat, how many times, and how many were served. |
| 66 | [Delivery & Riders](docs/modules/66-delivery-riders.md) | Delivers orders to guests on the grounds and in town, with a rider interface in the same Igongo app. |
| 67 | [Room Bookings](docs/modules/67-room-bookings.md) | Lets guests see and book rooms in the app and website. |
| 68 | [Museum & Cultural Visits](docs/modules/68-museum.md) | Tickets, tours and group visits for the Eriijukiro Museum, the cultural village and the monuments. |
| 69 | [Events & Conferences](docs/modules/69-events-conferences.md) | Plans and sells weddings, introductions, conferences, parties and company retreats, from enquiry to the final invoice. |
| 70 | [Venues & Equipment Hire](docs/modules/70-venues-equipment.md) | A shared calendar of halls, gardens, tents, chairs, sound systems and projectors, so nothing is double-booked. |
| 71 | [Swimming Pool](docs/modules/71-pool.md) | Day passes, memberships and safety for the adult and children's pools. |
| 72 | [Spa / Humura](docs/modules/72-spa.md) | Treatments, therapists and appointments for the Humura spa, sauna and steam room. |
| 73 | [Crafts & Bookshop](docs/modules/73-crafts-bookshop.md) | Sells crafts, books and souvenirs at the shop and online. |
| 74 | [WhatsApp Concierge](docs/modules/74-whatsapp-concierge.md) | Guests talk to the hotel on WhatsApp to book, order, ask questions and get help, with a smooth hand-off to a staff member. |
| 75 | [Public Website & Online Booking](docs/modules/75-public-website.md) | The public face of the system on the web: information, booking and ordering for people without the app. |

### Money and insight

| # | Module | What it does |
| --- | --- | --- |
| 76 | [Prices, Taxes & Discounts](docs/modules/76-pricing-tax.md) | The single source of every price, tax and discount rule, so a price changes in one place and every outlet uses it. |
| 77 | [Payments](docs/modules/77-payments.md) | Takes and records every payment, by MTN MoMo, Airtel Money, card, bank and cash, for any module. |
| 78 | [Receipts & Invoicing](docs/modules/78-receipts-invoicing.md) | Produces every receipt, invoice, quote, credit note and statement, in the hotel's brand, numbered correctly and checkable by QR code. |
| 79 | [Cash-up & Reconciliation](docs/modules/79-cash-up.md) | End-of-shift cash-up for every cashier, rider and outlet, with variances flagged. |
| 80 | [Accounting Export](docs/modules/80-accounting-export.md) | Sends sales, payroll, expenses and payments to the hotel's accounting system in the format it needs. |
| 81 | [Reports & Analytics](docs/modules/81-reports-analytics.md) | Dashboards and reports for every module and every level, from a supervisor's shift to the board's quarter. |
| 82 | [APEX Integration](docs/modules/82-apex-integration.md) | Connects the new system to APEX, the hotel's existing system, so the two work together and never conflict. |

### Working with APEX
The hotel already uses APEX for rooms. This system **complements APEX and does not replace it**: room availability and bookings sync with APEX through the APEX Integration module.

### Out of scope
Stock management and bar management are not part of this system. Drinks can still be sold as menu items. Event wristbands are **in scope**.

## Tech stack

The stack was reviewed against the requirements, and the changes are explained in [docs/architecture/stack.md](docs/architecture/stack.md).

| Layer | Technology |
| --- | --- |
| The Igongo app | Flutter (Dart), Material 3, Riverpod, go_router, Drift (offline SQLite), nfc_manager, mobile_scanner, local_auth |
| Server-driven UI | Each role's menus, home tiles and screens are sent to the app as JSON, so new roles need no app update |
| Web portal and website | Next.js, TypeScript, Tailwind CSS and shadcn/ui, on Cloudflare (OpenNext) |
| API | Hono on Cloudflare Workers, a gateway plus one router per module, Zod and OpenAPI |
| Database | Neon Postgres through Hyperdrive, Drizzle ORM, one schema per module |
| Events between modules | Cloudflare Queues, with an outbox in each module |
| Long processes and schedules | Cloudflare Workflows and Cron Triggers |
| Realtime | Durable Objects (attendance board, kitchen display, rider tracking, chat) |
| Permissions and config cache | Workers KV |
| Files | Cloudflare R2 and Cloudflare Images |
| Audit trail | Append-only log with a hash chain, archived to R2 with Bucket Locks |
| Search | Postgres full-text search and pg_trgm |
| PDFs | Cloudflare Browser Rendering |
| Auth | Better Auth: phone OTP, password, PIN, card tap, Google and Apple, 2FA |
| Cards and wristbands | NTAG 424 DNA staff cards (copy-proof), NTAG 215/216 wristbands (rewritable) |
| Messaging | FCM push, Africa's Talking SMS, Meta WhatsApp Cloud API, Resend email |
| Payments | MTN MoMo, Airtel Money and Flutterwave |
| Maps | Google Maps Platform |
| Errors | Sentry |
| Tooling | pnpm, Turborepo, Melos, GitHub Actions with warnings as errors |

## Repository layout

A monorepo with clean architecture. **Every module, however small, has its own folder**, and shared code lives in its own separate packages. See the [code standards](docs/architecture/code-standards.md).

```
igongo/
├── apps/
│   ├── igongo/                 # The one Flutter app for everyone (Android + iOS)
│   │   └── lib/
│   │       ├── app/            # Start-up, routing from roles, client view switch
│   │       ├── shared/         # Reusable widgets, theme, offline sync (one folder each)
│   │       └── modules/
│   │           └── <module>/   # One folder per module: domain, application, data, presentation
│   ├── web/                    # Next.js portal for staff, managers and super admin
│   │   └── src/modules/<module>/
│   └── site/                   # Public website
├── modules/
│   └── <module>/               # One folder per module in the API
│       ├── domain/             # Entities and business rules
│       ├── application/        # Use cases, one per file
│       ├── infrastructure/     # Database tables, repositories, queue and API adapters
│       ├── presentation/       # Hono routes
│       └── test/
├── services/
│   └── gateway/                # Hono API gateway on Cloudflare Workers
├── packages/
│   ├── core/                   # Results, errors, IDs, money, dates, logger
│   ├── contracts/<module>/     # Each module's public API types and events
│   ├── design-tokens/          # Colours, fonts, text sizes, spacing
│   ├── brand/                  # Logo, icons, splash and print assets
│   └── ui-web/                 # Reusable web components, one folder each
├── docs/
│   ├── BUILD-CHECKLIST.md      # The start-to-end checklist
│   ├── architecture/           # Stack and code standards
│   ├── design/                 # Theme and brand assets
│   ├── modules/                # Modules spec, one file per module
│   └── roles/                  # Pre-made roles, one file per role
├── CLAUDE.md
└── README.md
```

## Code standards

These are required for all code, even when a task doesn't repeat them. The details are in [docs/architecture/code-standards.md](docs/architecture/code-standards.md).

- **Clean architecture**: domain, application, infrastructure and presentation layers in every module.
- **Nothing mixed**: every module has its own folder, and modules use each other only through their public contracts.
- **Reusable**: shared code lives in separate, clean packages and is reused, never copied.
- **Small**: as little code as the job needs, with one responsibility per file.
- **Commented**: every file, every public function and every step of every process.
- **Zero warnings**: warnings are treated as errors, and every loading, empty, error, offline and denied state, dialog and toast is handled.
- **One look**: colours, text sizes and logos come only from the design tokens and the brand package.

## Design

- [Theme](docs/design/theme.md): Igongo red, terracotta, gold and cream, with Playfair Display and Inter. Text is small by default, and each person can choose a text size from Compact to Extra large.
- [Brand assets](docs/design/brand-assets.md): every icon, splash, favicon, loader, card and print design made from the official logo.

## Roles and access

Roles are data that the super admin creates and edits, not code. The system ships with **72 pre-made roles** as starting templates. Each one has its own file in [docs/roles](docs/roles/README.md), with its purpose, modules, default permissions, approval limits and home screen tiles. Approval limits use tiers (Tier 1, 2, 3 and Unlimited), and the super admin sets the amount for each tier.

### System

| Role | Purpose |
| --- | --- |
| [Super Admin](docs/roles/super-admin.md) | Controls and configures the whole system: modules, roles, permissions, screens, forms, workflows, prices, wording and integrations. |
| [Internal Auditor](docs/roles/system-auditor.md) | Reviews records, the audit trail and money flows across all modules without being able to change anything. |

### Leadership

| Role | Purpose |
| --- | --- |
| [Board of Directors](docs/roles/board-of-directors.md) | Oversees the hotel at the highest level with summary reports, board papers and big decisions, including members who represent the shareholders. |
| [Chief Executive Officer](docs/roles/ceo.md) | Leads the whole business, sets direction, and approves the largest decisions below the board. |
| [Senior Manager](docs/roles/senior-manager.md) | Runs a group of departments for the CEO, such as all guest services or all support services, and steps in for the GM when needed. |
| [General Manager (GM)](docs/roles/general-manager.md) | Runs the hotel every day: staff, guests, operations and money. |
| [Assistant General Manager](docs/roles/assistant-gm.md) | Supports the GM and runs the hotel when the GM is away. |

### Department managers

| Role | Purpose |
| --- | --- |
| [Restaurant & F&B Manager](docs/roles/fnb-manager.md) | Runs the restaurants, bars, coffee shops, room service and buffets: menus, service quality, staff and sales. |
| [Executive Chef (Kitchen Head)](docs/roles/executive-chef.md) | Leads the kitchen: menus, food quality, hygiene, prep planning, kitchen staff and food waste. |
| [Events & Conferences Manager](docs/roles/events-manager.md) | Sells and runs weddings, conferences, parties and retreats, from enquiry to post-event report, including wristbands. |
| [Museum & Cultural Centre Manager](docs/roles/museum-manager.md) | Runs the Eriijukiro Museum, the cultural village, tours, performances and school visits. |
| [Front Office Manager](docs/roles/front-office-manager.md) | Runs reception, reservations, guest relations, concierge and porters, working alongside APEX. |
| [Executive Housekeeper](docs/roles/housekeeping-manager.md) | Keeps every room and public area clean, inspected and ready, and runs laundry. |
| [Pool Supervisor](docs/roles/pool-manager.md) | Runs the pools safely: passes, memberships, lifeguards, water quality and lessons. |
| [Spa Manager (Humura)](docs/roles/spa-manager.md) | Runs the Humura spa: treatments, therapists, bookings and memberships. |
| [Crafts & Bookshop Manager](docs/roles/crafts-manager.md) | Runs the craft shop and bookshop: products, artisans, sales and online orders. |
| [Security Manager](docs/roles/security-manager.md) | Keeps people and property safe: gates, guards, patrols, zones, visitors, keys and incidents. |
| [Maintenance Manager (Chief Engineer)](docs/roles/maintenance-manager.md) | Keeps the buildings, power, water, plumbing, equipment and vehicles working, and plans preventive maintenance. |
| [HR Manager](docs/roles/hr-manager.md) | Runs everything about people: enrolment, contracts, attendance rules, leave, training, discipline, welfare and exits. |
| [Finance & Accounts Manager](docs/roles/finance-manager.md) | Controls money: payments, receipts, cash-ups, petty cash, payroll review, accounting exports and credit accounts. |
| [IT Manager](docs/roles/it-manager.md) | Looks after devices, networks, cards and printers, and supports the super admin. |
| [Sales & Marketing Manager](docs/roles/sales-marketing-manager.md) | Brings in business: corporate clients, packages, campaigns, promotions, website content and reviews. |
| [Delivery & Transport Manager](docs/roles/logistics-manager.md) | Runs food delivery, riders, dispatch, hotel vehicles and guest transfers. |

### Supervisors and officers

| Role | Purpose |
| --- | --- |
| [Department Supervisor (template)](docs/roles/department-supervisor.md) | A starting point for any shift or section supervisor. |
| [Sous Chef](docs/roles/sous-chef.md) | Runs the kitchen on a shift and stands in for the Executive Chef. |
| [Restaurant Supervisor](docs/roles/restaurant-supervisor.md) | Runs the dining room on a shift: tables, waiters, voids and guest issues. |
| [Housekeeping Supervisor](docs/roles/housekeeping-supervisor.md) | Assigns rooms to attendants and inspects rooms before they are released. |
| [Security Supervisor](docs/roles/security-supervisor.md) | Runs a security shift: guards, patrols, gate and incidents. |
| [Events Coordinator](docs/roles/events-coordinator.md) | Runs individual events on the day: setup, run sheet, wristbands, guest list and teams. |
| [HR Officer](docs/roles/hr-officer.md) | Does daily HR work: enrolling staff, documents, cards, leave records and attendance corrections. |
| [Payroll Officer](docs/roles/payroll-officer.md) | Prepares payroll, advances and statements, for review and approval by others. |
| [Accountant](docs/roles/accountant.md) | Records and checks money: receipts, invoices, credit accounts, petty cash and exports. |
| [Reservations Officer](docs/roles/reservations-officer.md) | Handles room, table, museum, pool, spa and event bookings from all channels. |
| [Guest Relations Officer](docs/roles/guest-relations-officer.md) | Looks after guests' happiness: VIPs, feedback, complaints and loyalty. |
| [IT Support Officer](docs/roles/it-support.md) | Sets up devices and printers, prints cards and helps staff with app problems. |
| [Delivery Dispatcher](docs/roles/dispatcher.md) | Assigns deliveries to riders and watches them until delivered. |
| [Sales Executive](docs/roles/sales-executive.md) | Finds and looks after corporate, event and group clients. |

### Everyone

| Role | Purpose |
| --- | --- |
| [Every Staff Member (base role)](docs/roles/staff-base.md) | The base role that every staff account gets automatically. |

### Frontline staff

| Role | Purpose |
| --- | --- |
| [Receptionist](docs/roles/receptionist.md) | Welcomes guests, handles front desk requests, registers walk-in clients and visitors, and takes payments at reception. |
| [Concierge Agent (WhatsApp and chat)](docs/roles/concierge-agent.md) | Answers guests on WhatsApp and in-app chat, books and orders for them, and passes requests to departments. |
| [Porter / Bell Attendant](docs/roles/porter.md) | Carries luggage, escorts guests and handles small guest requests. |
| [Room Attendant](docs/roles/room-attendant.md) | Cleans and prepares guest rooms and updates each room's status. |
| [Cleaner (public areas)](docs/roles/cleaner.md) | Cleans public areas, offices, washrooms and grounds paths on a schedule. |
| [Laundry Attendant](docs/roles/laundry-attendant.md) | Washes linen, uniforms and guest laundry, and keeps linen counts. |
| [Chef (Chef de Partie)](docs/roles/chef.md) | Runs a kitchen station, such as grill or pastry, and prepares orders from the kitchen display. |
| [Cook](docs/roles/cook.md) | Prepares food, including staff meals and buffets, following the kitchen display and production lists. |
| [Kitchen Steward](docs/roles/kitchen-steward.md) | Keeps the kitchen, dishes and equipment clean and reports broken equipment. |
| [Waiter / Waitress](docs/roles/waiter.md) | Serves guests at tables, by the pool and at events, taking orders and payments on their phone. |
| [Bartender](docs/roles/bartender.md) | Prepares and sells drinks at the bars, which are sold as menu items. |
| [Barista](docs/roles/barista.md) | Makes and sells coffee and snacks at the coffee shops. |
| [Cashier](docs/roles/cashier.md) | Takes payments at an outlet, issues receipts and does the end-of-shift cash-up. |
| [Delivery Rider](docs/roles/delivery-rider.md) | Picks up orders from the kitchen and delivers them, using the rider screens in the same Igongo app. |
| [Driver](docs/roles/driver.md) | Drives hotel vehicles for guest transfers, staff and errands. |
| [Gatekeeper](docs/roles/gatekeeper.md) | Controls the main gate: staff clock-in station, visitors, vehicles and deliveries. |
| [Security Guard](docs/roles/security-guard.md) | Patrols the grounds, guards zones and events, and reports incidents. |
| [Electrician](docs/roles/electrician.md) | Fixes and maintains power, lighting, the generator and electrical equipment. |
| [Plumber](docs/roles/plumber.md) | Fixes leaks, drains, taps, toilets and pipework. |
| [Water Systems Technician](docs/roles/water-technician.md) | Looks after water supply, tanks, pumps, boreholes, water treatment and the pool plant. |
| [Carpenter](docs/roles/carpenter.md) | Repairs doors, windows, furniture and wooden structures. |
| [General Maintenance Technician](docs/roles/maintenance-technician.md) | Handles general repairs, painting, glass, AC and anything not covered by a specialist. |
| [Groundskeeper / Gardener](docs/roles/groundskeeper.md) | Keeps the gardens, lawns, compound and cultural village grounds tidy. |
| [Lifeguard](docs/roles/lifeguard.md) | Keeps swimmers safe, checks entries and records water tests and incidents. |
| [Spa Therapist](docs/roles/spa-therapist.md) | Gives treatments and keeps the treatment rooms ready. |
| [Museum Guide](docs/roles/museum-guide.md) | Leads tours of the museum, cultural village and monuments, and checks tickets. |
| [Cultural Performer](docs/roles/cultural-performer.md) | Performs dance, music and cultural experiences for guests and events. |
| [Shop Attendant](docs/roles/shop-attendant.md) | Sells crafts, books and souvenirs and packs online orders. |
| [Store Keeper](docs/roles/store-keeper.md) | Keeps the stores: issues assets, uniforms and linen, and signs keys and equipment in and out. |
| [Casual Worker](docs/roles/casual-worker.md) | A short-term or daily worker, such as extra event staff. |
| [Intern / Trainee](docs/roles/intern.md) | A learner placed in a department, with view access to their department's work and their training plan. |

### Guests and clients

| Role | Purpose |
| --- | --- |
| [Guest / Client](docs/roles/guest.md) | Any visitor or customer: hotel guests, diners, museum visitors, swimmers, spa clients, shoppers and event guests. |
| [Corporate Booker](docs/roles/corporate-client.md) | A person who books for a company, NGO, government office or school, using the company's account and agreed terms. |
| [Event Client / Organiser](docs/roles/event-organiser.md) | The client who booked an event, such as a wedding or conference, who manages their own guest list and follows the plan. |

## Security

This system handles staff personal data, payroll and guest payments, so it is treated as sensitive.

- **No secrets in this repository.** API keys, database URLs and payment credentials are stored as Cloudflare secrets and local `.env` files, which are never committed.
- **Role-based access control** on every API route, with payroll visible by default only to the GM and payroll staff.
- **Two-factor authentication** for admin, GM and supervisor accounts.
- **Encryption** in transit (HTTPS everywhere) and at rest (Neon and R2).
- **Audit log** of sensitive actions, such as payroll changes, advance approvals and role changes.
- **NFC card security**: cards hold an identifier only, checked against the server. Lost cards can be disabled instantly.
- **Payment callbacks** are verified with signatures before any booking or order is marked paid.
- Personal data is handled in line with Uganda's **Data Protection and Privacy Act, 2019**.

## Roadmap

The work follows the [build checklist](docs/BUILD-CHECKLIST.md), in order, with an approval at the end of each phase:

0. Scope and plan
1. Theme
2. Logo and brand assets
3. UI sketches of every screen
4. Branded designs
5. Foundation code
6. Code the UI and connect every screen
7. Build the modules
8. Integrations
9. Hardware
10. Data and setup
11. Testing
12. Training and launch

## Getting started

Setup instructions will be added as each app and service is created.

---

© 2026 Victor Bee Technologies. Built for Igongo Country Hotel & Cultural Centre. All rights reserved.
