/**
 * Visitors (module 20) as a records module: its code prefix and the
 * set-up a new hotel starts with. The super admin changes the record
 * types, fields and statuses on the module's settings screen; this file
 * is only the starting point. Everything else comes from @igongo/records-kit.
 * Spec: docs/modules/20-visitor-management.md
 */

import { choice, field, steps, type RecordModule } from "@igongo/records-kit";

export const visitorManagementModule: RecordModule = {
  key: "visitor-management",
  /** Codes look like VS-0042. */
  prefix: "VS",
  noun: "visitor",
  defaults: {
    comments: true,
    notice: "",
    types: [
      {
        key: "visitor",
        name: "Visitor",
        active: true,
      selfService: true,
        fields: [
          field("name", "Name", "text", { required: true, inList: true }),
          field("phone", "Phone", "phone"),
          field("company", "Company", "text", { inList: true }),
          field("host", "Visiting", "staff", { inList: true }),
          field("purpose", "Purpose", "text", { inList: true }),
          field("id_number", "ID number", "text"),
          field("vehicle", "Vehicle plate", "text"),
          field("photo", "Photo", "photo"),
        ],
        statuses: steps("Expected", "On site", "Left.", "Refused."),
      },
      {
        key: "contractor",
        name: "Contractor",
        active: true,
        fields: [
          field("company", "Company", "text", { required: true, inList: true }),
          field("contact", "Contact person", "text", { inList: true }),
          field("phone", "Phone", "phone"),
          field("work", "Work", "longtext"),
          field("from", "From", "date"),
          field("to", "To", "date"),
          field("insurance", "Insurance checked", "yesno"),
        ],
        statuses: steps("Approved!", "On site", "Finished."),
      },
      {
        key: "vehicle",
        name: "Gate vehicle",
        active: true,
        fields: [
          field("plate", "Plate", "text", { required: true, inList: true }),
          field("driver", "Driver", "text", { inList: true }),
          field("purpose", "Purpose", "text"),
          choice("way", "In or out", ["In", "Out"], { inList: true }),
        ],
        statuses: steps("In", "Out."),
      },
      {
        key: "blacklist",
        name: "Blacklist entry",
        active: true,
        fields: [
          field("name", "Name", "text", { required: true, inList: true }),
          field("id_number", "ID number", "text"),
          field("reason", "Reason", "longtext", { required: true }),
          field("photo", "Photo", "photo"),
        ],
        statuses: steps("Barred!", "Lifted."),
      },
    ],
  },
};
