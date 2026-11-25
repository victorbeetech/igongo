# S76. Prices, Taxes & Discounts

[All screens](README.md) · [Module spec](../../modules/76-pricing-tax.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s76-01"></a>S76-01 | Price lists | Web | `/pricing-tax/price-lists` | Prices per item, outlet, season and guest type | Role home | D76-01 Approve price change, S76-02 Taxes, S76-03 Discounts, S76-04 Price change history |
| <a id="s76-02"></a>S76-02 | Taxes | Web | `/pricing-tax/taxes` | VAT and other taxes with rules | S76-01 Price lists | Back only |
| <a id="s76-03"></a>S76-03 | Discounts | Web | `/pricing-tax/discounts` | Discount rules and limits | S76-01 Price lists | Back only |
| <a id="s76-04"></a>S76-04 | Price change history | Web | `/pricing-tax/price-change-history` | Every price change with who and when | S76-01 Price lists | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d76-01"></a>D76-01 | Approve price change | Approve with effective date | S76-01 Price lists |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
