# Pool Attendant

**Level:** Frontline staff · **Role key:** `pool-attendant` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Keeps the pool area clean and ready: towels, loungers, entry checks and pool-side orders. One person can also hold the Museum Guide role or any other role, and sees both jobs.

**Reports to:** [Pool Supervisor](pool-manager.md)

**Uses:** The Igongo app on a phone

## Home screen tiles

- Scan pass or wristband
- Swimmers now
- Cleaning checklist
- Report a fault
- Panic button

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Swimming Pool](../modules/71-pool.md) | view, edit | Own department |
| [Inspections & Checklists](../modules/39-inspections.md) | view, create | Assigned to them |
| [Food Ordering](../modules/62-food-ordering.md) | view, create | Own department |
| [Security, Patrols & Incidents](../modules/45-security-incidents.md) | create | Everything |

## Approval limits

- None. This role does not approve anything.

## Extra rules

- Can switch to the client view at any time to see the app exactly as a guest sees it.
