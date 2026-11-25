# S70. Venues & Equipment Hire

[All screens](README.md) · [Module spec](../../modules/70-venues-equipment.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s70-01"></a>S70-01 | Venues | App, Web | `/venues-equipment/venues` | Venues with layouts and capacity | Role home | S70-02 Venue calendar, S70-03 Equipment, S70-05 Venue settings |
| <a id="s70-02"></a>S70-02 | Venue calendar | App, Web | `/venues-equipment/venue-calendar` | Holds and bookings with setup times | Role home, S70-01 Venues | D70-01 Hold expiring, S70-04 Book venue |
| <a id="s70-03"></a>S70-03 | Equipment | Web | `/venues-equipment/equipment` | Items and quantities | S70-01 Venues | D70-02 Record damage |
| <a id="s70-04"></a>S70-04 | Book venue | App, Web | `/venues-equipment/book-venue` | Venue, layout, time and equipment | S70-02 Venue calendar | Back only |
| <a id="s70-05"></a>S70-05 | Venue settings | Web | `/venues-equipment/venue-settings` | Venues, layouts and equipment; How long a hold lasts before it is released | S70-01 Venues | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d70-01"></a>D70-01 | Hold expiring | Release or confirm a hold | S70-02 Venue calendar |
| <a id="d70-02"></a>D70-02 | Record damage | Item, damage and charge | S70-03 Equipment |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
