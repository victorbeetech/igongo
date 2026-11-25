# Pest Control Officer

**Level:** Frontline staff · **Role key:** `pest-control` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Carries out pest control rounds and records treatments.

**Reports to:** [Maintenance Manager (Chief Engineer)](maintenance-manager.md)

**Uses:** The Igongo app on a phone

## Home screen tiles

- Checklist
- Report a fault

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Inspections & Checklists](../modules/39-inspections.md) | view, create | Assigned to them |
| [Faults & Maintenance](../modules/40-faults-maintenance.md) | view, create | Own department |

## Approval limits

- None. This role does not approve anything.

## Extra rules

- Can switch to the client view at any time to see the app exactly as a guest sees it.
