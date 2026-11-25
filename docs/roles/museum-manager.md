# Museum & Cultural Centre Manager

**Level:** Department managers · **Role key:** `museum-manager` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Runs the Eriijukiro Museum, the cultural village, tours, performances and school visits.

**Reports to:** [General Manager (GM)](general-manager.md)

**Uses:** Igongo app and web portal

## Home screen tiles

- Visitors today
- Tours booked
- Group and school bookings
- Guides on duty
- Exhibit content
- Ratings

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Museum & Cultural Visits](../modules/68-museum.md) | view, create, edit, approve, export | Own department |
| [CRM: Guest & Client Profiles](../modules/54-crm-guests.md) | view | Own department |
| [Attendance](../modules/25-attendance.md) | view | Own department |
| [Shifts & Rosters](../modules/26-shifts-rosters.md) | view, create, edit, approve | Own department |
| [Leave Management](../modules/27-leave.md) | view, approve | Own department |
| [Daily Reports](../modules/38-daily-reports.md) | view, approve, comment | Own department |
| [Inspections & Checklists](../modules/39-inspections.md) | view, create | Own department |
| [Reports & Analytics](../modules/81-reports-analytics.md) | view, export | Own department |

## Approval limits

- Group discounts up to Tier 1.
- Leave and shifts for museum staff.

## Extra rules

- Can switch to the client view at any time to see the app exactly as a guest sees it.
