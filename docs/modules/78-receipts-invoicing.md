# 78. Receipts & Invoicing

**Group:** Money and insight · **Module key:** `receipts-invoicing` · [All modules](README.md)

## Summary

Produces every receipt, invoice, quote, credit note and statement, in the hotel's brand, numbered correctly and checkable by QR code.

## Features

### Documents
- Receipts, tax invoices, pro-forma invoices, quotes, credit notes, debit notes and statements.
- Templates per document type and outlet, designed in a drag-and-drop editor, with logo, footer and terms.
- Paper sizes: thermal 58 mm and 80 mm, A4 and A5.

### Numbering
- Separate number series per document type and outlet, with prefixes and year resets, such as `RST-2026-000123`.
- No gaps and no duplicates, even when devices are offline.

### Taxes
- Tax lines from [Prices, Taxes & Discounts](76-pricing-tax.md).
- Ready for URA electronic invoicing (EFRIS) if the hotel needs it.

### Delivery
- Print on a station printer.
- Send by SMS, WhatsApp or email, or show in the guest's app.
- Download as PDF.

### Control
- QR code on every document that anyone can scan to confirm it is genuine.
- Reprints marked "COPY", with who reprinted and why.
- Void with reason and approval.
- Credit notes linked to the original invoice.
- Invoice due dates, reminders and overdue lists for credit clients.
- Search any document years back.

## Super admin options
- Templates, number series and prefixes.
- Default delivery channel per module.
- Who can reprint, void and issue credit notes.
- Invoice terms and reminder schedule.


## Depends on

- [Prices, Taxes & Discounts](76-pricing-tax.md)
- [Payments](77-payments.md)
- [Files & Media](11-files-media.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `receipt.issued`
- `invoice.issued`
- `invoice.overdue`
- `creditnote.issued`
- `document.voided`
- `document.reprinted`
- `document.verified`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
