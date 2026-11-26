/**
 * Loyalty (module 57) as a records module: its code prefix and the
 * set-up a new hotel starts with. The super admin changes the record
 * types, fields and statuses on the module's settings screen; this file
 * is only the starting point. Everything else comes from @igongo/records-kit.
 * Spec: docs/modules/57-loyalty.md
 */

import { choice, field, steps, type RecordModule } from "@igongo/records-kit";

export const loyaltyModule: RecordModule = {
  key: "loyalty",
  /** Codes look like LY-0042. */
  prefix: "LY",
  noun: "points entry",
  defaults: {
    comments: true,
    notice: "",
    types: [
      {
        key: "member",
        name: "Member",
        active: true,
        fields: [
          field("name", "Name", "text", { required: true, inList: true }),
          field("phone", "Phone", "phone", { inList: true }),
          choice("tier", "Tier", ["Bronze", "Silver", "Gold"], { inList: true }),
          field("card", "Card number", "text"),
        ],
        statuses: steps("Active", "Suspended", "Closed."),
      },
      {
        key: "points",
        name: "Points entry",
        active: true,
        fields: [
          field("member", "Member", "text", { required: true, inList: true }),
          field("points", "Points (minus to spend)", "number", { required: true, inList: true }),
          field("reason", "Reason", "text", { inList: true }),
        ],
        statuses: steps("Posted."),
      },
      {
        key: "reward",
        name: "Reward",
        active: true,
        fields: [
          field("name", "Reward", "text", { required: true, inList: true }),
          field("points", "Points needed", "number", { required: true, inList: true }),
          field("stock", "How many left", "number"),
        ],
        statuses: steps("Available", "Ended."),
      },
    ],
  },
};
