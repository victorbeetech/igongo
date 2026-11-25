# Security Guard

**Level:** Frontline staff · **Role key:** `security-guard` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Patrols the grounds, guards zones and events, and reports incidents.

**Reports to:** [Security Supervisor](security-supervisor.md)

**Uses:** The Igongo app on a phone

## Home screen tiles

- My patrol route
- Scan checkpoint
- Scan card or wristband
- Report incident
- Panic button

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Security, Patrols & Incidents](../modules/45-security-incidents.md) | view, create | Own records |
| [NFC & QR Staff Cards](../modules/16-staff-cards.md) | view | Everything |
| [Event Wristbands](../modules/17-wristbands.md) | view | Everything |
| [Access Control & Zones](../modules/19-access-zones.md) | view | Everything |
| [Visitors & Contractors](../modules/20-visitor-management.md) | view | Everything |

## Approval limits

- None. This role does not approve anything.

## Extra rules

- Can switch to the client view at any time to see the app exactly as a guest sees it.
