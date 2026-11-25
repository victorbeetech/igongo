# S42. Tasks

[All screens](README.md) · [Module spec](../../modules/42-tasks.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s42-01"></a>S42-01 | My tasks | App | `/tasks/my-tasks` | Tasks assigned to me, due today first | Role home | S42-02 Task detail, S42-05 Task settings |
| <a id="s42-02"></a>S42-02 | Task detail | App, Web | `/tasks/task-detail/:id` | Steps, photos, comments and due date | S42-01 My tasks, S42-04 Team tasks | D42-01 Complete task, D42-02 Reassign task |
| <a id="s42-03"></a>S42-03 | New task | App, Web | `/tasks/new-task` | Who, what, when and how often | S42-04 Team tasks | Back only |
| <a id="s42-04"></a>S42-04 | Team tasks | App, Web | `/tasks/team-tasks` | Tasks by person, status and due date | Role home | S42-02 Task detail, S42-03 New task |
| <a id="s42-05"></a>S42-05 | Task settings | Web | `/tasks/task-settings` | Who can assign tasks to whom (for example, only within the department); Priority levels and default reminders | S42-01 My tasks | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d42-01"></a>D42-01 | Complete task | Photo or note as proof | S42-02 Task detail |
| <a id="d42-02"></a>D42-02 | Reassign task | Pick someone else and the reason | S42-02 Task detail |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
