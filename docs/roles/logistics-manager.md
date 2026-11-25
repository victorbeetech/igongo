# Delivery & Transport Manager

**Level:** Department managers · **Role key:** `logistics-manager` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Runs food delivery, riders, dispatch, hotel vehicles and guest transfers.

**Reports to:** [General Manager (GM)](general-manager.md)

**Uses:** Igongo app and web portal

## Home screen tiles

- Live rider map
- Deliveries now and late
- Riders online
- Trips today
- Vehicle service due
- Rider cash to hand in

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Delivery & Riders](../modules/66-delivery-riders.md) | view, create, edit, approve, export | Everything |
| [Fleet & Transport](../modules/47-fleet-transport.md) | view, create, edit, approve, export | Everything |
| [Cash-up & Reconciliation](../modules/79-cash-up.md) | view, approve | Own department |
| [Attendance](../modules/25-attendance.md) | view | Own department |
| [Shifts & Rosters](../modules/26-shifts-rosters.md) | view, create, edit, approve | Own department |
| [Leave Management](../modules/27-leave.md) | view, approve | Own department |
| [Daily Reports](../modules/38-daily-reports.md) | view, approve, comment | Own department |
| [Reports & Analytics](../modules/81-reports-analytics.md) | view, export | Own department |

## Approval limits

- Delivery fee waivers up to Tier 1.
- Trip approvals.

## Extra rules

- Can switch to the client view at any time to see the app exactly as a guest sees it.
