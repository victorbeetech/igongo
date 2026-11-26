/**
 * Cash-up (module 79) as a records module: its code prefix and the
 * set-up a new hotel starts with. The super admin changes the record
 * types, fields and statuses on the module's settings screen; this file
 * is only the starting point. Everything else comes from @igongo/records-kit.
 * Spec: docs/modules/79-cash-up.md
 */

import { field, steps, type RecordModule } from "@igongo/records-kit";

export const cashUpModule: RecordModule = {
  key: "cash-up",
  /** Codes look like CU-0042. */
  prefix: "CU",
  noun: "cash-up",
  defaults: {
    comments: true,
    notice: "",
    types: [
      {
        key: "cashup",
        name: "Cash-up",
        active: true,
      selfService: true,
        fields: [
          field("outlet", "Outlet or till", "text", { required: true, inList: true }),
          field("expected", "Expected (UGX)", "money", { required: true, inList: true }),
          field("cash", "Cash counted (UGX)", "money", { required: true, inList: true }),
          field("mobile", "Mobile money (UGX)", "money"),
          field("card", "Card (UGX)", "money"),
          field("note", "Note on any difference", "text"),
        ],
        statuses: steps("Submitted", "Checked!", "Closed."),
      },
      {
        key: "float",
        name: "Till opening",
        active: true,
      selfService: true,
        fields: [
          field("outlet", "Outlet or till", "text", { required: true, inList: true }),
          field("float", "Opening float (UGX)", "money", { required: true, inList: true }),
        ],
        statuses: steps("Open", "Closed."),
      },
    ],
  },
};
