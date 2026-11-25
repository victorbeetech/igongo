# General Manager (GM)

**Level:** Leadership · **Role key:** `general-manager` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Runs the hotel every day: staff, guests, operations and money. Sees everything, including payroll.

**Reports to:** [Chief Executive Officer](ceo.md)

**Uses:** Igongo app and web portal

## Home screen tiles

- GM daily dashboard
- Approvals waiting for me
- Staff on duty and late today
- Today's sales by outlet
- Today's arrivals, events and pre-orders
- Open complaints
- Open faults
- Department reports

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Reports & Analytics](../modules/81-reports-analytics.md) | view, export | Everything |
| [Workflow & Approvals](../modules/09-workflow-approvals.md) | view, approve | Everything |
| [Audit Trail](../modules/05-audit-trail.md) | view | Everything |
| [Records Archive & Search](../modules/06-records-search.md) | view, export | Everything |
| [HR Staff Records](../modules/22-hr-records.md) | view, edit | Everything |
| [Attendance](../modules/25-attendance.md) | view, approve, export | Everything |
| [Shifts & Rosters](../modules/26-shifts-rosters.md) | view, approve | Everything |
| [Leave Management](../modules/27-leave.md) | view, approve | Everything |
| [Payroll](../modules/28-payroll.md) | view, approve, export | Everything |
| [Payslips & Lifetime Earnings](../modules/29-earnings-statements.md) | view | Everything |
| [Advances & Loans](../modules/30-advances-loans.md) | view, approve | Everything |
| [Bonuses & Rewards](../modules/31-bonuses-rewards.md) | view, create, approve | Everything |
| [Performance & Appraisals](../modules/33-performance.md) | view | Everything |
| [Discipline & Cases](../modules/35-discipline.md) | view | Everything |
| [Petty Cash & Expense Claims](../modules/37-petty-cash.md) | view, approve | Everything |
| [Daily Reports](../modules/38-daily-reports.md) | view, approve, comment | Everything |
| [Inspections & Checklists](../modules/39-inspections.md) | view | Everything |
| [Faults & Maintenance](../modules/40-faults-maintenance.md) | view, approve, comment | Everything |
| [Tasks](../modules/42-tasks.md) | view, create | Everything |
| [Notice Board](../modules/49-notice-board.md) | view, create, edit, delete, comment, like | Everything |
| [Chat](../modules/50-chat.md) | view, create | Everything |
| [Meetings & Minutes](../modules/51-meetings.md) | view, create | Everything |
| [CRM: Guest & Client Profiles](../modules/54-crm-guests.md) | view | Everything |
| [Feedback, Complaints & Reviews](../modules/56-guest-feedback.md) | view, edit | Everything |
| [Food Ordering](../modules/62-food-ordering.md) | view | Everything |
| [Room Bookings](../modules/67-room-bookings.md) | view | Everything |
| [Events & Conferences](../modules/69-events-conferences.md) | view, approve | Everything |
| [Prices, Taxes & Discounts](../modules/76-pricing-tax.md) | view, approve | Everything |
| [Payments](../modules/77-payments.md) | view, approve | Everything |
| [Receipts & Invoicing](../modules/78-receipts-invoicing.md) | view | Everything |
| [Cash-up & Reconciliation](../modules/79-cash-up.md) | view, approve | Everything |

## Approval limits

- Up to Tier 3 for spending, advances, bonuses, refunds and discounts.
- Approves payroll runs.
- Approves price changes.

## Extra rules

- 2FA required.
- Viewing payroll is logged.
- Can switch to the client view at any time to see the app exactly as a guest sees it.
