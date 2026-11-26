/**
 * Performance (module 33) as a records module: its code prefix and the
 * set-up a new hotel starts with. The super admin changes the record
 * types, fields and statuses on the module's settings screen; this file
 * is only the starting point. Everything else comes from @igongo/records-kit.
 * Spec: docs/modules/33-performance.md
 */

import { choice, field, steps, type RecordModule } from "@igongo/records-kit";

export const performanceModule: RecordModule = {
  key: "performance",
  /** Codes look like PF-0042. */
  prefix: "PF",
  noun: "appraisal",
  defaults: {
    comments: true,
    notice: "",
    types: [
      {
        key: "appraisal",
        name: "Appraisal",
        active: true,
        fields: [
          field("person", "Staff member", "staff", { required: true, inList: true }),
          field("cycle", "Cycle", "text", { inList: true }),
          field("score", "Score (out of 5)", "number", { inList: true }),
          field("strengths", "Strengths", "longtext"),
          field("improve", "To improve", "longtext"),
          field("comments", "Staff comments", "longtext"),
        ],
        statuses: steps("Draft", "Self review", "Manager review", "Agreed!", "Closed."),
      },
      {
        key: "goal",
        name: "Goal",
        active: true,
        fields: [
          field("person", "Staff member", "staff", { required: true, inList: true }),
          field("goal", "Goal", "text", { required: true, inList: true }),
          field("measure", "How it is measured", "text"),
          field("progress", "Progress (%)", "number", { inList: true }),
        ],
        statuses: steps("Set", "On track", "At risk", "Met.", "Missed."),
      },
      {
        key: "probation",
        name: "Probation review",
        active: true,
        fields: [
          field("person", "Staff member", "staff", { required: true, inList: true }),
          field("ends", "Probation ends", "date", { inList: true }),
          choice("outcome", "Outcome", ["Confirm", "Extend", "End"], { inList: true }),
          field("notes", "Notes", "longtext"),
        ],
        statuses: steps("Due", "Reviewed!", "Closed."),
      },
    ],
  },
};
