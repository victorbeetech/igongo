# Executive Chef (Kitchen Head)

**Level:** Department managers · **Role key:** `executive-chef` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Leads the kitchen: menus, food quality, hygiene, prep planning, kitchen staff and food waste.

**Reports to:** [Restaurant & F&B Manager](fnb-manager.md)

**Uses:** Igongo app and the kitchen display

## Home screen tiles

- Kitchen tickets now
- Pre-orders due in the next 2 hours
- Buffet and event production today
- Staff meals forecast
- Items out today
- Waste today
- Kitchen inspection

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Menus & Catalogue](../modules/61-menu-catalogue.md) | view, create, edit | Own department |
| [Food Ordering](../modules/62-food-ordering.md) | view | Own department |
| [Kitchen Display & Production](../modules/63-kitchen-display.md) | view, create, edit | Own department |
| [Buffet Service](../modules/65-buffet.md) | view, edit | Own department |
| [Staff Meals](../modules/32-staff-meals.md) | view | Own department |
| [Inspections & Checklists](../modules/39-inspections.md) | view, create | Own department |
| [Faults & Maintenance](../modules/40-faults-maintenance.md) | view, create | Own department |
| [Attendance](../modules/25-attendance.md) | view | Own department |
| [Shifts & Rosters](../modules/26-shifts-rosters.md) | view, create, edit, approve | Own department |
| [Leave Management](../modules/27-leave.md) | view, approve | Own department |
| [Training & Certificates](../modules/34-training.md) | view | Own department |
| [Daily Reports](../modules/38-daily-reports.md) | view, create, approve, comment | Own department |
| [Reports & Analytics](../modules/81-reports-analytics.md) | view | Own department |

## Approval limits

- Leave and shift swaps for kitchen staff.

## Extra rules

- Can mark any item out of stock for today.
- Can switch to the client view at any time to see the app exactly as a guest sees it.
