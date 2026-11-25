# S09. Workflow & Approvals

[All screens](README.md) · [Module spec](../../modules/09-workflow-approvals.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s09-01"></a>S09-01 | Workflows list | Web | `/workflow-approvals/workflows-list` | All approval workflows by request type | Role home, [S01-01 Console home](01-super-admin.md#s01-01) | S09-02 Workflow builder, S09-05 Approval SLA report |
| <a id="s09-02"></a>S09-02 | Workflow builder | Web | `/workflow-approvals/workflow-builder` | Steps, conditions, parallel approvals and escalations | S09-01 Workflows list | Back only |
| <a id="s09-03"></a>S09-03 | Delegations | App, Web | `/workflow-approvals/delegations` | Set who approves for me while I am away | Role home | Back only |
| <a id="s09-04"></a>S09-04 | Request detail | App, Web | `/workflow-approvals/request-detail/:id` | A request with its approval path and history | [S00-30 Approvals inbox](00-app-shell.md#s00-30) | D09-01 Approve, D09-02 Reject |
| <a id="s09-05"></a>S09-05 | Approval SLA report | Web | `/workflow-approvals/approval-sla-report` | How long approvals take per step and person | S09-01 Workflows list | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d09-01"></a>D09-01 | Approve | Approve with an optional note | S09-04 Request detail |
| <a id="d09-02"></a>D09-02 | Reject | Reject with a required reason | S09-04 Request detail |
| <a id="d09-03"></a>D09-03 | Bulk approve | Confirm many approvals at once | [S00-30 Approvals inbox](00-app-shell.md#s00-30) |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
