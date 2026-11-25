# Screen inventory

Every screen and dialog of the Igongo app, web portal, kiosks and public pages, for every person: super admin, staff, managers, riders and guests. Each is numbered so sketches, designs, code and tests all refer to the same thing. Built from `tools/spec-gen/src/`; do not edit by hand.

**Totals:** 637 screens, 175 dialogs, 121 role homes and 26 flows.

**Connected:** 812 of 812 screens and dialogs can be reached from an entry point. See [role homes](role-homes.md) and [flows](../flows.md).

Where: App = the Igongo app (Android and iOS), Web = the web portal, Kiosk = a shared device or kiosk, Public = no sign-in needed. Routes are the same on the app and the web; `/:id` means the screen shows one record, and `?dialog=` opens a dialog over the current screen.

| # | Section | Screens | Dialogs |
| --- | --- | --- | --- |
| 00 | [App shell and shared screens](00-app-shell.md) | 45 | 7 |
| 01 | [Super Admin Console](01-super-admin.md) | 15 | 4 |
| 02 | [Roles & Permissions](02-roles-permissions.md) | 13 | 3 |
| 03 | [App Layout & Navigation](03-app-builder.md) | 9 | 1 |
| 04 | [Users, Accounts & Login](04-users-login.md) | 10 | 4 |
| 05 | [Audit Trail](05-audit-trail.md) | 6 | 1 |
| 06 | [Records Archive & Search](06-records-search.md) | 3 | 1 |
| 07 | [Custom Fields](07-custom-fields.md) | 3 | 1 |
| 08 | [Forms & Templates Builder](08-forms-builder.md) | 10 | 1 |
| 09 | [Workflow & Approvals](09-workflow-approvals.md) | 5 | 3 |
| 10 | [Notifications Engine](10-notifications.md) | 6 | 0 |
| 11 | [Files & Media](11-files-media.md) | 4 | 2 |
| 12 | [Languages, Wording & Branding](12-languages-wording.md) | 4 | 0 |
| 13 | [Data Import, Export & Backup](13-data-import-export.md) | 5 | 0 |
| 14 | [Integrations Hub & Webhooks](14-integrations-hub.md) | 4 | 0 |
| 15 | [Locations & Departments](15-locations-departments.md) | 5 | 0 |
| 16 | [NFC & QR Staff Cards](16-staff-cards.md) | 22 | 7 |
| 17 | [Event Wristbands](17-wristbands.md) | 12 | 5 |
| 18 | [Devices & Stations](18-devices-stations.md) | 10 | 3 |
| 19 | [Access Control & Zones](19-access-zones.md) | 7 | 3 |
| 20 | [Visitors & Contractors](20-visitor-management.md) | 9 | 3 |
| 21 | [Key Control](21-key-control.md) | 6 | 2 |
| 22 | [HR Staff Records](22-hr-records.md) | 9 | 2 |
| 23 | [Recruitment](23-recruitment.md) | 8 | 3 |
| 24 | [Onboarding & Exit](24-onboarding-exit.md) | 7 | 3 |
| 25 | [Attendance](25-attendance.md) | 11 | 4 |
| 26 | [Shifts & Rosters](26-shifts-rosters.md) | 5 | 3 |
| 27 | [Leave Management](27-leave.md) | 5 | 2 |
| 28 | [Payroll](28-payroll.md) | 9 | 4 |
| 29 | [Payslips & Lifetime Earnings](29-earnings-statements.md) | 5 | 2 |
| 30 | [Advances & Loans](30-advances-loans.md) | 6 | 2 |
| 31 | [Bonuses & Rewards](31-bonuses-rewards.md) | 5 | 2 |
| 32 | [Staff Meals](32-staff-meals.md) | 7 | 2 |
| 33 | [Performance & Appraisals](33-performance.md) | 6 | 2 |
| 34 | [Training & Certificates](34-training.md) | 6 | 2 |
| 35 | [Discipline & Cases](35-discipline.md) | 6 | 3 |
| 36 | [Staff Requests & Welfare](36-staff-welfare.md) | 5 | 1 |
| 37 | [Petty Cash & Expense Claims](37-petty-cash.md) | 6 | 2 |
| 38 | [Daily Reports](38-daily-reports.md) | 8 | 2 |
| 39 | [Inspections & Checklists](39-inspections.md) | 5 | 1 |
| 40 | [Faults & Maintenance](40-faults-maintenance.md) | 7 | 3 |
| 41 | [Asset Register](41-asset-register.md) | 6 | 2 |
| 42 | [Tasks](42-tasks.md) | 5 | 2 |
| 43 | [Housekeeping & Room Status](43-housekeeping.md) | 7 | 2 |
| 44 | [Laundry](44-laundry.md) | 5 | 1 |
| 45 | [Security, Patrols & Incidents](45-security-incidents.md) | 7 | 2 |
| 46 | [Lost & Found](46-lost-found.md) | 5 | 2 |
| 47 | [Fleet & Transport](47-fleet-transport.md) | 6 | 2 |
| 48 | [SOPs & Knowledge Base](48-knowledge-base.md) | 4 | 1 |
| 49 | [Notice Board](49-notice-board.md) | 5 | 3 |
| 50 | [Chat](50-chat.md) | 5 | 2 |
| 51 | [Meetings & Minutes](51-meetings.md) | 5 | 2 |
| 52 | [Surveys & Polls](52-surveys-polls.md) | 4 | 1 |
| 53 | [Company Calendar](53-company-calendar.md) | 4 | 1 |
| 54 | [CRM: Guest & Client Profiles](54-crm-guests.md) | 8 | 2 |
| 55 | [Corporate Accounts](55-corporate-accounts.md) | 5 | 1 |
| 56 | [Feedback, Complaints & Reviews](56-guest-feedback.md) | 7 | 2 |
| 57 | [Loyalty & Membership](57-loyalty.md) | 5 | 1 |
| 58 | [Marketing Campaigns](58-campaigns.md) | 3 | 2 |
| 59 | [Promotions, Vouchers & Gift Cards](59-promotions-vouchers.md) | 6 | 1 |
| 60 | [Guest Requests & Help Desk](60-guest-requests.md) | 5 | 2 |
| 61 | [Menus & Catalogue](61-menu-catalogue.md) | 4 | 1 |
| 62 | [Food Ordering](62-food-ordering.md) | 16 | 4 |
| 63 | [Kitchen Display & Production](63-kitchen-display.md) | 5 | 2 |
| 64 | [Tables & Dine-in](64-tables-dinein.md) | 8 | 3 |
| 65 | [Buffet Service](65-buffet.md) | 5 | 1 |
| 66 | [Delivery & Riders](66-delivery-riders.md) | 11 | 3 |
| 67 | [Room Bookings](67-room-bookings.md) | 14 | 3 |
| 68 | [Museum & Cultural Visits](68-museum.md) | 12 | 1 |
| 69 | [Events & Conferences](69-events-conferences.md) | 12 | 2 |
| 70 | [Venues & Equipment Hire](70-venues-equipment.md) | 5 | 2 |
| 71 | [Swimming Pool](71-pool.md) | 8 | 2 |
| 72 | [Spa / Humura](72-spa.md) | 7 | 1 |
| 73 | [Crafts & Bookshop](73-crafts-bookshop.md) | 8 | 1 |
| 74 | [WhatsApp Concierge](74-whatsapp-concierge.md) | 5 | 2 |
| 75 | [Public Website & Online Booking](75-public-website.md) | 8 | 1 |
| 76 | [Prices, Taxes & Discounts](76-pricing-tax.md) | 4 | 1 |
| 77 | [Payments](77-payments.md) | 10 | 2 |
| 78 | [Receipts & Invoicing](78-receipts-invoicing.md) | 6 | 2 |
| 79 | [Cash-up & Reconciliation](79-cash-up.md) | 5 | 2 |
| 80 | [Accounting Export](80-accounting-export.md) | 2 | 1 |
| 81 | [Reports & Analytics](81-reports-analytics.md) | 6 | 2 |
| 82 | [APEX Integration](82-apex-integration.md) | 4 | 1 |
| 83 | [SEO & Online Presence](83-seo-online-presence.md) | 6 | 0 |
| 84 | [Stock & Inventory](84-stock-inventory.md) | 20 | 5 |
| | **Total** | **637** | **175** |

## Coverage check

- Every module has screens, and every tile and flow step exists.
