/**
 * Assets (module 41) as a records module: its code prefix and the
 * set-up a new hotel starts with. The super admin changes the record
 * types, fields and statuses on the module's settings screen; this file
 * is only the starting point. Everything else comes from @igongo/records-kit.
 * Spec: docs/modules/41-asset-register.md
 */

import { choice, field, steps, type RecordModule } from "@igongo/records-kit";

export const assetRegisterModule: RecordModule = {
  key: "asset-register",
  /** Codes look like AS-0042. */
  prefix: "AS",
  noun: "asset",
  defaults: {
    comments: true,
    notice: "",
    types: [
      {
        key: "asset",
        name: "Asset",
        active: true,
        fields: [
          field("name", "Name", "text", { required: true, inList: true }),
          choice("category", "Category", ["Furniture", "Kitchen equipment", "Electronics", "Vehicle", "Linen", "Pool equipment", "Museum piece", "Tools", "Other"], { inList: true }),
          field("location", "Location", "text", { inList: true }),
          field("serial", "Serial number", "text"),
          field("bought", "Bought on", "date"),
          field("cost", "Cost (UGX)", "money"),
          field("holder", "Kept by", "staff"),
          field("photo", "Photo", "photo"),
        ],
        statuses: steps("In use", "In repair", "In store", "Disposed."),
      },
      {
        key: "count",
        name: "Asset count",
        active: true,
        fields: [
          field("area", "Area counted", "text", { required: true, inList: true }),
          field("found", "Items found", "number", { inList: true }),
          field("missing", "Missing items", "longtext"),
        ],
        statuses: steps("Counting", "Done."),
      },
    ],
  },
};
