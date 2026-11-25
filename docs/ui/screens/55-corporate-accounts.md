# S55. Corporate Accounts

[All screens](README.md) · [Module spec](../../modules/55-corporate-accounts.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s55-01"></a>S55-01 | Corporate accounts | Web | `/corporate-accounts/corporate-accounts` | Companies with credit limits and balances | Role home | S55-02 Corporate detail, S55-03 Add company, S55-05 Corporate account settings |
| <a id="s55-02"></a>S55-02 | Corporate detail | Web | `/corporate-accounts/corporate-detail/:id` | Contacts, bookings, charges, invoices and statements | S55-01 Corporate accounts | D55-01 Over credit limit |
| <a id="s55-03"></a>S55-03 | Add company | Web | `/corporate-accounts/add-company` | Details, contacts, terms and credit limit | S55-01 Corporate accounts | Back only |
| <a id="s55-04"></a>S55-04 | Company portal | Public | `/corporate-accounts/company-portal` | The company booker's view of bookings and invoices | Role home | [S67-01 Rooms](67-room-bookings.md#s67-01), [S78-02 Document view](78-receipts-invoicing.md#s78-02) |
| <a id="s55-05"></a>S55-05 | Corporate account settings | Web | `/corporate-accounts/corporate-account-settings` | Who can approve credit and set limits; Whether corporate bookers can book without staff confirmation | S55-01 Corporate accounts | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d55-01"></a>D55-01 | Over credit limit | Warn and ask for approval | S55-02 Corporate detail |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
