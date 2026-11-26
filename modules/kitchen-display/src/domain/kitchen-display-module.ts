/**
 * Kitchen production (module 63) as a records module: its code prefix and the
 * set-up a new hotel starts with. The super admin changes the record
 * types, fields and statuses on the module's settings screen; this file
 * is only the starting point. Everything else comes from @igongo/records-kit.
 * Spec: docs/modules/63-kitchen-display.md
 */

import { choice, field, steps, type RecordModule } from "@igongo/records-kit";

export const kitchenDisplayModule: RecordModule = {
  key: "kitchen-display",
  /** Codes look like KD-0042. */
  prefix: "KD",
  noun: "entry",
  defaults: {
    comments: true,
    notice: "",
    types: [
      {
        key: "production",
        name: "Production item",
        active: true,
        fields: [
          field("dish", "Dish", "text", { required: true, inList: true }),
          field("quantity", "Quantity", "text", { required: true, inList: true }),
          field("for", "For (order or event)", "text", { inList: true }),
          field("ready_by", "Ready by", "time", { inList: true }),
          choice("station", "Station", ["Hot", "Cold", "Grill", "Pastry", "Bar"]),
        ],
        statuses: steps("To prepare", "Preparing", "Ready.", "Cancelled."),
      },
      {
        key: "waste",
        name: "Food waste",
        active: true,
        fields: [
          field("item", "Item", "text", { required: true, inList: true }),
          field("quantity", "Quantity", "text", { required: true, inList: true }),
          choice("reason", "Reason", ["Spoiled", "Overcooked", "Returned", "Leftover", "Expired", "Other"], { inList: true }),
          field("cost", "Cost (UGX)", "money"),
        ],
        statuses: steps("Logged."),
      },
    ],
  },
};
