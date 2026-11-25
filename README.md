# Igongo Staff & Guest System

A staff management and guest experience platform for **Igongo Country Hotel & Cultural Centre**, Biharwe, Mbarara, Uganda.

Built by **Victor Bee Technologies**, Mbarara.

---

## Overview

The system replaces paper registers and scattered spreadsheets with one connected platform for the hotel's staff, guests and management.

- **Staff** clock in and out at the gate and reception with NFC staff cards, file daily department reports, receive messages and view their own pay records.
- **Guests** book rooms, dining and events, pay by mobile money or card, order food to their room, and chat with the concierge on WhatsApp.
- **Management** sees attendance, reports, payroll and bookings in real time, from anywhere.

## Apps

| App | Platform | Users |
| --- | --- | --- |
| **Guest app** | Flutter (Android and iOS) | Hotel guests and visitors |
| **Staff app** | Flutter (Android and iOS) | All staff, supervisors and delivery riders |
| **Web portal** | Next.js (browser) | Staff, department heads, the GM and the hotel super admin |

## Modules

### 1. NFC staff cards and attendance
- Each staff member gets an NFC card linked to their profile.
- Clock-in and clock-out points at the **main gate** and **reception**.
- Late arrivals, absences and overtime are recorded automatically.
- Live "who is on site" view for management and security.

### 2. Daily department reports
- Each department submits a daily report from the staff app or the web.
- Supervisors review and **sign off** on each report.
- Reports are archived and searchable by date and department.

### 3. Payroll
- Payroll is calculated from attendance records.
- **Salary advances**, with requests, approval and automatic deduction.
- **Salary bonuses** and **one-time buffet bonuses**.
- Payslips for each staff member.
- Full payroll data is **visible to the GM only**.

### 4. Staff CRM
- Staff profiles, departments and roles.
- Direct and group messaging.
- Meeting scheduling and **minutes**, with action items.
- Announcements with push and SMS delivery.

### 5. Food delivery
- Guests order from the menu in the guest app.
- The **kitchen** receives, prepares and marks orders ready.
- **Riders** pick up and deliver, with live tracking on a map.
- Order status updates for the guest at each step.

### 6. Guest experience
- Room **bookings** and availability.
- **Payments** by MTN MoMo, Airtel Money and card, with digital **receipts**.
- **WhatsApp concierge** for questions and requests.
- **Eriijukiro Museum** and cultural centre information and tours.
- **Dining**: restaurants, menus and table reservations.
- **Humura** information and bookings.
- **Events**: listings, bookings and enquiries.

### 7. Management reports
- Dashboards for attendance, department reports, payroll, bookings, orders and revenue.
- Export to PDF and spreadsheet.
- Role-based views for the GM, department heads and super admin.

### Out of scope
The following were removed from scope and are **not** part of this system: guest wristbands, stock management and bar management.

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
│   ├── guest/            # Flutter guest app (Android + iOS)
│   ├── staff/            # Flutter staff + rider app (Android + iOS)
│   └── web/              # Next.js portal for staff, GM and super admin
├── services/
│   └── api/              # Hono API on Cloudflare Workers
│       ├── src/routes/   # attendance, reports, payroll, crm, orders, bookings, payments
│       ├── src/realtime/ # Durable Objects
│       └── src/integrations/ # SMS, WhatsApp, payments, FCM
├── packages/
│   ├── db/               # Drizzle schema and migrations
│   ├── shared/           # Shared TypeScript types and validation
│   └── ui/               # Shared web UI components
├── docs/                 # Architecture, API and user guides
└── README.md
```

## Roles and access

| Role | Access |
| --- | --- |
| Super admin | Full system configuration, users and roles |
| GM | All modules, including payroll |
| Department head / supervisor | Their department's staff, attendance and report sign-off |
| Staff | Own attendance, reports, messages and payslips |
| Kitchen | Incoming food orders |
| Rider | Assigned deliveries |
| Guest | Own bookings, orders, payments and receipts |

## Security

This system handles staff personal data, payroll and guest payments, so it is treated as sensitive.

- **No secrets in this repository.** API keys, database URLs and payment credentials are stored as Cloudflare secrets and local `.env` files, which are never committed.
- **Role-based access control** on every API route, with payroll restricted to the GM.
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
| 1 | Build | Monorepo setup, database schema, auth and roles, NFC attendance, staff app core, web portal shell |
| 2 | Build | Daily reports, payroll, staff CRM, food delivery and rider flow, guest app bookings and payments, WhatsApp and SMS |
| 3 | Test | Internal testing, on-site NFC testing at the gate and reception, pilot with selected staff, bug fixes |
| 4 | Test | Full staff and guest pilot, management reports, training, App Store and Play Store release, handover |

## Getting started

Setup instructions will be added as each app and service is created.

---

© 2026 Victor Bee Technologies. Built for Igongo Country Hotel & Cultural Centre. All rights reserved.
