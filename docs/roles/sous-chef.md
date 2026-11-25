# Sous Chef

**Level:** Supervisors and officers · **Role key:** `sous-chef` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Runs the kitchen on a shift and stands in for the Executive Chef.

**Reports to:** [Executive Chef (Kitchen Head)](executive-chef.md)

**Uses:** The Igongo app on a phone

## Home screen tiles

- Kitchen tickets now
- Pre-orders due
- Items out today
- Kitchen staff on shift
- Waste today

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Kitchen Display & Production](../modules/63-kitchen-display.md) | view, create, edit | Own department |
| [Menus & Catalogue](../modules/61-menu-catalogue.md) | view, edit | Own department |
| [Food Ordering](../modules/62-food-ordering.md) | view | Own department |
| [Buffet Service](../modules/65-buffet.md) | view | Own department |
| [Attendance](../modules/25-attendance.md) | view | Own team |
| [Shifts & Rosters](../modules/26-shifts-rosters.md) | view, approve | Own team |
| [Daily Reports](../modules/38-daily-reports.md) | view, create, approve, comment | Own team |

## Approval limits

- Shift swaps for kitchen staff.

## Extra rules

- Can switch to the client view at any time to see the app exactly as a guest sees it.
