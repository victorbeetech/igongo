/**
 * Training (module 34) as a records module: its code prefix and the
 * set-up a new hotel starts with. The super admin changes the record
 * types, fields and statuses on the module's settings screen; this file
 * is only the starting point. Everything else comes from @igongo/records-kit.
 * Spec: docs/modules/34-training.md
 */

import { choice, field, steps, type RecordModule } from "@igongo/records-kit";

export const trainingModule: RecordModule = {
  key: "training",
  /** Codes look like TR-0042. */
  prefix: "TR",
  noun: "training",
  defaults: {
    comments: true,
    notice: "",
    types: [
      {
        key: "course",
        name: "Course",
        active: true,
        fields: [
          field("name", "Course", "text", { required: true, inList: true }),
          choice("kind", "Kind", ["Food hygiene", "First aid", "Lifeguard", "Fire safety", "Customer care", "Induction", "Other"], { inList: true }),
          field("hours", "Hours", "number"),
          field("material", "Material or link", "text"),
        ],
        statuses: steps("Active", "Retired."),
      },
      {
        key: "session",
        name: "Training session",
        active: true,
        fields: [
          field("course", "Course", "text", { required: true, inList: true }),
          field("trainer", "Trainer", "text", { inList: true }),
          field("place", "Place", "text"),
          field("people", "Staff attending", "longtext"),
        ],
        statuses: steps("Planned", "Held.", "Cancelled."),
      },
      {
        key: "certificate",
        name: "Certificate",
        active: true,
        fields: [
          field("person", "Staff member", "staff", { required: true, inList: true }),
          field("course", "Course", "text", { required: true, inList: true }),
          field("expires", "Expires", "date", { inList: true }),
          field("copy", "Copy", "photo"),
        ],
        statuses: steps("Valid", "Expiring", "Expired."),
      },
      {
        key: "request",
        name: "Training request",
        active: true,
      selfService: true,
        fields: [
          field("course", "Course I want", "text", { required: true, inList: true }),
          field("reason", "Why", "text"),
        ],
        statuses: steps("Requested", "Approved!", "Done.", "Rejected."),
      },
    ],
  },
};
