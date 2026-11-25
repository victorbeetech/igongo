# S47. Fleet & Transport

[All screens](README.md) · [Module spec](../../modules/47-fleet-transport.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s47-01"></a>S47-01 | Vehicles | App, Web | `/fleet-transport/vehicles` | Hotel vehicles with status and documents | Role home | D47-02 Document expiring, S47-05 Fuel and repairs, S47-06 Fleet settings |
| <a id="s47-02"></a>S47-02 | Trip requests | App, Web | `/fleet-transport/trip-requests` | Requests to approve and assign | Role home, S47-04 Book transfer | D47-01 Assign driver |
| <a id="s47-03"></a>S47-03 | Trip | App | `/fleet-transport/trip` | Start, end, mileage and route for the driver | D47-01 Assign driver, Role home | Back only |
| <a id="s47-04"></a>S47-04 | Book transfer | App, Public | `/fleet-transport/book-transfer` | Guest books an airport or town pickup | Role home | S47-02 Trip requests |
| <a id="s47-05"></a>S47-05 | Fuel and repairs | App, Web | `/fleet-transport/fuel-and-repairs` | Fuel and repair records per vehicle | Role home, S47-01 Vehicles | Back only |
| <a id="s47-06"></a>S47-06 | Fleet settings | Web | `/fleet-transport/fleet-settings` | Vehicles and who can drive each; Trip approval rules; Whether guests can book transfers in the app | S47-01 Vehicles | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d47-01"></a>D47-01 | Assign driver | Pick driver and vehicle | S47-02 Trip requests |
| <a id="d47-02"></a>D47-02 | Document expiring | Insurance or licence reminder | S47-01 Vehicles |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
