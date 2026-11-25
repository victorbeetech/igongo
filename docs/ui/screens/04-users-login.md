# S04. Users, Accounts & Login

[All screens](README.md) · [Module spec](../../modules/04-users-login.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s04-01"></a>S04-01 | Accounts list | Web | `/users-login/accounts-list` | Staff, client and admin accounts with filters | Role home, [S01-01 Console home](01-super-admin.md#s01-01) | S04-02 Account detail, S04-03 Create account, S04-04 Pending approvals, S04-05 Merge accounts, S04-06 Login methods, S04-08 Security settings, S04-09 Login activity |
| <a id="s04-02"></a>S04-02 | Account detail | Web | `/users-login/account-detail/:id` | Status, roles, sign-in methods, devices and history | S04-01 Accounts list, S04-04 Pending approvals | D04-01 Lock account, D04-03 Sign out all devices, D04-04 Reset PIN, [S05-03 Record timeline](05-audit-trail.md#s05-03) |
| <a id="s04-03"></a>S04-03 | Create account | Web | `/users-login/create-account` | Create a staff or client account | Role home, S04-01 Accounts list | Back only |
| <a id="s04-04"></a>S04-04 | Pending approvals | Web | `/users-login/pending-approvals` | New client accounts waiting for approval | S04-01 Accounts list | S04-02 Account detail |
| <a id="s04-05"></a>S04-05 | Merge accounts | Web | `/users-login/merge-accounts` | Merge duplicate accounts | S04-01 Accounts list | Back only |
| <a id="s04-06"></a>S04-06 | Login methods | Web | `/users-login/login-methods` | Every method with its on and off switch, then allowed methods per role | S04-01 Accounts list | D04-02 Switch login method off, S04-07 Login method setup |
| <a id="s04-07"></a>S04-07 | Login method setup | Web | `/users-login/login-method-setup` | Keys, test button and options for one method (Google, Apple, SMS, WhatsApp) | S04-06 Login methods | Back only |
| <a id="s04-08"></a>S04-08 | Security settings | Web | `/users-login/security-settings` | Session length, lockout, password and PIN rules | S04-01 Accounts list | Back only |
| <a id="s04-09"></a>S04-09 | Login activity | Web | `/users-login/login-activity` | Sign-ins, failures and new devices | S04-01 Accounts list | Back only |
| <a id="s04-10"></a>S04-10 | My data | App | `/users-login/my-data` | Download my data or ask for deletion (clients) | [S00-31 My profile](00-app-shell.md#s00-31) | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d04-01"></a>D04-01 | Lock account | Reason and duration | S04-02 Account detail |
| <a id="d04-02"></a>D04-02 | Switch login method off | Warn how many people use only this method and what they will be asked to do | S04-06 Login methods |
| <a id="d04-03"></a>D04-03 | Sign out all devices | Confirm for one person or everyone | S04-02 Account detail |
| <a id="d04-04"></a>D04-04 | Reset PIN | Verify identity, then reset | S04-02 Account detail |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
