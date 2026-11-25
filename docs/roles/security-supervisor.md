# Security Supervisor

**Level:** Supervisors and officers · **Role key:** `security-supervisor` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Runs a security shift: guards, patrols, gate and incidents.

**Reports to:** [Security Manager](security-manager.md)

**Uses:** The Igongo app on a phone

## Home screen tiles

- Guards on shift
- Patrol progress
- Visitors inside
- Incidents today
- Refused entries

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Security, Patrols & Incidents](../modules/45-security-incidents.md) | view, create, edit | Everything |
| [Visitors & Contractors](../modules/20-visitor-management.md) | view, create, edit | Everything |
| [Access Control & Zones](../modules/19-access-zones.md) | view | Everything |
| [Key Control](../modules/21-key-control.md) | view, edit | Everything |
| [Attendance](../modules/25-attendance.md) | view | Own team |
| [Shifts & Rosters](../modules/26-shifts-rosters.md) | view, approve | Own team |

## Approval limits

- Can override a zone refusal with a reason.
- Can block a lost card or wristband.

## Extra rules

- Can switch to the client view at any time to see the app exactly as a guest sees it.
