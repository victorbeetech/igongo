/**
 * Discipline (module 35) as a records module: its code prefix and the
 * set-up a new hotel starts with. The super admin changes the record
 * types, fields and statuses on the module's settings screen; this file
 * is only the starting point. Everything else comes from @igongo/records-kit.
 * Spec: docs/modules/35-discipline.md
 */

import { choice, field, steps, type RecordModule } from "@igongo/records-kit";

export const disciplineModule: RecordModule = {
  key: "discipline",
  /** Codes look like DC-0042. */
  prefix: "DC",
  noun: "case",
  defaults: {
    comments: true,
    notice: "",
    types: [
      {
        key: "case",
        name: "Case",
        active: true,
        fields: [
          field("person", "Staff member", "staff", { required: true, inList: true }),
          field("what", "What happened", "longtext", { required: true }),
          field("when", "Date", "date", { inList: true }),
          field("witness", "Witnesses", "text"),
          field("evidence", "Evidence", "photo"),
          choice("outcome", "Outcome", ["No action", "Verbal warning", "Written warning", "Final warning", "Suspension", "Dismissal"], { inList: true }),
        ],
        statuses: steps("Opened", "Hearing", "Decided!", "Appealed", "Closed."),
      },
    ],
  },
};
