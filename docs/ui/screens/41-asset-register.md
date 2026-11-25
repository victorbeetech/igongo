# S41. Asset Register

[All screens](README.md) · [Module spec](../../modules/41-asset-register.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s41-01"></a>S41-01 | Assets list | App, Web | `/asset-register/assets-list` | Equipment and property with QR tags | Role home | S41-02 Asset detail, S41-04 Add asset, S41-05 Asset count, S41-06 Asset settings |
| <a id="s41-02"></a>S41-02 | Asset detail | App, Web | `/asset-register/asset-detail/:id` | Location, holder, value, faults and service history | S41-01 Assets list, S41-03 Scan asset | D41-01 Move asset, D41-02 Dispose asset, [S40-01 Report fault](40-faults-maintenance.md#s40-01) |
| <a id="s41-03"></a>S41-03 | Scan asset | App, Kiosk | `/asset-register/scan-asset` | Scan a QR tag to see the asset or report a fault | Role home | S41-02 Asset detail |
| <a id="s41-04"></a>S41-04 | Add asset | Web | `/asset-register/add-asset` | Details, photo, value and QR label print | S41-01 Assets list | Back only |
| <a id="s41-05"></a>S41-05 | Asset count | App, Kiosk | `/asset-register/asset-count` | Scan assets to confirm what is where | S41-01 Assets list | Back only |
| <a id="s41-06"></a>S41-06 | Asset settings | Web | `/asset-register/asset-settings` | Asset categories and required fields; Who can add, move and dispose of assets; Audit schedule | S41-01 Assets list | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d41-01"></a>D41-01 | Move asset | New location or holder | S41-02 Asset detail |
| <a id="d41-02"></a>D41-02 | Dispose asset | Reason, value and approval | S41-02 Asset detail |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
