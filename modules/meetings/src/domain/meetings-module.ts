/**
 * Meetings (module 51) as a records module: its code prefix and the
 * set-up a new hotel starts with. The super admin changes the record
 * types, fields and statuses on the module's settings screen; this file
 * is only the starting point. Everything else comes from @igongo/records-kit.
 * Spec: docs/modules/51-meetings.md
 */

import { field, steps, type RecordModule } from "@igongo/records-kit";

export const meetingsModule: RecordModule = {
  key: "meetings",
  /** Codes look like MT-0042. */
  prefix: "MT",
  noun: "meeting",
  defaults: {
    comments: true,
    notice: "",
    types: [
      {
        key: "meeting",
        name: "Meeting",
        active: true,
        fields: [
          field("subject", "Subject", "text", { required: true, inList: true }),
          field("when", "Date", "date", { required: true, inList: true }),
          field("time", "Time", "time", { inList: true }),
          field("place", "Place", "text"),
          field("people", "Invited", "longtext"),
          field("agenda", "Agenda", "longtext"),
          field("minutes", "Minutes", "longtext"),
        ],
        statuses: steps("Planned", "Held", "Minutes approved!.", "Cancelled."),
      },
      {
        key: "action",
        name: "Action item",
        active: true,
        fields: [
          field("what", "Action", "text", { required: true, inList: true }),
          field("meeting", "From meeting", "text", { inList: true }),
        ],
        statuses: steps("Open", "Done.", "Dropped."),
      },
    ],
  },
};
