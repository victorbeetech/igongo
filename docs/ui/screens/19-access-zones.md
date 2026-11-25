# S19. Access Control & Zones

[All screens](README.md) · [Module spec](../../modules/19-access-zones.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s19-01"></a>S19-01 | Zones list | Web | `/access-zones/zones-list` | Every restricted zone with its doors and devices | Role home | D19-02 Start lockdown, S19-02 Zone editor, S19-04 Zone live, S19-06 Entry log, S19-07 Temporary passes |
| <a id="s19-02"></a>S19-02 | Zone editor | Web | `/access-zones/zone-editor/:id` | Name, map area, guarding devices and rules | S19-01 Zones list | S19-03 Zone rules |
| <a id="s19-03"></a>S19-03 | Zone rules | Web | `/access-zones/zone-rules` | By role, person, card type, band range, day and time | S19-02 Zone editor | Back only |
| <a id="s19-04"></a>S19-04 | Zone live | App, Web | `/access-zones/zone-live` | Who is inside each zone now | S19-01 Zones list | Back only |
| <a id="s19-05"></a>S19-05 | Zone check | App, Kiosk | `/access-zones/zone-check` | Guard scans a card or band: allowed or refused with reason | Role home | D19-01 Override refusal |
| <a id="s19-06"></a>S19-06 | Entry log | Web | `/access-zones/entry-log` | Every entry and refusal, with photo where available | Role home, S19-01 Zones list | Back only |
| <a id="s19-07"></a>S19-07 | Temporary passes | App, Web | `/access-zones/temporary-passes` | Passes for contractors and visitors with time limits | S19-01 Zones list | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d19-01"></a>D19-01 | Override refusal | Guard lets someone in, with a reason | S19-05 Zone check |
| <a id="d19-02"></a>D19-02 | Start lockdown | Close a zone to everyone, with who is told | S19-01 Zones list |
| <a id="d19-03"></a>D19-03 | End lockdown | Reopen the zone | D19-02 Start lockdown |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
