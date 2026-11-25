# Spa Manager (Humura)

**Level:** Department managers · **Role key:** `spa-manager` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Runs the Humura spa: treatments, therapists, bookings and memberships.

**Reports to:** [General Manager (GM)](general-manager.md)

**Uses:** Igongo app

## Home screen tiles

- Appointments today
- Therapist schedule
- No-shows
- Ratings
- Sales today

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Spa / Humura](../modules/72-spa.md) | view, create, edit, approve, export | Own department |
| [Loyalty & Membership](../modules/57-loyalty.md) | view | Own department |
| [Attendance](../modules/25-attendance.md) | view | Own department |
| [Shifts & Rosters](../modules/26-shifts-rosters.md) | view, create, edit, approve | Own department |
| [Leave Management](../modules/27-leave.md) | view, approve | Own department |
| [Daily Reports](../modules/38-daily-reports.md) | view, approve, comment | Own department |
| [Reports & Analytics](../modules/81-reports-analytics.md) | view | Own department |

## Approval limits

- Discounts up to Tier 1.

## Extra rules

- Can switch to the client view at any time to see the app exactly as a guest sees it.
