# S26. Shifts & Rosters

[All screens](README.md) · [Module spec](../../modules/26-shifts-rosters.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s26-01"></a>S26-01 | Roster | App, Web | `/shifts-rosters/roster` | Week or month view by department, with drag and drop | Role home | D26-01 Publish roster, D26-03 Roster clash, S26-03 Shift templates, S26-04 Swap requests |
| <a id="s26-02"></a>S26-02 | My shifts | App | `/shifts-rosters/my-shifts` | My upcoming shifts and swaps | Role home | D26-02 Request swap, S26-05 Open shifts |
| <a id="s26-03"></a>S26-03 | Shift templates | Web | `/shifts-rosters/shift-templates` | Morning, evening, night and split shifts | S26-01 Roster | Back only |
| <a id="s26-04"></a>S26-04 | Swap requests | App, Web | `/shifts-rosters/swap-requests` | Swap and cover requests waiting for approval | Role home, S26-01 Roster | Back only |
| <a id="s26-05"></a>S26-05 | Open shifts | App | `/shifts-rosters/open-shifts` | Extra shifts staff can pick up | S26-02 My shifts | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d26-01"></a>D26-01 | Publish roster | Confirm and notify staff | S26-01 Roster |
| <a id="d26-02"></a>D26-02 | Request swap | Pick the shift and the colleague | S26-02 My shifts |
| <a id="d26-03"></a>D26-03 | Roster clash | Warn about double booking, leave or too many hours | S26-01 Roster |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
