/**
 * Key control (module 21) as a records module: its code prefix and the
 * set-up a new hotel starts with. The super admin changes the record
 * types, fields and statuses on the module's settings screen; this file
 * is only the starting point. Everything else comes from @igongo/records-kit.
 * Spec: docs/modules/21-key-control.md
 */

import { choice, field, steps, type RecordModule } from "@igongo/records-kit";

export const keyControlModule: RecordModule = {
  key: "key-control",
  /** Codes look like KY-0042. */
  prefix: "KY",
  noun: "key",
  defaults: {
    comments: true,
    notice: "",
    types: [
      {
        key: "key",
        name: "Key",
        active: true,
        fields: [
          field("label", "Key", "text", { required: true, inList: true }),
          field("opens", "Opens", "text", { inList: true }),
          field("copies", "Copies", "number"),
          choice("kind", "Kind", ["Office", "Store", "Room", "Master", "Vehicle", "Other"], { inList: true }),
        ],
        statuses: steps("In the cabinet", "Signed out", "Lost.", "Retired."),
      },
    ],
  },
};
