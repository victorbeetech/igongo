# S46. Lost & Found

[All screens](README.md) · [Module spec](../../modules/46-lost-found.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s46-01"></a>S46-01 | Lost and found | App, Web | `/lost-found/lost-and-found` | Items found, with photos and where | Role home | D46-02 Dispose item, S46-03 Claim item, S46-05 Lost and found settings |
| <a id="s46-02"></a>S46-02 | Log found item | App | `/lost-found/log-found-item` | Photo, place and finder | Role home | Back only |
| <a id="s46-03"></a>S46-03 | Claim item | App, Web | `/lost-found/claim-item` | Match an owner, check ID and hand over | S46-01 Lost and found | D46-01 Hand over item |
| <a id="s46-04"></a>S46-04 | Lost item report | App, Public | `/lost-found/lost-item-report` | Guest reports something lost | [S75-01 Website home](75-public-website.md#s75-01) | Back only |
| <a id="s46-05"></a>S46-05 | Lost and found settings | Web | `/lost-found/lost-and-found-settings` | Holding periods per item type; Who can hand over items | S46-01 Lost and found | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d46-01"></a>D46-01 | Hand over item | Owner signs or taps | S46-03 Claim item |
| <a id="d46-02"></a>D46-02 | Dispose item | Donate or dispose after the holding time | S46-01 Lost and found |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
