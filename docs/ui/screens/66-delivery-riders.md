# S66. Delivery & Riders

[All screens](README.md) · [Module spec](../../modules/66-delivery-riders.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s66-01"></a>S66-01 | Dispatch board | App, Web | `/delivery-riders/dispatch-board` | Orders to assign, riders online and live map | Role home | D66-01 Assign rider, S66-02 Delivery zones, S66-11 Riders |
| <a id="s66-02"></a>S66-02 | Delivery zones | Web | `/delivery-riders/delivery-zones` | Zones on a map with fees and times | S66-01 Dispatch board | Back only |
| <a id="s66-03"></a>S66-03 | Rider home | App | `/delivery-riders/rider-home` | Go online, current order and today's earnings | Role home, S66-07 Proof of delivery | S66-04 New delivery offer, S66-08 Cash hand-in, S66-09 Rider earnings |
| <a id="s66-04"></a>S66-04 | New delivery offer | App | `/delivery-riders/new-delivery-offer` | Accept or decline an assigned order | S66-03 Rider home | S66-05 Pickup |
| <a id="s66-05"></a>S66-05 | Pickup | App | `/delivery-riders/pickup` | Confirm pickup at the kitchen pass | S66-04 New delivery offer | S66-06 Navigate |
| <a id="s66-06"></a>S66-06 | Navigate | App | `/delivery-riders/navigate` | Map and route to the guest, with call button | Role home, S66-05 Pickup | D66-03 Delivery problem, S66-07 Proof of delivery |
| <a id="s66-07"></a>S66-07 | Proof of delivery | App | `/delivery-riders/proof-of-delivery` | Photo, signature or guest code | Role home, S66-06 Navigate | S66-03 Rider home |
| <a id="s66-08"></a>S66-08 | Cash hand-in | App | `/delivery-riders/cash-hand-in` | Cash collected and handed in at shift end | Role home, S66-03 Rider home | Back only |
| <a id="s66-09"></a>S66-09 | Rider earnings | App | `/delivery-riders/rider-earnings` | Trips and earnings history | Role home, S66-03 Rider home | Back only |
| <a id="s66-10"></a>S66-10 | Live rider map | App, Public | `/delivery-riders/live-rider-map` | Guest sees the rider and arrival time | [S62-10 Track order](62-food-ordering.md#s62-10) | D66-02 Rate rider |
| <a id="s66-11"></a>S66-11 | Riders | Web | `/delivery-riders/riders` | Riders, status, ratings and documents | S66-01 Dispatch board | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d66-01"></a>D66-01 | Assign rider | Pick a rider or let the system choose | S66-01 Dispatch board |
| <a id="d66-02"></a>D66-02 | Rate rider | Guest rates the delivery | S66-10 Live rider map |
| <a id="d66-03"></a>D66-03 | Delivery problem | Guest not found, wrong address or refused | S66-06 Navigate |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
