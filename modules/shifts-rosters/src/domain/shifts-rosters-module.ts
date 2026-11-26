/**
 * Shifts and rosters (module 26) as a records module: its code prefix and the
 * set-up a new hotel starts with. The super admin changes the record
 * types, fields and statuses on the module's settings screen; this file
 * is only the starting point. Everything else comes from @igongo/records-kit.
 * Spec: docs/modules/26-shifts-rosters.md
 */

import { field, steps, type RecordModule } from "@igongo/records-kit";

export const shiftsRostersModule: RecordModule = {
  key: "shifts-rosters",
  /** Codes look like SH-0042. */
  prefix: "SH",
  noun: "shift",
  defaults: {
    comments: true,
    notice: "",
    types: [
      {
        key: "shift",
        name: "Shift",
        active: true,
        fields: [
          field("person", "Staff member", "staff", { required: true, inList: true }),
          field("start", "Starts", "time", { required: true, inList: true }),
          field("end", "Ends", "time", { required: true, inList: true }),
          field("department", "Department", "text", { inList: true }),
          field("role", "Role", "text"),
        ],
        statuses: steps("Planned", "Worked.", "Cancelled."),
      },
      {
        key: "open_shift",
        name: "Open shift",
        active: true,
        fields: [
          field("start", "Starts", "time", { required: true, inList: true }),
          field("end", "Ends", "time", { required: true, inList: true }),
          field("department", "Department", "text", { inList: true }),
          field("taker", "Taken by", "staff", { inList: true }),
        ],
        statuses: steps("Open", "Filled.", "Cancelled."),
      },
      {
        key: "swap",
        name: "Swap request",
        active: true,
      selfService: true,
        fields: [
          field("with", "Swap with", "staff", { required: true, inList: true }),
          field("my_shift", "My shift (day and time)", "text", { required: true, inList: true }),
          field("their_shift", "Their shift", "text", { inList: true }),
          field("reason", "Reason", "text"),
        ],
        statuses: steps("Requested", "Approved!", "Done.", "Rejected."),
      },
    ],
  },
};
