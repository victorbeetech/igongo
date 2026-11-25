# S78. Receipts & Invoicing

[All screens](README.md) · [Module spec](../../modules/78-receipts-invoicing.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s78-01"></a>S78-01 | Documents | Web | `/receipts-invoicing/documents` | Receipts, invoices, quotes and credit notes | Role home | S78-02 Document view, S78-03 Document templates, S78-04 Number series |
| <a id="s78-02"></a>S78-02 | Document view | App, Web, Public | `/receipts-invoicing/document-view/:id` | One document with QR check | S78-01 Documents, S78-06 My receipts, [S55-04 Company portal](55-corporate-accounts.md#s55-04), [S77-08 Record cash payment](77-payments.md#s77-08) | D78-01 Send document, D78-02 Credit note |
| <a id="s78-03"></a>S78-03 | Document templates | Web | `/receipts-invoicing/document-templates` | Designs per document type and outlet | S78-01 Documents | Back only |
| <a id="s78-04"></a>S78-04 | Number series | Web | `/receipts-invoicing/number-series` | Prefixes and counters per document type | S78-01 Documents | Back only |
| <a id="s78-05"></a>S78-05 | Check a receipt | Public | `/receipts-invoicing/check-a-receipt` | Scan the QR to confirm a receipt is real | [S75-01 Website home](75-public-website.md#s75-01) | Back only |
| <a id="s78-06"></a>S78-06 | My receipts | App | `/receipts-invoicing/my-receipts` | The guest's receipts and invoices | Role home, [S54-05 My account](54-crm-guests.md#s54-05) | S78-02 Document view |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d78-01"></a>D78-01 | Send document | Email, WhatsApp or print | S78-02 Document view |
| <a id="d78-02"></a>D78-02 | Credit note | Reason and amount | S78-02 Document view |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
