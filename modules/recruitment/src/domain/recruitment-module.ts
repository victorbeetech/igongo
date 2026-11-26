/**
 * Recruitment (module 23) as a records module: its code prefix and the
 * set-up a new hotel starts with. The super admin changes the record
 * types, fields and statuses on the module's settings screen; this file
 * is only the starting point. Everything else comes from @igongo/records-kit.
 * Spec: docs/modules/23-recruitment.md
 */

import { field, steps, type RecordModule } from "@igongo/records-kit";

export const recruitmentModule: RecordModule = {
  key: "recruitment",
  /** Codes look like RC-0042. */
  prefix: "RC",
  noun: "applicant",
  defaults: {
    comments: true,
    notice: "",
    types: [
      {
        key: "vacancy",
        name: "Vacancy",
        active: true,
        fields: [
          field("title", "Job title", "text", { required: true, inList: true }),
          field("department", "Department", "text", { inList: true }),
          field("openings", "Openings", "number"),
          field("closes", "Closing date", "date", { inList: true }),
          field("description", "Description", "longtext"),
        ],
        statuses: steps("Requested", "Approved!", "Open", "Closed."),
      },
      {
        key: "application",
        name: "Application",
        active: true,
      selfService: true,
        fields: [
          field("vacancy", "Job", "text", { required: true, inList: true }),
          field("name", "Name", "text", { required: true, inList: true }),
          field("phone", "Phone", "phone", { required: true }),
          field("email", "Email", "text"),
          field("cv", "CV or photo of it", "photo"),
          field("notes", "About me", "longtext"),
        ],
        statuses: steps("Applied", "Shortlisted", "Interview", "Offered!", "Hired.", "Not taken."),
      },
      {
        key: "interview",
        name: "Interview",
        active: true,
        fields: [
          field("applicant", "Applicant", "text", { required: true, inList: true }),
          field("when", "Date", "date", { required: true, inList: true }),
          field("time", "Time", "time"),
          field("panel", "Panel", "text"),
          field("score", "Score (out of 100)", "number", { inList: true }),
          field("notes", "Notes", "longtext"),
        ],
        statuses: steps("Planned", "Scored.", "Cancelled."),
      },
    ],
  },
};
