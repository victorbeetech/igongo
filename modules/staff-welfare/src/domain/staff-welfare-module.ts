/**
 * Staff requests and welfare (module 36) as a records module: its code prefix and the
 * set-up a new hotel starts with. The super admin changes the record
 * types, fields and statuses on the module's settings screen; this file
 * is only the starting point. Everything else comes from @igongo/records-kit.
 * Spec: docs/modules/36-staff-welfare.md
 */

import { choice, field, steps, type RecordModule } from "@igongo/records-kit";

export const staffWelfareModule: RecordModule = {
  key: "staff-welfare",
  /** Codes look like WF-0042. */
  prefix: "WF",
  noun: "request",
  defaults: {
    comments: true,
    notice: "",
    types: [
      {
        key: "request",
        name: "Staff request",
        active: true,
      selfService: true,
        fields: [
          choice("kind", "Request", ["Uniform", "Letter", "Salary certificate", "Grievance", "Equipment", "Other"], { required: true, inList: true }),
          field("details", "Details", "longtext", { required: true }),
        ],
        statuses: steps("Requested", "In progress", "Done.", "Declined."),
      },
      {
        key: "welfare",
        name: "Welfare support",
        active: true,
        fields: [
          field("person", "Staff member", "staff", { required: true, inList: true }),
          choice("reason", "Reason", ["Bereavement", "Wedding", "Sickness", "Birth", "Other"], { inList: true }),
          field("amount", "Amount (UGX)", "money", { inList: true }),
          field("notes", "Notes", "longtext"),
        ],
        statuses: steps("Requested", "Approved!", "Done.", "Rejected."),
      },
    ],
  },
};
