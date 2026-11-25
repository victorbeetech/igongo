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

The system is built from **82 fully independent modules**. No module is a sub-module of another: Payroll is separate from HR records, the Notice Board is separate from Chat, and Receipts are separate from Payments. Modules talk only through APIs and events, so a problem in one never breaks the rest, and each one can be switched off by the super admin. Everything is configured by the super admin, with no code changes.

**[Read the full modules spec](docs/modules/README.md)**, with one file per module covering its features, super admin options, dependencies and events.

| Group | Modules |
| --- | --- |
| Core platform | Super Admin Console, Roles & Permissions, App Layout & Navigation, Users & Login, Audit Trail, Records Archive & Search, Custom Fields, Forms Builder, Workflow & Approvals, Notifications, Files & Media, Languages & Branding, Import/Export & Backup, Integrations Hub, Locations & Departments |
| Identity and access hardware | NFC & QR Staff Cards, Event Wristbands, Devices & Stations, Access Zones, Visitors & Contractors, Key Control |
| Staff | HR Records, Recruitment, Onboarding & Exit, Attendance, Shifts & Rosters, Leave, Payroll, Payslips & Lifetime Earnings, Advances & Loans, Bonuses & Rewards, Staff Meals, Performance, Training, Discipline, Staff Requests & Welfare, Petty Cash |
| Operations | Daily Reports, Inspections, Faults & Maintenance, Asset Register, Tasks, Housekeeping, Laundry, Security & Incidents, Lost & Found, Fleet & Transport, SOPs & Knowledge Base |
| Communication | Notice Board, Chat, Meetings & Minutes, Surveys & Polls, Company Calendar |
| Guests and sales | CRM, Corporate Accounts, Feedback & Complaints, Loyalty, Campaigns, Promotions & Vouchers, Guest Requests, Menus, Food Ordering, Kitchen Display, Tables & Dine-in, Buffet, Delivery & Riders, Room Bookings, Museum, Events & Conferences, Venues & Equipment, Pool, Spa / Humura, Crafts & Bookshop, WhatsApp Concierge, Public Website |
| Money and insight | Prices & Taxes, Payments, Receipts & Invoicing, Cash-up, Accounting Export, Reports & Analytics, APEX Integration |

### Working with APEX
The hotel already uses APEX for rooms. This system **complements APEX and does not replace it**: room availability and bookings sync with APEX through the APEX Integration module.

### Out of scope
Stock management and bar management are not part of this system. Drinks can still be sold as menu items. Event wristbands are **in scope**.

## Tech stack

| Layer | Technology |
| --- | --- |
| Mobile apps | Flutter (Dart), `nfc_manager` for NFC cards |
| Web portal | Next.js, TypeScript, Tailwind CSS, hosted on Cloudflare |
| API | Hono on Cloudflare Workers |
| Database | Neon Postgres, connected through Cloudflare Hyperdrive, with Drizzle ORM |
| File storage | Cloudflare R2 (receipts, report attachments, staff photos) |
| Realtime | Cloudflare Durable Objects (live attendance, order tracking, chat) |
| Auth | Better Auth, with role-based access and two-factor authentication |
| Push notifications | Firebase Cloud Messaging (FCM) |
| SMS | Africa's Talking |
| WhatsApp | Meta WhatsApp Business (Cloud) API |
| Payments | MTN MoMo, Airtel Money, Flutterwave |
| Maps | Google Maps Platform |

## Proposed repository layout

This is planned as a monorepo:

```
igongo/
├── apps/
│   ├── igongo/           # The one Flutter app for everyone (Android + iOS)
│   ├── web/              # Next.js portal for staff, managers and super admin
│   └── site/             # Public website
├── modules/              # One folder per module (API routes, tables, events), fully independent
├── services/
│   └── api/              # Hono API gateway on Cloudflare Workers
│       ├── src/realtime/ # Durable Objects
│       └── src/integrations/ # SMS, WhatsApp, payments, FCM
├── packages/
│   ├── db/               # Drizzle schema and migrations
│   ├── shared/           # Shared TypeScript types and validation
│   └── ui/               # Shared web UI components
├── docs/
│   ├── modules/          # Modules spec, one file per module
│   └── roles/            # Pre-made roles, one file per role
└── README.md
```

## Roles and access

Roles are data that the super admin creates and edits, not code. The system ships with **72 pre-made roles** as starting templates, from the Board of Directors, CEO, Senior Manager and GM, through a manager for every department, down to the gatekeeper, electrician, plumber, waiter, rider and lifeguard, plus the guest and corporate client roles.

**[Read the full roles spec](docs/roles/README.md)**, with one file per role covering its purpose, modules, default permissions, approval limits and home screen tiles.

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

The project runs for **4 weeks**: 2 weeks of build and 2 weeks of testing.

| Week | Phase | Focus |
| --- | --- | --- |
| 1 | Build | Monorepo setup, database schema, auth, role builder and app layout engine, NFC attendance, the Igongo app shell, web portal shell |
| 2 | Build | Daily reports, payroll, staff CRM, food ordering, delivery and rider screens, client bookings and payments, WhatsApp and SMS |
| 3 | Test | Internal testing, on-site NFC testing at the gate and reception, pilot with selected staff, bug fixes |
| 4 | Test | Full staff and guest pilot, management reports, training, App Store and Play Store release, handover |

## Getting started

Setup instructions will be added as each app and service is created.

---

© 2026 Victor Bee Technologies. Built for Igongo Country Hotel & Cultural Centre. All rights reserved.
