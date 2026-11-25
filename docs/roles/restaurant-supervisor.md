# Restaurant Supervisor

**Level:** Supervisors and officers · **Role key:** `restaurant-supervisor` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Runs the dining room on a shift: tables, waiters, voids and guest issues.

**Reports to:** [Restaurant & F&B Manager](fnb-manager.md)

**Uses:** The Igongo app on a phone

## Home screen tiles

- Table map
- Orders waiting
- Bills asked
- Waiters on shift
- Reservations next 2 hours

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Tables & Dine-in](../modules/64-tables-dinein.md) | view, create, edit | Own department |
| [Food Ordering](../modules/62-food-ordering.md) | view, edit, approve | Own department |
| [Buffet Service](../modules/65-buffet.md) | view | Own department |
| [Feedback, Complaints & Reviews](../modules/56-guest-feedback.md) | view, comment | Own department |
| [Attendance](../modules/25-attendance.md) | view | Own team |
| [Shifts & Rosters](../modules/26-shifts-rosters.md) | view, approve | Own team |
| [Cash-up & Reconciliation](../modules/79-cash-up.md) | view, approve | Own department |

## Approval limits

- Voids and discounts up to Tier 1.
- Signs off waiter and cashier cash-ups.

## Extra rules

- Can switch to the client view at any time to see the app exactly as a guest sees it.
