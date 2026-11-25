# Restaurant Host / Hostess

**Level:** Frontline staff · **Role key:** `host-hostess` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Greets diners, manages reservations, the waiting list and seating.

**Reports to:** [Restaurant Supervisor](restaurant-supervisor.md)

**Uses:** The Igongo app on a phone

## Home screen tiles

- Reservations next 2 hours
- Table map
- Book a table

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Tables & Dine-in](../modules/64-tables-dinein.md) | view, create, edit | Own department |
| [CRM: Guest & Client Profiles](../modules/54-crm-guests.md) | view | Own department |

## Approval limits

- None. This role does not approve anything.

## Extra rules

- Can switch to the client view at any time to see the app exactly as a guest sees it.
