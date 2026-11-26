# Approvals (module 9)

Spec: [docs/modules/09-workflow-approvals.md](../../docs/modules/09-workflow-approvals.md).

Workflow & Approvals (module 9): approval requests of any kind and delegations, each with steps the super admin sets.

A records module built on [@igongo/records-kit](../../packages/records-kit/README.md): codes like `AP-0042`, QR text `IGG-REC:AP-0042`.

## Starting set-up (the super admin changes all of it on the settings screen)

- **Approval request**: What needs approving, Amount (UGX), Details. Steps: Requested, Checked, Approved, Done, Rejected. Self-service (staff or guests raise their own).
- **Delegation**: Acting for me, From, To, Reason. Steps: Requested, Active, Ended. Self-service (staff or guests raise their own).

## API

- **Routes** (`/api/approvals`): `GET|PUT /config`, `GET|POST /records`, `GET|PATCH /records/:id`, `POST /records/:id/status|assign|comments`, `GET /lookup/:code`, `GET /summary`, `GET /export`.
- **Data**: its own schema `approvals`: `records`, `record_events`, `settings`.
- **Permissions**: `workflow-approvals.records.view|create|edit|approve|export|comment`, `workflow-approvals.settings.edit`.
