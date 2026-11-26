/**
 * Organisation (module 15) as a records module: its code prefix and the
 * set-up a new hotel starts with. The super admin changes the record
 * types, fields and statuses on the module's settings screen; this file
 * is only the starting point. Everything else comes from @igongo/records-kit.
 * Spec: docs/modules/15-locations-departments.md
 */

import { choice, field, steps, type RecordModule } from "@igongo/records-kit";

export const locationsDepartmentsModule: RecordModule = {
  key: "locations-departments",
  /** Codes look like OR-0042. */
  prefix: "OR",
  noun: "entry",
  defaults: {
    comments: true,
    notice: "",
    types: [
      {
        key: "department",
        name: "Department",
        active: true,
        fields: [
          field("name", "Name", "text", { required: true, inList: true }),
          field("head", "Head of department", "staff", { inList: true }),
          field("parent", "Part of", "text"),
          field("phone", "Phone", "phone"),
        ],
        statuses: steps("Active", "Closed."),
      },
      {
        key: "location",
        name: "Location or area",
        active: true,
        fields: [
          field("name", "Name", "text", { required: true, inList: true }),
          choice("kind", "Kind", ["Building", "Room", "Hall", "Garden", "Kitchen", "Store", "Office", "Gate", "Pool", "Museum", "Other"], { inList: true }),
          field("parent", "Inside", "text"),
        ],
        statuses: steps("Active", "Closed."),
      },
      {
        key: "outlet",
        name: "Outlet",
        active: true,
        fields: [
          field("name", "Name", "text", { required: true, inList: true }),
          choice("kind", "Kind", ["Restaurant", "Coffee shop", "Kitchen", "Shop", "Pool bar", "Other"], { inList: true }),
          field("hours", "Opening hours", "text"),
        ],
        statuses: steps("Open", "Closed."),
      },
      {
        key: "cost_centre",
        name: "Cost centre",
        active: true,
        fields: [
          field("code", "Code", "text", { required: true, inList: true }),
          field("name", "Name", "text", { required: true, inList: true }),
          field("owner", "Owner", "staff"),
        ],
        statuses: steps("Active", "Closed."),
      },
    ],
  },
};
