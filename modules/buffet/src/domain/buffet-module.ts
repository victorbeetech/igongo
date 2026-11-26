/**
 * Buffet (module 65) as a records module: its code prefix and the
 * set-up a new hotel starts with. The super admin changes the record
 * types, fields and statuses on the module's settings screen; this file
 * is only the starting point. Everything else comes from @igongo/records-kit.
 * Spec: docs/modules/65-buffet.md
 */

import { choice, field, steps, type RecordModule } from "@igongo/records-kit";

export const buffetModule: RecordModule = {
  key: "buffet",
  /** Codes look like BF-0042. */
  prefix: "BF",
  noun: "session",
  defaults: {
    comments: true,
    notice: "",
    types: [
      {
        key: "session",
        name: "Buffet session",
        active: true,
        fields: [
          field("name", "Name", "text", { required: true, inList: true }),
          choice("meal", "Meal", ["Breakfast", "Lunch", "Dinner", "Event"], { inList: true }),
          field("price", "Price per person (UGX)", "money", { inList: true }),
          field("capacity", "Places", "number"),
          field("served", "Served so far", "number", { inList: true }),
        ],
        statuses: steps("Planned", "Open", "Closed."),
      },
      {
        key: "ticket",
        name: "Buffet ticket",
        active: true,
      selfService: true,
        fields: [
          field("session", "Session", "text", { required: true, inList: true }),
          field("people", "People", "number", { required: true, inList: true }),
          field("phone", "Phone", "phone"),
        ],
        statuses: steps("Booked", "Served.", "Cancelled."),
      },
    ],
  },
};
