/**
 * Housekeeping (module 43) as a records module: its code prefix and the
 * set-up a new hotel starts with. The super admin changes the record
 * types, fields and statuses on the module's settings screen; this file
 * is only the starting point. Everything else comes from @igongo/records-kit.
 * Spec: docs/modules/43-housekeeping.md
 */

import { choice, field, steps, type RecordModule } from "@igongo/records-kit";

export const housekeepingModule: RecordModule = {
  key: "housekeeping",
  /** Codes look like HK-0042. */
  prefix: "HK",
  noun: "room",
  defaults: {
    comments: true,
    notice: "",
    types: [
      {
        key: "room",
        name: "Room",
        active: true,
        fields: [
          field("room", "Room", "text", { required: true, inList: true }),
          field("kind", "Room type", "text", { inList: true }),
          field("floor", "Floor or block", "text"),
          field("occupied", "Guest in", "yesno", { inList: true }),
          field("notes", "Notes", "longtext"),
        ],
        statuses: steps("Dirty", "Cleaning", "Clean", "Inspected", "Out of order"),
      },
      {
        key: "clean",
        name: "Cleaning job",
        active: true,
        fields: [
          field("room", "Room", "text", { required: true, inList: true }),
          choice("kind", "Kind", ["Departure", "Stay-over", "Deep clean", "Turn-down"], { inList: true }),
          field("minibar", "Minibar used", "text"),
          field("amenities", "Amenities restocked", "yesno"),
          field("issues", "Issues found", "longtext"),
          field("photo", "Photo", "photo"),
        ],
        statuses: steps("Assigned", "Cleaning", "Done", "Inspected.", "Failed"),
      },
    ],
  },
};
