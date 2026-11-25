# HR Officer

**Level:** Supervisors and officers · **Role key:** `hr-officer` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Does daily HR work: enrolling staff, documents, cards, leave records and attendance corrections.

**Reports to:** [HR Manager](hr-manager.md)

**Uses:** Web portal and Igongo app

## Home screen tiles

- New staff to enrol
- Documents expiring
- Leave requests
- Attendance corrections
- Card requests

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [HR Staff Records](../modules/22-hr-records.md) | view, create, edit | Everything |
| [Onboarding & Exit](../modules/24-onboarding-exit.md) | view, create, edit | Everything |
| [Attendance](../modules/25-attendance.md) | view, edit | Everything |
| [Leave Management](../modules/27-leave.md) | view, edit | Everything |
| [NFC & QR Staff Cards](../modules/16-staff-cards.md) | view, create | Everything |
| [Training & Certificates](../modules/34-training.md) | view, create, edit | Everything |
| [Staff Requests & Welfare](../modules/36-staff-welfare.md) | view, edit | Everything |
| [Recruitment](../modules/23-recruitment.md) | view, edit | Everything |

## Approval limits

- None. Approvals go to the HR Manager.

## Extra rules

- Cannot see salaries or discipline cases unless given access.
- Can switch to the client view at any time to see the app exactly as a guest sees it.
