# S18. Devices & Stations

[All screens](README.md) · [Module spec](../../modules/18-devices-stations.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s18-01"></a>S18-01 | Devices list | Web | `/devices-stations/devices-list` | Every device with type, station, status, battery and last seen | Role home | S18-02 Device detail, S18-03 Register device, S18-05 Stations, S18-09 Device alerts, S18-10 Device settings |
| <a id="s18-02"></a>S18-02 | Device detail | Web | `/devices-stations/device-detail/:id` | One device: station, app version, health and history | S18-01 Devices list | D18-01 Lock device, D18-02 Wipe device, D18-03 Unpair device |
| <a id="s18-03"></a>S18-03 | Register device | Web | `/devices-stations/register-device` | Name, type, serial, location and station | S18-01 Devices list | S18-04 Pair device |
| <a id="s18-04"></a>S18-04 | Pair device | App, Web, Kiosk | `/devices-stations/pair-device` | Show a QR on the web and scan it with the device | S18-03 Register device | S18-08 Kiosk mode |
| <a id="s18-05"></a>S18-05 | Stations | Web | `/devices-stations/stations` | Gates, reception, kitchen pass, food line and pool entrance | S18-01 Devices list | S18-06 Station detail |
| <a id="s18-06"></a>S18-06 | Station detail | Web | `/devices-stations/station-detail/:id` | What the station does, its devices and printers | S18-05 Stations | S18-07 Printers |
| <a id="s18-07"></a>S18-07 | Printers | Web | `/devices-stations/printers` | Card, receipt and kitchen printers and where they are | Role home, S18-06 Station detail | Back only |
| <a id="s18-08"></a>S18-08 | Kiosk mode | Kiosk | `/devices-stations/kiosk-mode` | The locked single-screen mode for a station device | S18-04 Pair device | Back only |
| <a id="s18-09"></a>S18-09 | Device alerts | Web | `/devices-stations/device-alerts` | Offline too long, low battery and wrong location | Role home, S18-01 Devices list | Back only |
| <a id="s18-10"></a>S18-10 | Device settings | Web | `/devices-stations/device-settings` | Station types and what each station does; Which roles can use which station; Alert rules for offline devices; Whether personal phones may be used as stations | S18-01 Devices list | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d18-01"></a>D18-01 | Lock device | Remote lock with a message | S18-02 Device detail |
| <a id="d18-02"></a>D18-02 | Wipe device | Confirm a remote wipe | S18-02 Device detail |
| <a id="d18-03"></a>D18-03 | Unpair device | Remove the device from its station | S18-02 Device detail |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
