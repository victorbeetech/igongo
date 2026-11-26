# What the phone app shows with live data (honest table)

Updated 26 Nov 2026. Made from the app's own screen list, so it matches the code.

**How the app behaves now**

- Signed out: the welcome screen once, then the guest home. Anyone can browse rooms, food, museum, events, pool, spa and the shop without an account. Booking and ordering ask to sign in.
- Sign in: email and password, for real, against the live API. New guests create an account on "Create your account" (name, email, password, privacy consent). Every new account is a guest account.
- A guest lands on the guest home: Book a room, Order food, Book a table, Museum and tours, Events, Pool passes, Spa, Shop, My bookings and orders, Chat with us, My receipts, My points. The bottom bar is Home, My bookings, Me.
- Staff screens show only for an account the super admin has matched to a staff record, and only the tiles of that person's role.
- "Me": name, email, guest or staff account, theme, text size, sign out, delete my account (guests).
- No demo data reaches a real account. A screen that is not connected yet says "… is not in the app yet" instead of showing sample records. The sample screens are only in the super admin's Preview panel, behind the "Design preview" switch, which is off by default.
- There is no role switch, no "client view" and no prototype buttons.

**Not wired yet in the app (being done next, in this order)**

1. Google and Apple sign-in inside the app (they work on the web portal). They need the Google and Apple app sign-in set-up.
2. The guest tiles not live yet: Chat with us. Everything else on the guest home is live.
3. Staff screens listed below, module by module.
4. Search, Alerts inbox, phone-code sign-in, PIN and fingerprint sign-in, offline sync.

**Per module**

| Module | Screens in the app | Live data | Not wired yet (shows "not in the app yet") |
|---|---|---|---|
| 00 App shell and shared screens | 45 | 8 | Language picker, Sign in with Google, Sign in with Apple, Verify email, Link sign-in methods, Phone number entry, OTP code entry, Password entry, PIN entry, Tap card to sign in, Biometric unlock, Two-factor check, Forgot password, Role switcher, Panic button, Global search, Search results, Everything about, Notification inbox, Notification detail, Approvals inbox, Settings, Notification preferences, Active sessions, Help and support, About, Offline banner, Sync status |
| 02 Roles & Permissions | 1 | 0 | View as role |
| 03 App Layout & Navigation | 1 | 0 | Layout preview |
| 04 Users, Accounts & Login | 1 | 0 | My data |
| 05 Audit Trail | 1 | 0 | Record timeline |
| 06 Records Archive & Search | 1 | 0 | Saved searches |
| 08 Forms & Templates Builder | 3 | 2 | Form preview |
| 09 Workflow & Approvals | 2 | 2 | - |
| 11 Files & Media | 1 | 0 | File viewer |
| 13 Data Import, Export & Backup | 1 | 1 | - |
| 15 Locations & Departments | 1 | 1 | - |
| 16 NFC & QR Staff Cards | 11 | 1 | Cards list, Card detail, Issue card, Encode card, Test card, Who owns this card, Unassigned card, Reset card, Card requests |
| 17 Event Wristbands | 5 | 0 | Register bands, Event bands, Assign range, Band scanner, Band detail |
| 18 Devices & Stations | 2 | 2 | - |
| 19 Access Control & Zones | 3 | 3 | - |
| 20 Visitors & Contractors | 6 | 6 | - |
| 21 Key Control | 5 | 5 | - |
| 22 HR Staff Records | 5 | 1 | Staff directory, Staff profile, Staff documents, Job history |
| 23 Recruitment | 2 | 2 | - |
| 24 Onboarding & Exit | 4 | 4 | - |
| 25 Attendance | 8 | 2 | Attendance today, On site now, Attendance detail, Corrections, Overtime |
| 26 Shifts & Rosters | 4 | 4 | - |
| 27 Leave Management | 4 | 4 | - |
| 29 Payslips & Lifetime Earnings | 4 | 2 | Payslip, Earnings statement |
| 30 Advances & Loans | 4 | 1 | Request advance, Advance requests, Loan detail |
| 31 Bonuses & Rewards | 4 | 1 | Give reward, Rewards list, Buffet passes |
| 32 Staff Meals | 5 | 1 | Claim meal, Canteen screen, Meals today, Meal forecast |
| 33 Performance & Appraisals | 3 | 3 | - |
| 34 Training & Certificates | 5 | 5 | - |
| 35 Discipline & Cases | 1 | 1 | - |
| 36 Staff Requests & Welfare | 3 | 3 | - |
| 37 Petty Cash & Expense Claims | 5 | 5 | - |
| 38 Daily Reports | 7 | 2 | Reports to sign, Executive reports, Department reports, Report detail, Missing reports |
| 39 Inspections & Checklists | 4 | 1 | Run inspection, Inspections list |
| 40 Faults & Maintenance | 5 | 2 | Fault board, Fault detail, Work orders |
| 41 Asset Register | 4 | 4 | - |
| 42 Tasks | 4 | 4 | - |
| 43 Housekeeping & Room Status | 6 | 6 | - |
| 44 Laundry | 4 | 4 | - |
| 45 Security, Patrols & Incidents | 6 | 6 | - |
| 46 Lost & Found | 4 | 4 | - |
| 47 Fleet & Transport | 5 | 5 | - |
| 48 SOPs & Knowledge Base | 3 | 3 | - |
| 49 Notice Board | 4 | 1 | Post detail, New post, Read receipts |
| 50 Chat | 4 | 1 | Chat room, New chat, Group info |
| 51 Meetings & Minutes | 5 | 5 | - |
| 52 Surveys & Polls | 3 | 3 | - |
| 53 Company Calendar | 3 | 3 | - |
| 54 CRM: Guest & Client Profiles | 4 | 3 | Guest profile |
| 56 Feedback, Complaints & Reviews | 4 | 4 | - |
| 57 Loyalty & Membership | 3 | 3 | - |
| 59 Promotions, Vouchers & Gift Cards | 4 | 4 | - |
| 60 Guest Requests & Help Desk | 4 | 4 | - |
| 61 Menus & Catalogue | 2 | 0 | Menus, Out of stock today |
| 62 Food Ordering | 15 | 11 | Orders board, Order detail, Take order, Waiter order |
| 63 Kitchen Display & Production | 4 | 2 | Kitchen display, Expo screen |
| 64 Tables & Dine-in | 6 | 1 | Floor plan, Reservations, Waiting list, Table detail, Open bills |
| 65 Buffet Service | 4 | 4 | - |
| 66 Delivery & Riders | 9 | 8 | Dispatch board |
| 67 Room Bookings | 12 | 5 | Booking confirmed, Booking detail, Pre-arrival, Digital check-in, Front desk bookings, Arrivals and departures, In-house guests |
| 68 Museum & Cultural Visits | 10 | 5 | Group booking, Ticket scanner, Audio guide, Museum bookings, My performances |
| 69 Events & Conferences | 10 | 3 | Enquiries, Event detail, Contract, Run sheet, Guest list, Event check-in, Post-event report |
| 70 Venues & Equipment Hire | 3 | 2 | Venue calendar |
| 71 Swimming Pool | 7 | 3 | Pool entry, Pool live, Water tests, Lifeguard log |
| 72 Spa / Humura | 7 | 4 | Health questions, Spa schedule, My therapist day |
| 73 Crafts & Bookshop | 4 | 3 | Shop till |
| 74 WhatsApp Concierge | 3 | 0 | WhatsApp inbox, Conversation, Chat with Igongo |
| 77 Payments | 6 | 0 | Pay, Mobile money prompt, Record cash payment, Payment link, Till |
| 78 Receipts & Invoicing | 2 | 2 | - |
| 79 Cash-up & Reconciliation | 2 | 2 | - |
| 81 Reports & Analytics | 3 | 3 | - |
| 84 Stock & Inventory | 11 | 10 | Item detail |

Total: 361 screens in the app, 210 with live data.
