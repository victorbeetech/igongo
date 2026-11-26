/**
 * Accounting export (module 80) as a records module: its code prefix and the
 * set-up a new hotel starts with. The super admin changes the record
 * types, fields and statuses on the module's settings screen; this file
 * is only the starting point. Everything else comes from @igongo/records-kit.
 * Spec: docs/modules/80-accounting-export.md
 */

import { choice, field, steps, type RecordModule } from "@igongo/records-kit";

export const accountingExportModule: RecordModule = {
  key: "accounting-export",
  /** Codes look like AE-0042. */
  prefix: "AE",
  noun: "export",
  defaults: {
    comments: true,
    notice: "",
    types: [
      {
        key: "batch",
        name: "Export batch",
        active: true,
        fields: [
          choice("what", "What", ["Sales", "Payroll", "Expenses", "Payments", "All"], { required: true, inList: true }),
          field("from", "From", "date", { required: true, inList: true }),
          field("to", "To", "date", { required: true, inList: true }),
          choice("format", "Format", ["CSV", "QuickBooks", "Sage", "Other"]),
        ],
        statuses: steps("Requested", "Exported", "Posted.", "Failed"),
      },
      {
        key: "mapping",
        name: "Account mapping",
        active: true,
        fields: [
          field("item", "Item in this system", "text", { required: true, inList: true }),
          field("account", "Account code", "text", { required: true, inList: true }),
        ],
        statuses: steps("Active", "Retired."),
      },
    ],
  },
};
