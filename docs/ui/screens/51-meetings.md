# S51. Meetings & Minutes

[All screens](README.md) · [Module spec](../../modules/51-meetings.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s51-01"></a>S51-01 | Meetings | App, Web | `/meetings/meetings` | Upcoming and past meetings | Role home | S51-02 Meeting detail, S51-03 Schedule meeting |
| <a id="s51-02"></a>S51-02 | Meeting detail | App, Web | `/meetings/meeting-detail/:id` | Agenda, attendees, minutes and action items | S51-01 Meetings, S51-05 My action items | D51-01 Sign attendance, S51-04 Take minutes |
| <a id="s51-03"></a>S51-03 | Schedule meeting | App, Web | `/meetings/schedule-meeting` | Date, place or link, agenda and attendees | S51-01 Meetings | Back only |
| <a id="s51-04"></a>S51-04 | Take minutes | App, Web | `/meetings/take-minutes` | Minutes, decisions and action items during the meeting | S51-02 Meeting detail | D51-02 Approve minutes |
| <a id="s51-05"></a>S51-05 | My action items | App | `/meetings/my-action-items` | Actions assigned to me from meetings | Role home | S51-02 Meeting detail |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d51-01"></a>D51-01 | Sign attendance | Tap card or confirm attendance | S51-02 Meeting detail |
| <a id="d51-02"></a>D51-02 | Approve minutes | Approve and share the minutes | S51-04 Take minutes |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
