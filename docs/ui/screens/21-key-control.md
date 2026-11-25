# S21. Key Control

[All screens](README.md) · [Module spec](../../modules/21-key-control.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s21-01"></a>S21-01 | Keys register | App, Web | `/key-control/keys-register` | Every key with tag, what it opens and where it is | Role home | S21-02 Key detail, S21-03 Sign out key, S21-04 Return key, S21-05 Keys out now, S21-06 Key settings |
| <a id="s21-02"></a>S21-02 | Key detail | App, Web | `/key-control/key-detail/:id` | One key with its history | S21-01 Keys register | Back only |
| <a id="s21-03"></a>S21-03 | Sign out key | App, Kiosk | `/key-control/sign-out-key` | Tap staff card, take photo, sign out | S21-01 Keys register | D21-01 Restricted key approval |
| <a id="s21-04"></a>S21-04 | Return key | App, Kiosk | `/key-control/return-key` | Tap staff card and return | S21-01 Keys register | Back only |
| <a id="s21-05"></a>S21-05 | Keys out now | App, Web | `/key-control/keys-out-now` | Keys signed out, with overdue highlighted | Role home, S21-01 Keys register | D21-02 Report lost key |
| <a id="s21-06"></a>S21-06 | Key settings | Web | `/key-control/key-settings` | Which roles can hold which keys; Maximum time a key can be out; Who is alerted for overdue or lost keys | S21-01 Keys register | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d21-01"></a>D21-01 | Restricted key approval | Manager approves a restricted key | S21-03 Sign out key |
| <a id="d21-02"></a>D21-02 | Report lost key | Record a lost key and lock change | S21-05 Keys out now |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
