/**
 * Receipts and invoices (module 78) as a records module: its code prefix and the
 * set-up a new hotel starts with. The super admin changes the record
 * types, fields and statuses on the module's settings screen; this file
 * is only the starting point. Everything else comes from @igongo/records-kit.
 * Spec: docs/modules/78-receipts-invoicing.md
 */

import { field, steps, type RecordModule } from "@igongo/records-kit";

export const receiptsInvoicingModule: RecordModule = {
  key: "receipts-invoicing",
  /** Codes look like DO-0042. */
  prefix: "DO",
  noun: "document",
  defaults: {
    comments: true,
    notice: "",
    types: [
      {
        key: "invoice",
        name: "Invoice",
        active: true,
        fields: [
          field("to", "Bill to", "text", { required: true, inList: true }),
          field("items", "Items", "longtext", { required: true }),
          field("amount", "Total (UGX)", "money", { required: true, inList: true }),
          field("due", "Due", "date", { inList: true }),
          field("tin", "Customer TIN", "text"),
        ],
        statuses: steps("Draft", "Sent", "Part paid", "Paid.", "Cancelled."),
      },
      {
        key: "quote",
        name: "Quote",
        active: true,
        fields: [
          field("to", "For", "text", { required: true, inList: true }),
          field("items", "Items", "longtext", { required: true }),
          field("amount", "Total (UGX)", "money", { required: true, inList: true }),
          field("valid_until", "Valid until", "date", { inList: true }),
        ],
        statuses: steps("Draft", "Sent", "Accepted.", "Declined."),
      },
      {
        key: "credit_note",
        name: "Credit note",
        active: true,
        fields: [
          field("to", "For", "text", { required: true, inList: true }),
          field("invoice", "Against invoice", "text", { inList: true }),
          field("amount", "Amount (UGX)", "money", { required: true, inList: true }),
          field("reason", "Reason", "text", { required: true }),
        ],
        statuses: steps("Draft", "Approved!", "Issued."),
      },
    ],
  },
};
