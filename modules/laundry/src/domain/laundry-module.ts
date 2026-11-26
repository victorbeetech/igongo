/**
 * Laundry (module 44) as a records module: its code prefix and the
 * set-up a new hotel starts with. The super admin changes the record
 * types, fields and statuses on the module's settings screen; this file
 * is only the starting point. Everything else comes from @igongo/records-kit.
 * Spec: docs/modules/44-laundry.md
 */

import { choice, field, steps, type RecordModule } from "@igongo/records-kit";

export const laundryModule: RecordModule = {
  key: "laundry",
  /** Codes look like LD-0042. */
  prefix: "LD",
  noun: "laundry order",
  defaults: {
    comments: true,
    notice: "",
    types: [
      {
        key: "guest",
        name: "Guest laundry",
        active: true,
      selfService: true,
        fields: [
          field("room", "Room", "text", { required: true, inList: true }),
          field("items", "Items", "longtext", { required: true }),
          choice("service", "Service", ["Wash and iron", "Dry clean", "Iron only", "Express"], { inList: true }),
          field("price", "Price (UGX)", "money", { inList: true }),
        ],
        statuses: steps("Requested", "Collected", "Washing", "Ready", "Delivered."),
      },
      {
        key: "linen",
        name: "Linen batch",
        active: true,
        fields: [
          choice("what", "Linen", ["Bed sheets", "Towels", "Pillow cases", "Table cloths", "Napkins", "Bathrobes", "Other"], { required: true, inList: true }),
          field("count", "Pieces", "number", { required: true, inList: true }),
          field("from", "From", "text", { inList: true }),
        ],
        statuses: steps("Received", "Washing", "Returned."),
      },
      {
        key: "uniform",
        name: "Uniform",
        active: true,
        fields: [
          field("person", "Staff member", "staff", { required: true, inList: true }),
          field("item", "Item", "text", { required: true, inList: true }),
          field("size", "Size", "text"),
        ],
        statuses: steps("Issued", "In laundry", "Returned."),
      },
    ],
  },
};
