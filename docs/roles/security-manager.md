# Security Manager

**Level:** Department managers · **Role key:** `security-manager` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Keeps people and property safe: gates, guards, patrols, zones, visitors, keys and incidents.

**Reports to:** [General Manager (GM)](general-manager.md)

**Uses:** Igongo app and web portal

## Home screen tiles

- Who is on site now
- Visitors inside
- Patrols today
- Incidents open
- Refused entries
- Keys out
- Panic alerts

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Security, Patrols & Incidents](../modules/45-security-incidents.md) | view, create, edit, approve | Everything |
| [Access Control & Zones](../modules/19-access-zones.md) | view, create, edit | Everything |
| [Visitors & Contractors](../modules/20-visitor-management.md) | view, create, edit | Everything |
| [Key Control](../modules/21-key-control.md) | view, create, edit, approve | Everything |
| [NFC & QR Staff Cards](../modules/16-staff-cards.md) | view, delete | Everything |
| [Event Wristbands](../modules/17-wristbands.md) | view | Everything |
| [Attendance](../modules/25-attendance.md) | view | Everything |
| [Shifts & Rosters](../modules/26-shifts-rosters.md) | view, create, edit, approve | Own department |
| [Leave Management](../modules/27-leave.md) | view, approve | Own department |
| [Daily Reports](../modules/38-daily-reports.md) | view, approve, comment | Own department |
| [Records Archive & Search](../modules/06-records-search.md) | view | Everything |

## Approval limits

- Can block any staff card or wristband.
- Can lock down a zone.

## Extra rules

- Sees the live headcount of everyone on site.
- Can switch to the client view at any time to see the app exactly as a guest sees it.
