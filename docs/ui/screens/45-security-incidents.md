# S45. Security, Patrols & Incidents

[All screens](README.md) · [Module spec](../../modules/45-security-incidents.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s45-01"></a>S45-01 | Security home | App, Web | `/security-incidents/security-home` | Patrols, incidents and alerts today | Role home | S45-02 Patrol route, S45-03 Incidents, S45-04 Report incident, S45-06 Panic alert, S45-07 Security settings |
| <a id="s45-02"></a>S45-02 | Patrol route | App, Kiosk | `/security-incidents/patrol-route` | Scan checkpoints in order | Role home, S45-01 Security home | D45-02 Missed checkpoint |
| <a id="s45-03"></a>S45-03 | Incidents | App, Web | `/security-incidents/incidents` | Incidents by type and status | Role home, S45-01 Security home | S45-05 Incident detail |
| <a id="s45-04"></a>S45-04 | Report incident | App | `/security-incidents/report-incident` | What, where, who, photos and witnesses | Role home, S45-01 Security home, [S16-17 Card warning](16-staff-cards.md#s16-17) | Back only |
| <a id="s45-05"></a>S45-05 | Incident detail | App, Web | `/security-incidents/incident-detail/:id` | Full report with follow-up | S45-03 Incidents | Back only |
| <a id="s45-06"></a>S45-06 | Panic alert | App | `/security-incidents/panic-alert` | Live alert with location for security | Role home, S45-01 Security home, [D00-07 Panic button confirmation](00-app-shell.md#d00-07) | D45-01 Send panic alert |
| <a id="s45-07"></a>S45-07 | Security settings | Web | `/security-incidents/security-settings` | Patrol routes and checkpoints; Incident types and who is alerted for each; Who can use the panic button | S45-01 Security home | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d45-01"></a>D45-01 | Send panic alert | Hold to send, with location | S45-06 Panic alert |
| <a id="d45-02"></a>D45-02 | Missed checkpoint | Explain the missed point | S45-02 Patrol route |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
