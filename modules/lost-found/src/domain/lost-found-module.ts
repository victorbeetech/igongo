/**
 * Lost and found (module 46) as a records module: its code prefix and the
 * set-up a new hotel starts with. The super admin changes the record
 * types, fields and statuses on the module's settings screen; this file
 * is only the starting point. Everything else comes from @igongo/records-kit.
 * Spec: docs/modules/46-lost-found.md
 */

import { field, steps, type RecordModule } from "@igongo/records-kit";

export const lostFoundModule: RecordModule = {
  key: "lost-found",
  /** Codes look like LF-0042. */
  prefix: "LF",
  noun: "item",
  defaults: {
    comments: true,
    notice: "",
    types: [
      {
        key: "found",
        name: "Found item",
        active: true,
        fields: [
          field("item", "Item", "text", { required: true, inList: true }),
          field("found_at", "Where it was found", "text", { required: true, inList: true }),
          field("finder", "Found by", "text"),
          field("photo", "Photo", "photo"),
          field("shelf", "Kept at", "text", { inList: true }),
        ],
        statuses: steps("Found", "Claimed", "Handed over.", "Disposed."),
      },
      {
        key: "lost",
        name: "Lost item report",
        active: true,
      selfService: true,
        fields: [
          field("item", "What I lost", "text", { required: true, inList: true }),
          field("lost_at", "Where", "text", { inList: true }),
          field("lost_on", "When", "date"),
          field("phone", "Phone", "phone", { required: true }),
          field("details", "Details", "longtext"),
        ],
        statuses: steps("Reported", "Matched", "Returned.", "Not found."),
      },
    ],
  },
};
