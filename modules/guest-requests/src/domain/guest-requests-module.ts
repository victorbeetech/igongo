/**
 * Guest requests (module 60) as a records module: its code prefix and the
 * set-up a new hotel starts with. The super admin changes the record
 * types, fields and statuses on the module's settings screen; this file
 * is only the starting point. Everything else comes from @igongo/records-kit.
 * Spec: docs/modules/60-guest-requests.md
 */

import { choice, field, steps, type RecordModule } from "@igongo/records-kit";

export const guestRequestsModule: RecordModule = {
  key: "guest-requests",
  /** Codes look like GR-0042. */
  prefix: "GR",
  noun: "request",
  defaults: {
    comments: true,
    notice: "",
    types: [
      {
        key: "request",
        name: "Guest request",
        active: true,
      selfService: true,
        fields: [
          choice("what", "What do you need?", ["Extra towels", "Room cleaning", "Maintenance", "Wake-up call", "Transport", "Information", "Other"], { required: true, inList: true }),
          field("details", "Details", "longtext"),
          field("room", "Room or place", "text", { inList: true }),
        ],
        statuses: steps("Received", "On the way", "Done.", "Cancelled."),
      },
    ],
  },
};
