/**
 * Feedback and complaints (module 56) as a records module: its code prefix and the
 * set-up a new hotel starts with. The super admin changes the record
 * types, fields and statuses on the module's settings screen; this file
 * is only the starting point. Everything else comes from @igongo/records-kit.
 * Spec: docs/modules/56-guest-feedback.md
 */

import { choice, field, steps, type RecordModule } from "@igongo/records-kit";

export const guestFeedbackModule: RecordModule = {
  key: "guest-feedback",
  /** Codes look like FB-0042. */
  prefix: "FB",
  noun: "feedback",
  defaults: {
    comments: true,
    notice: "",
    types: [
      {
        key: "feedback",
        name: "Feedback",
        active: true,
      selfService: true,
        fields: [
          choice("about", "About", ["Room", "Food", "Service", "Pool", "Museum", "Event", "Spa", "Other"], { required: true, inList: true }),
          field("stars", "Stars (1 to 5)", "number", { required: true, inList: true }),
          field("comment", "Comment", "longtext"),
        ],
        statuses: steps("Received", "Read."),
      },
      {
        key: "complaint",
        name: "Complaint",
        active: true,
      selfService: true,
        fields: [
          choice("about", "About", ["Room", "Food", "Service", "Pool", "Museum", "Event", "Spa", "Billing", "Other"], { required: true, inList: true }),
          field("what", "What went wrong", "longtext", { required: true }),
          field("phone", "Phone", "phone"),
          field("fix", "What we did", "longtext"),
        ],
        statuses: steps("Received", "Investigating", "Resolved.", "Closed."),
      },
      {
        key: "review",
        name: "Online review",
        active: true,
        fields: [
          choice("site", "Site", ["Google", "TripAdvisor", "Booking.com", "Facebook", "Other"], { required: true, inList: true }),
          field("stars", "Stars", "number", { inList: true }),
          field("text", "Review", "longtext"),
          field("reply", "Our reply", "longtext"),
        ],
        statuses: steps("New", "Replied."),
      },
    ],
  },
};
