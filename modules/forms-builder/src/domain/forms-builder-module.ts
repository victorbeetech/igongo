/**
 * Forms (module 8) as a records module: its code prefix and the
 * set-up a new hotel starts with. The super admin changes the record
 * types, fields and statuses on the module's settings screen; this file
 * is only the starting point. Everything else comes from @igongo/records-kit.
 * Spec: docs/modules/08-forms-builder.md
 */

import { field, steps, type RecordModule } from "@igongo/records-kit";

export const formsBuilderModule: RecordModule = {
  key: "forms-builder",
  /** Codes look like FM-0042. */
  prefix: "FM",
  noun: "form",
  defaults: {
    comments: true,
    notice: "",
    types: [
      {
        key: "general_form",
        name: "General form",
        active: true,
      selfService: true,
        fields: [
          field("details", "Details", "longtext", { required: true }),
        ],
        statuses: steps("Submitted", "Reviewed."),
      },
    ],
  },
};
