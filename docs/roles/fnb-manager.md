# Restaurant & F&B Manager

**Level:** Department managers · **Role key:** `fnb-manager` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Runs the restaurants, bars, coffee shops, room service and buffets: menus, service quality, staff and sales.

**Reports to:** [General Manager (GM)](general-manager.md)

**Uses:** Igongo app and web portal

## Home screen tiles

- Sales today by outlet
- Orders and pre-orders now
- Table reservations today
- Late orders
- Staff on duty (F&B)
- Guest ratings (food)
- Daily report to sign

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Menus & Catalogue](../modules/61-menu-catalogue.md) | view, create, edit | Own department |
| [Food Ordering](../modules/62-food-ordering.md) | view, edit, approve, export | Own department |
| [Kitchen Display & Production](../modules/63-kitchen-display.md) | view | Own department |
| [Tables & Dine-in](../modules/64-tables-dinein.md) | view, create, edit | Own department |
| [Buffet Service](../modules/65-buffet.md) | view, create, edit | Own department |
| [Delivery & Riders](../modules/66-delivery-riders.md) | view | Own department |
| [Promotions, Vouchers & Gift Cards](../modules/59-promotions-vouchers.md) | view, create | Own department |
| [Feedback, Complaints & Reviews](../modules/56-guest-feedback.md) | view, edit, comment | Own department |
| [Attendance](../modules/25-attendance.md) | view, export | Own department |
| [Shifts & Rosters](../modules/26-shifts-rosters.md) | view, create, edit, approve | Own department |
| [Leave Management](../modules/27-leave.md) | view, approve | Own department |
| [Staff Meals](../modules/32-staff-meals.md) | view | Own department |
| [Daily Reports](../modules/38-daily-reports.md) | view, approve, comment | Own department |
| [Inspections & Checklists](../modules/39-inspections.md) | view, create | Own department |
| [Cash-up & Reconciliation](../modules/79-cash-up.md) | view, approve | Own department |
| [Reports & Analytics](../modules/81-reports-analytics.md) | view, export | Own department |
| [Bonuses & Rewards](../modules/31-bonuses-rewards.md) | view, create | Own department |
| [Stock & Inventory](../modules/84-stock-inventory.md) | view, create, approve | Own department |

## Approval limits

- Voids and discounts up to Tier 2.
- Leave and shift swaps for F&B staff.
- Rewards up to Tier 1.

## Extra rules

- Menu price changes go to the GM for approval.
- Can switch to the client view at any time to see the app exactly as a guest sees it.
