/**
 * Petty cash (module 37) as a records module: its code prefix and the
 * set-up a new hotel starts with. The super admin changes the record
 * types, fields and statuses on the module's settings screen; this file
 * is only the starting point. Everything else comes from @igongo/records-kit.
 * Spec: docs/modules/37-petty-cash.md
 */

import { field, steps, type RecordModule } from "@igongo/records-kit";

export const pettyCashModule: RecordModule = {
  key: "petty-cash",
  /** Codes look like PC-0042. */
  prefix: "PC",
  noun: "claim",
  defaults: {
    comments: true,
    notice: "",
    types: [
      {
        key: "claim",
        name: "Expense claim",
        active: true,
      selfService: true,
        fields: [
          field("what", "What it was for", "text", { required: true, inList: true }),
          field("amount", "Amount (UGX)", "money", { required: true, inList: true }),
          field("spent_on", "Date spent", "date", { inList: true }),
          field("receipt", "Receipt photo", "photo"),
          field("department", "Department", "text"),
        ],
        statuses: steps("Submitted", "Approved!", "Paid.", "Rejected."),
      },
      {
        key: "topup",
        name: "Box top-up",
        active: true,
        fields: [
          field("amount", "Amount (UGX)", "money", { required: true, inList: true }),
          field("source", "From", "text"),
        ],
        statuses: steps("Requested", "Approved!", "Received."),
      },
      {
        key: "count",
        name: "Cash count",
        active: true,
        fields: [
          field("expected", "Expected (UGX)", "money", { required: true, inList: true }),
          field("counted", "Counted (UGX)", "money", { required: true, inList: true }),
          field("note", "Note on any difference", "text"),
        ],
        statuses: steps("Counted", "Checked!."),
      },
    ],
  },
};
