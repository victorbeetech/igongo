/**
 * Company calendar (module 53) as a records module: its code prefix and the
 * set-up a new hotel starts with. The super admin changes the record
 * types, fields and statuses on the module's settings screen; this file
 * is only the starting point. Everything else comes from @igongo/records-kit.
 * Spec: docs/modules/53-company-calendar.md
 */

import { choice, field, steps, type RecordModule } from "@igongo/records-kit";

export const companyCalendarModule: RecordModule = {
  key: "company-calendar",
  /** Codes look like CL-0042. */
  prefix: "CL",
  noun: "entry",
  defaults: {
    comments: true,
    notice: "",
    types: [
      {
        key: "entry",
        name: "Calendar entry",
        active: true,
        fields: [
          field("title", "Title", "text", { required: true, inList: true }),
          choice("kind", "Kind", ["Public holiday", "Event", "Meeting", "Training", "Birthday", "Closure", "Other"], { inList: true }),
          field("ends", "Ends", "date"),
          field("time", "Time", "time"),
          field("audience", "Who it is for", "text"),
        ],
        statuses: steps("Planned", "Cancelled."),
      },
    ],
  },
};
