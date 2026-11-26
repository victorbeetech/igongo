/**
 * Campaigns (module 58) as a records module: its code prefix and the
 * set-up a new hotel starts with. The super admin changes the record
 * types, fields and statuses on the module's settings screen; this file
 * is only the starting point. Everything else comes from @igongo/records-kit.
 * Spec: docs/modules/58-campaigns.md
 */

import { choice, field, steps, type RecordModule } from "@igongo/records-kit";

export const campaignsModule: RecordModule = {
  key: "campaigns",
  /** Codes look like CP-0042. */
  prefix: "CP",
  noun: "campaign",
  defaults: {
    comments: true,
    notice: "",
    types: [
      {
        key: "campaign",
        name: "Campaign",
        active: true,
        fields: [
          field("name", "Name", "text", { required: true, inList: true }),
          choice("channel", "Channel", ["SMS", "WhatsApp", "Email", "Push", "Social media"], { inList: true }),
          field("audience", "Audience", "text"),
          field("message", "Message", "longtext", { required: true }),
          field("send_on", "Send on", "date", { inList: true }),
          field("reached", "People reached", "number", { inList: true }),
        ],
        statuses: steps("Draft", "Approved!", "Sent", "Finished.", "Cancelled."),
      },
    ],
  },
};
