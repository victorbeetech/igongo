/**
 * Access zones (module 19) as a records module: its code prefix and the
 * set-up a new hotel starts with. The super admin changes the record
 * types, fields and statuses on the module's settings screen; this file
 * is only the starting point. Everything else comes from @igongo/records-kit.
 * Spec: docs/modules/19-access-zones.md
 */

import { choice, field, steps, type RecordModule } from "@igongo/records-kit";

export const accessZonesModule: RecordModule = {
  key: "access-zones",
  /** Codes look like AZ-0042. */
  prefix: "AZ",
  noun: "zone",
  defaults: {
    comments: true,
    notice: "",
    types: [
      {
        key: "zone",
        name: "Zone",
        active: true,
        fields: [
          field("name", "Name", "text", { required: true, inList: true }),
          field("who", "Who may enter", "longtext", { required: true }),
          field("hours", "When", "text", { inList: true }),
          choice("method", "Entry by", ["Staff card", "Wristband", "QR code", "Escort"], { inList: true }),
        ],
        statuses: steps("Active", "Off."),
      },
      {
        key: "pass",
        name: "Temporary pass",
        active: true,
      selfService: true,
        fields: [
          field("person", "Person", "text", { required: true, inList: true }),
          field("zone", "Zone", "text", { required: true, inList: true }),
          field("from", "From", "date", { inList: true }),
          field("to", "To", "date", { inList: true }),
          field("reason", "Reason", "text"),
        ],
        statuses: steps("Requested", "Approved!", "Expired.", "Refused."),
      },
      {
        key: "entry",
        name: "Entry log",
        active: true,
        fields: [
          field("person", "Person", "text", { required: true, inList: true }),
          field("zone", "Zone", "text", { inList: true }),
          choice("way", "In or out", ["In", "Out"], { inList: true }),
          choice("result", "Result", ["Allowed", "Refused"], { inList: true }),
        ],
        statuses: steps("Logged."),
      },
    ],
  },
};
