# Modules spec

This is the official list of modules for the Igongo Staff & Guest System. Each module has its own file with a summary, features, super admin options, what it depends on, the events it sends, and what happens when it is switched off.

## Rules every module follows

1. **Fully independent.** No module is a sub-module of another. Each one has its own code folder, its own database tables and its own API. Payroll is not part of HR, the Notice Board is not part of Chat, and Receipts are not part of Payments. If one module has a problem, it can be fixed or switched off without breaking the others.
2. **Talks only through APIs and events.** A module never reads another module's tables. It calls the other module's published API, or listens for its events (such as `order.placed` or `attendance.late`). If the other module is off, it skips that step and carries on.
3. **Configured by the super admin, not by code.** Every option, label, form, workflow, price, permission and screen is data. The code is written once, and the hotel changes everything else from the [Super Admin Console](01-super-admin.md).
4. **Permission-aware.** Every screen, action and field is checked against [Roles & Permissions](02-roles-permissions.md). Roles are data that the super admin creates, never code. See the [roles spec](../roles/README.md).
5. **Everything is recorded.** Every action goes to the [Audit Trail](05-audit-trail.md), and nothing is truly deleted. Records stay searchable for years through [Records Archive & Search](06-records-search.md).
6. **QR on everything physical.** Staff cards, wristbands, assets, tables, rooms, exhibits, tickets, receipts and patrol points all carry a QR code. Cards and wristbands also carry NFC.
7. **Works offline where it matters.** Gate clock-in, wristband scans, meal claims, inspections and kitchen tickets keep working with no network and sync later.
8. **One app.** Every module appears inside the single Igongo app and the web portal. Which parts a person sees depends only on their roles. See [How the single app works](#how-the-single-app-works).

## Standard actions

Every feature in every module uses the same permission actions, so the role builder looks the same everywhere: **view, create, edit, approve, delete, export, comment, like**. Each one can be limited to a data scope: everything, own location, own department, own team, assigned to me, or own records.

## How the single app works

- There is **one Flutter app** for everyone: staff, managers, riders, the board and clients. There is no separate staff app, rider app or guest app.
- Everyone uses **the same entry point and login screen**. Accounts are registered through the super admin's rules: staff accounts come from HR, and client accounts are created by sign-up, at the front desk or from a booking, as the super admin allows.
- After login, the app reads the person's roles and **builds their interface** (menus, home tiles and screens) through [App Layout & Navigation](03-app-builder.md). A new role works at once, with no app update.
- **Any staff role can switch to the client view** and see exactly what clients see, then switch back.
- The web portal uses the same roles and the same modules, for work that is easier on a big screen, such as payroll, reports and super admin settings.

## Scope note

Stock management and bar management were removed from the signed scope. Drinks can still be sold as menu items through [Menus & Catalogue](61-menu-catalogue.md) and [Food Ordering](62-food-ordering.md), and the Crafts & Bookshop keeps simple item counts for the shop only. A full stock module can be added later as a separate module without changing any other module.

## The 83 modules

### Core platform

| # | Module | What it does |
| --- | --- | --- |
| 1 | [Super Admin Console](01-super-admin.md) | The control room for the whole system. Everything the hotel will ever want to change, from a module being on or off to the wording of a button, is changed here by the super admin, with no code changes and no app update. |
| 2 | [Roles & Permissions](02-roles-permissions.md) | The role builder. Roles such as Chef, Lifeguard or Board Member are data that the super admin creates, never code. |
| 3 | [App Layout & Navigation](03-app-builder.md) | Builds every screen of the single Igongo app at runtime from the person's roles. |
| 4 | [Users, Accounts & Login](04-users-login.md) | One account system for everyone: staff, riders, managers, board members and clients. |
| 5 | [Audit Trail](05-audit-trail.md) | A permanent, tamper-proof record of every action in every module: who did it, what changed, when, where and from which device. |
| 6 | [Records Archive & Search](06-records-search.md) | One search box over every module, years back. |
| 7 | [Custom Fields](07-custom-fields.md) | Lets the super admin add new fields to any record in any module, such as "Shoe size" on staff, "Dietary needs" on guests or "Allergy note" on orders, with no code. |
| 8 | [Forms & Templates Builder](08-forms-builder.md) | A drag-and-drop builder for every form, checklist and report template in the hotel: daily reports, inspections, fault reports, applications, feedback forms and more. |
| 9 | [Workflow & Approvals](09-workflow-approvals.md) | A builder for every approval chain and process in the hotel: who approves what, in what order, and what happens next. |
| 10 | [Notifications Engine](10-notifications.md) | Delivers every message the system sends, by app push, SMS, WhatsApp, email or in-app inbox, under rules the super admin controls. |
| 11 | [Files & Media](11-files-media.md) | Stores every photo, document, video and voice note in the system on Cloudflare R2, with access control and links to the records they belong to. |
| 12 | [Languages, Wording & Branding](12-languages-wording.md) | Controls every word, label and brand element in every app, so the super admin can rename "Leave" to "Time off" or add Runyankore without a developer. |
| 13 | [Data Import, Export & Backup](13-data-import-export.md) | Moves data in and out of the system safely: importing existing staff lists and spreadsheets, exporting reports, and keeping backups. |
| 14 | [Integrations Hub & Webhooks](14-integrations-hub.md) | One place to connect outside services, such as SMS, WhatsApp, payments, maps and APEX, so no module holds its own keys. |
| 15 | [Locations & Departments](15-locations-departments.md) | The hotel's structure: sites, buildings, departments, teams, cost centres, rooms, outlets and tables. |

### Identity and access hardware

| # | Module | What it does |
| --- | --- | --- |
| 16 | [NFC & QR Staff Cards](16-staff-cards.md) | Designs, prints and controls every ID card: staff, casual, intern, contractor, visitor and board member. |
| 17 | [Event Wristbands](17-wristbands.md) | Manages 3,000 to 5,000 reusable NFC and QR wristbands. |
| 18 | [Devices & Stations](18-devices-stations.md) | A register of every phone, tablet, handheld, card reader, printer and kiosk the hotel uses, and the station each one serves. |
| 19 | [Access Control & Zones](19-access-zones.md) | Defines restricted areas, such as the store, kitchen, server room, VIP area or event hall, and who may enter each one and when, using staff cards, wristbands or QR codes. |
| 20 | [Visitors & Contractors](20-visitor-management.md) | Registers everyone who comes through the gate who is not staff or a booked guest: suppliers, contractors, job applicants, delivery drivers and official visitors. |
| 21 | [Key Control](21-key-control.md) | Tracks physical keys and key cards: store keys, office keys, master keys and vehicle keys. |

### Staff

| # | Module | What it does |
| --- | --- | --- |
| 22 | [HR Staff Records](22-hr-records.md) | The master record for every staff member, from enrolment to exit. |
| 23 | [Recruitment](23-recruitment.md) | Runs hiring, from a department's request for a new person to an accepted offer. |
| 24 | [Onboarding & Exit](24-onboarding-exit.md) | Makes sure every new staff member is set up properly, and every leaver hands back everything and is paid correctly. |
| 25 | [Attendance](25-attendance.md) | Strong, hard-to-cheat attendance. Staff tap their NFC card or scan their QR code at the gate and stations, and the system works out lateness, absence and overtime automatically. |
| 26 | [Shifts & Rosters](26-shifts-rosters.md) | Plans who works when. Rosters set the expected times that attendance is measured against. |
| 27 | [Leave Management](27-leave.md) | Leave requests, balances and approvals, for every leave type the hotel uses. |
| 28 | [Payroll](28-payroll.md) | Calculates and runs pay each period. It reads approved hours from attendance and deductions from advances, but keeps its own records, so a payroll problem never affects HR or attendance. |
| 29 | [Payslips & Lifetime Earnings](29-earnings-statements.md) | Gives every staff member their payslips and a lifetime earnings statement: everything they have earned from Igongo since they joined, even five or ten years back. |
| 30 | [Advances & Loans](30-advances-loans.md) | Salary advances and staff loans, from request to the last deduction. |
| 31 | [Bonuses & Rewards](31-bonuses-rewards.md) | Rewards for staff: cash bonuses, buffet access, vouchers and recognition, each with the reason recorded. |
| 32 | [Staff Meals](32-staff-meals.md) | Daily staff meals claimed with a card tap, with counts for the kitchen and no double claims. |
| 33 | [Performance & Appraisals](33-performance.md) | Sets goals and measures how staff are doing, with regular reviews. |
| 34 | [Training & Certificates](34-training.md) | Tracks training, skills and certificates, including food hygiene, first aid, lifeguard and fire safety. |
| 35 | [Discipline & Cases](35-discipline.md) | A confidential file of incidents, warnings, hearings and outcomes, handled fairly and kept permanently. |
| 36 | [Staff Requests & Welfare](36-staff-welfare.md) | Everyday requests and welfare: uniforms, letters, grievances, welfare contributions and staff support. |
| 37 | [Petty Cash & Expense Claims](37-petty-cash.md) | Controls small cash spending and staff expense claims, with receipts and approvals. |

### Operations

| # | Module | What it does |
| --- | --- | --- |
| 38 | [Daily Reports](38-daily-reports.md) | Each department and staff member files a daily report from a template, and the supervisor signs it off. |
| 39 | [Inspections & Checklists](39-inspections.md) | Daily checkups and audits of rooms, kitchen, pool, grounds, museum, vehicles and safety equipment, with scores and photos. |
| 40 | [Faults & Maintenance](40-faults-maintenance.md) | Anyone can report a fault with a photo, such as "the slasher's stone cracked the door glass". |
| 41 | [Asset Register](41-asset-register.md) | A list of the hotel's equipment and property, each with a QR tag, so anyone can scan it to see its details or report a fault on it. |
| 42 | [Tasks](42-tasks.md) | Assign and track work of any kind, one-off or repeating, between any staff. |
| 43 | [Housekeeping & Room Status](43-housekeeping.md) | Keeps rooms clean and ready: room status, cleaning assignments, minibar and amenity checks. |
| 44 | [Laundry](44-laundry.md) | Tracks hotel linen, staff uniforms and guest laundry orders. |
| 45 | [Security, Patrols & Incidents](45-security-incidents.md) | Guard patrols, incident reports and emergencies across the hotel and cultural centre. |
| 46 | [Lost & Found](46-lost-found.md) | Records items found and claimed, for guests and staff. |
| 47 | [Fleet & Transport](47-fleet-transport.md) | Hotel vehicles, drivers, trips and guest transfers, such as airport or town pickups. |
| 48 | [SOPs & Knowledge Base](48-knowledge-base.md) | The hotel's standard operating procedures, policies, manuals and how-to guides, in one searchable place. |

### Communication

| # | Module | What it does |
| --- | --- | --- |
| 49 | [Notice Board](49-notice-board.md) | Company posts and announcements for all staff or chosen groups. |
| 50 | [Chat](50-chat.md) | Secure messaging between staff: one-to-one, groups and department channels. |
| 51 | [Meetings & Minutes](51-meetings.md) | Plans meetings, records minutes and follows up action items. |
| 52 | [Surveys & Polls](52-surveys-polls.md) | Quick polls and full surveys for staff or guests, such as staff satisfaction or menu ideas. |
| 53 | [Company Calendar](53-company-calendar.md) | One calendar of hotel life: public holidays, events, meetings, training, birthdays and closures. |

### Guests and sales

| # | Module | What it does |
| --- | --- | --- |
| 54 | [CRM: Guest & Client Profiles](54-crm-guests.md) | One profile for every guest and client, across rooms, food, events, museum, pool, spa and shop, so staff know who they are serving. |
| 55 | [Corporate Accounts](55-corporate-accounts.md) | Companies, NGOs, government offices and schools that book often or on credit. |
| 56 | [Feedback, Complaints & Reviews](56-guest-feedback.md) | Collects guest feedback after every service, handles complaints to the end, and tracks reviews. |
| 57 | [Loyalty & Membership](57-loyalty.md) | Rewards returning guests with points, tiers and memberships across every outlet. |
| 58 | [Marketing Campaigns](58-campaigns.md) | Sends targeted offers and news to guests by SMS, WhatsApp, email and push, to people who agreed to receive them. |
| 59 | [Promotions, Vouchers & Gift Cards](59-promotions-vouchers.md) | Promo codes, discounts, vouchers and gift cards that work across outlets. |
| 60 | [Guest Requests & Help Desk](60-guest-requests.md) | Guests ask for anything from the app, WhatsApp or front desk, and the request goes to the right team and is tracked until done. |
| 61 | [Menus & Catalogue](61-menu-catalogue.md) | The master list of everything the kitchen, bars and coffee shops sell, kept separate from ordering so menus can be changed without touching orders. |
| 62 | [Food Ordering](62-food-ordering.md) | Takes every food and drink order, from any channel and of any type: delivery, room service, dine-in, takeaway and pre-order for a set arrival time, such as "fry 1 kg of beef, we arrive at 4 PM". |
| 63 | [Kitchen Display & Production](63-kitchen-display.md) | Shows orders to the kitchen and bar on screens or printers, by station, in the right order and at the right time. |
| 64 | [Tables & Dine-in](64-tables-dinein.md) | Restaurant floor plans, table reservations and the waiter's view of the dining room. |
| 65 | [Buffet Service](65-buffet.md) | Runs buffets for guests, events and staff bonuses: who may eat, how many times, and how many were served. |
| 66 | [Delivery & Riders](66-delivery-riders.md) | Delivers orders to guests on the grounds and in town, with a rider interface in the same Igongo app. |
| 67 | [Room Bookings](67-room-bookings.md) | Lets guests see and book rooms in the app and website. |
| 68 | [Museum & Cultural Visits](68-museum.md) | Tickets, tours and group visits for the Eriijukiro Museum, the cultural village and the monuments. |
| 69 | [Events & Conferences](69-events-conferences.md) | Plans and sells weddings, introductions, conferences, parties and company retreats, from enquiry to the final invoice. |
| 70 | [Venues & Equipment Hire](70-venues-equipment.md) | A shared calendar of halls, gardens, tents, chairs, sound systems and projectors, so nothing is double-booked. |
| 71 | [Swimming Pool](71-pool.md) | Day passes, memberships and safety for the adult and children's pools. |
| 72 | [Spa / Humura](72-spa.md) | Treatments, therapists and appointments for the Humura spa, sauna and steam room. |
| 73 | [Crafts & Bookshop](73-crafts-bookshop.md) | Sells crafts, books and souvenirs at the shop and online. |
| 74 | [WhatsApp Concierge](74-whatsapp-concierge.md) | Guests talk to the hotel on WhatsApp to book, order, ask questions and get help, with a smooth hand-off to a staff member. |
| 75 | [Public Website & Online Booking](75-public-website.md) | The public face of the system on the web: information, booking and ordering for people without the app. |

### Money and insight

| # | Module | What it does |
| --- | --- | --- |
| 76 | [Prices, Taxes & Discounts](76-pricing-tax.md) | The single source of every price, tax and discount rule, so a price changes in one place and every outlet uses it. |
| 77 | [Payments](77-payments.md) | Takes and records every payment, by MTN MoMo, Airtel Money, card, bank and cash, for any module. |
| 78 | [Receipts & Invoicing](78-receipts-invoicing.md) | Produces every receipt, invoice, quote, credit note and statement, in the hotel's brand, numbered correctly and checkable by QR code. |
| 79 | [Cash-up & Reconciliation](79-cash-up.md) | End-of-shift cash-up for every cashier, rider and outlet, with variances flagged. |
| 80 | [Accounting Export](80-accounting-export.md) | Sends sales, payroll, expenses and payments to the hotel's accounting system in the format it needs. |
| 81 | [Reports & Analytics](81-reports-analytics.md) | Dashboards and reports for every module and every level, from a supervisor's shift to the board's quarter. |
| 82 | [APEX Integration](82-apex-integration.md) | Connects the new system to APEX, the hotel's existing system, so the two work together and never conflict. |

### Marketing and growth

| # | Module | What it does |
| --- | --- | --- |
| 83 | [SEO & Online Presence](83-seo-online-presence.md) | Everything that helps people find Igongo online and measures what works: search engines, Google Maps, app stores, social media, booking sites and tracking. |

