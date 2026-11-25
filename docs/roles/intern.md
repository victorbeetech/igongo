# Intern / Trainee

**Level:** Frontline staff · **Role key:** `intern` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

A learner placed in a department, with view access to their department's work and their training plan.

**Uses:** The Igongo app on a phone

## Home screen tiles

- My training
- My supervisor
- My tasks
- Daily report

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Training & Certificates](../modules/34-training.md) | view | Own records |
| [Daily Reports](../modules/38-daily-reports.md) | view, create | Own records |
| [Tasks](../modules/42-tasks.md) | view, edit | Assigned to them |
| [SOPs & Knowledge Base](../modules/48-knowledge-base.md) | view | Everything |

## Approval limits

- None. This role does not approve anything.

## Extra rules

- Access ends on the internship end date.
- Can switch to the client view at any time to see the app exactly as a guest sees it.
