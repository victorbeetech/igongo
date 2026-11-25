# Board of Directors

**Level:** Leadership · **Role key:** `board-of-directors` · [All roles](README.md)

> A pre-made role. The super admin can rename it, change every permission, tile and limit below, clone it, or delete it, all without code.

## Purpose

Oversees the hotel at the highest level with summary reports, board papers and big decisions, including members who represent the shareholders.

**Uses:** Igongo app and web portal

## Home screen tiles

- Board dashboard (revenue, occupancy, guest rating, staff count)
- Board meeting papers
- Decisions awaiting the board
- Monthly report from the CEO
- Notice board

## Modules, screens and default permissions

Includes everything in the [Every Staff Member (base role)](staff-base.md) role, plus:

| Module | Actions | Data scope |
| --- | --- | --- |
| [Reports & Analytics](../modules/81-reports-analytics.md) | view, export | Everything |
| [Meetings & Minutes](../modules/51-meetings.md) | view, create, comment | Own department |
| [Notice Board](../modules/49-notice-board.md) | view, comment, like | Everything |
| [Workflow & Approvals](../modules/09-workflow-approvals.md) | view, approve | Everything |
| [Records Archive & Search](../modules/06-records-search.md) | view | Everything |

**Main screens:** Board dashboard, Board meetings and minutes, Approvals awaiting the board

## Approval limits

- Approves Tier 3 and unlimited items that the workflow sends to the board, such as large capital spending.

## Extra rules

- 2FA required.
- Sees summary figures, not individual staff or guest records, unless given access.
- Can switch to the client view at any time to see the app exactly as a guest sees it.
