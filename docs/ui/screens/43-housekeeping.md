# S43. Housekeeping & Room Status

[All screens](README.md) · [Module spec](../../modules/43-housekeeping.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s43-01"></a>S43-01 | Room board | App, Web | `/housekeeping/room-board` | Every room with clean, dirty, inspected, out of order | Role home | S43-02 Room detail, S43-05 Housekeeping assignment, S43-07 Housekeeping settings |
| <a id="s43-02"></a>S43-02 | Room detail | App, Web | `/housekeeping/room-detail/:id` | Status, assigned attendant, minibar and amenity checks | S43-01 Room board | D43-01 Mark out of order |
| <a id="s43-03"></a>S43-03 | My rooms | App | `/housekeeping/my-rooms` | Rooms assigned to me today | Role home | S43-04 Clean room |
| <a id="s43-04"></a>S43-04 | Clean room | App | `/housekeeping/clean-room/:id` | Checklist, minibar count, amenities and photos | S43-03 My rooms | D43-02 Minibar charge |
| <a id="s43-05"></a>S43-05 | Housekeeping assignment | App, Web | `/housekeeping/housekeeping-assignment` | Assign rooms to attendants | Role home, S43-01 Room board | Back only |
| <a id="s43-06"></a>S43-06 | Rooms to inspect | App | `/housekeeping/rooms-to-inspect` | Cleaned rooms waiting for the supervisor to inspect | Role home | [S39-02 Run inspection](39-inspections.md#s39-02) |
| <a id="s43-07"></a>S43-07 | Housekeeping settings | Web | `/housekeeping/housekeeping-settings` | Room statuses and their colours; Cleaning standards and time per room type; Whether inspection is required before release | S43-01 Room board | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d43-01"></a>D43-01 | Mark out of order | Reason and expected return | S43-02 Room detail |
| <a id="d43-02"></a>D43-02 | Minibar charge | Items used, sent to the guest bill | S43-04 Clean room |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
