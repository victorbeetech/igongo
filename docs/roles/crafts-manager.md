# Crafts & Bookshop Manager

**Level:** Department managers · **Role key:** `crafts-manager` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Runs the craft shop and bookshop: products, artisans, sales and online orders.

**Reports to:** [General Manager (GM)](general-manager.md)

**Uses:** Igongo app

## Home screen tiles

- Sales today
- Online orders
- Items running low
- Artisan balances

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Crafts & Bookshop](../modules/73-crafts-bookshop.md) | view, create, edit, approve, export | Own department |
| [Cash-up & Reconciliation](../modules/79-cash-up.md) | view, approve | Own department |
| [Attendance](../modules/25-attendance.md) | view | Own department |
| [Shifts & Rosters](../modules/26-shifts-rosters.md) | view, create, edit, approve | Own department |
| [Daily Reports](../modules/38-daily-reports.md) | view, approve, comment | Own department |
| [Reports & Analytics](../modules/81-reports-analytics.md) | view | Own department |

## Approval limits

- Discounts up to Tier 1.

## Extra rules

- Can switch to the client view at any time to see the app exactly as a guest sees it.
