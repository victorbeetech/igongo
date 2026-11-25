# Wristband Desk Attendant

**Level:** Frontline staff · **Role key:** `wristband-desk` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Hands out, links and collects event wristbands at the desk.

**Reports to:** [Events Coordinator](events-coordinator.md)

**Uses:** The Igongo app on a phone

## Home screen tiles

- Wristbands assigned
- Scan card or wristband
- Guest list check-in

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Event Wristbands](../modules/17-wristbands.md) | view, edit | Own department |
| [Events & Conferences](../modules/69-events-conferences.md) | view | Own department |

## Approval limits

- None. This role does not approve anything.

## Extra rules

- Can switch to the client view at any time to see the app exactly as a guest sees it.
