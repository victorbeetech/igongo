# S53. Company Calendar

[All screens](README.md) · [Module spec](../../modules/53-company-calendar.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s53-01"></a>S53-01 | Calendar | App, Web | `/company-calendar/calendar` | Company events, holidays, meetings, events and shifts in one view | Role home | S53-02 Calendar event, S53-03 Add calendar entry, S53-04 Calendar settings |
| <a id="s53-02"></a>S53-02 | Calendar event | App, Web | `/company-calendar/calendar-event` | One entry with details and who is invited | S53-01 Calendar | D53-01 RSVP |
| <a id="s53-03"></a>S53-03 | Add calendar entry | App, Web | `/company-calendar/add-calendar-entry` | Title, time, audience and reminders | S53-01 Calendar | Back only |
| <a id="s53-04"></a>S53-04 | Calendar settings | Web | `/company-calendar/calendar-settings` | Which layers each role can see; Who can add company events | S53-01 Calendar | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d53-01"></a>D53-01 | RSVP | Going, maybe or not going | S53-02 Calendar event |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
