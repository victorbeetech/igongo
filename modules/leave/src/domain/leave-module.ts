/**
 * Leave (module 27) as a records module: its code prefix and the
 * set-up a new hotel starts with. The super admin changes the record
 * types, fields and statuses on the module's settings screen; this file
 * is only the starting point. Everything else comes from @igongo/records-kit.
 * Spec: docs/modules/27-leave.md
 */

import { choice, field, steps, type RecordModule } from "@igongo/records-kit";

export const leaveModule: RecordModule = {
  key: "leave",
  /** Codes look like LV-0042. */
  prefix: "LV",
  noun: "leave request",
  defaults: {
    comments: true,
    notice: "",
    types: [
      {
        key: "leave",
        name: "Leave request",
        active: true,
      selfService: true,
        fields: [
          choice("kind", "Leave type", ["Annual", "Sick", "Maternity", "Paternity", "Compassionate", "Study", "Unpaid"], { required: true, inList: true }),
          field("days", "Days", "number", { required: true, inList: true }),
          field("last_day", "Last day", "date", { inList: true }),
          field("reason", "Reason", "text"),
          field("note", "Doctor's note", "photo"),
          field("cover", "Covered by", "staff"),
        ],
        statuses: steps("Requested", "Approved!", "Taken.", "Rejected.", "Cancelled."),
      },
    ],
  },
};
