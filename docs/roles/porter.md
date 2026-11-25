# Porter / Bell Attendant

**Level:** Frontline staff · **Role key:** `porter` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Carries luggage, escorts guests and handles small guest requests.

**Reports to:** [Front Office Manager](front-office-manager.md)

**Uses:** The Igongo app on a phone

## Home screen tiles

- Requests assigned to me
- Arrivals today
- Lost and found

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Guest Requests & Help Desk](../modules/60-guest-requests.md) | view, edit | Assigned to them |
| [Lost & Found](../modules/46-lost-found.md) | view, create | Everything |
| [Fleet & Transport](../modules/47-fleet-transport.md) | view | Assigned to them |

## Approval limits

- None. This role does not approve anything.

## Extra rules

- Can switch to the client view at any time to see the app exactly as a guest sees it.
