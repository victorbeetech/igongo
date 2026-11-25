# General Maintenance Technician

**Level:** Frontline staff · **Role key:** `maintenance-technician` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Handles general repairs, painting, glass, AC and anything not covered by a specialist.

**Reports to:** [Maintenance Manager (Chief Engineer)](maintenance-manager.md)

**Uses:** The Igongo app on a phone

## Home screen tiles

- My jobs
- Open faults
- Planned jobs due
- Scan an asset

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Faults & Maintenance](../modules/40-faults-maintenance.md) | view, edit, comment, like | Own department |
| [Asset Register](../modules/41-asset-register.md) | view | Everything |
| [Inspections & Checklists](../modules/39-inspections.md) | view, create | Assigned to them |

## Approval limits

- None. This role does not approve anything.

## Extra rules

- Can switch to the client view at any time to see the app exactly as a guest sees it.
