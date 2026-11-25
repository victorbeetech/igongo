# Pool Plant Operator

**Level:** Frontline staff · **Role key:** `pool-plant-operator` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Runs pumps, filters and dosing, and records water tests and plant checks.

**Reports to:** [Pool Supervisor](pool-manager.md)

**Uses:** The Igongo app on a phone

## Home screen tiles

- Water tests due
- Pool plant checks
- Report a fault
- Scan an asset

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Swimming Pool](../modules/71-pool.md) | view, edit | Own department |
| [Inspections & Checklists](../modules/39-inspections.md) | view, create | Assigned to them |
| [Faults & Maintenance](../modules/40-faults-maintenance.md) | view, create | Own department |
| [Asset Register](../modules/41-asset-register.md) | view | Own department |

## Approval limits

- None. This role does not approve anything.

## Extra rules

- Can switch to the client view at any time to see the app exactly as a guest sees it.
