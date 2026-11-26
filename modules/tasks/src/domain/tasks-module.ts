/**
 * Tasks (module 42) as a records module: its code prefix and the
 * set-up a new hotel starts with. The super admin changes the record
 * types, fields and statuses on the module's settings screen; this file
 * is only the starting point. Everything else comes from @igongo/records-kit.
 * Spec: docs/modules/42-tasks.md
 */

import { choice, field, steps, type RecordModule } from "@igongo/records-kit";

export const tasksModule: RecordModule = {
  key: "tasks",
  /** Codes look like TK-0042. */
  prefix: "TK",
  noun: "task",
  defaults: {
    comments: true,
    notice: "",
    types: [
      {
        key: "task",
        name: "Task",
        active: true,
        fields: [
          field("what", "What to do", "text", { required: true, inList: true }),
          field("details", "Details", "longtext"),
          choice("priority", "Priority", ["Low", "Normal", "High", "Urgent"], { inList: true }),
          choice("repeat", "Repeats", ["Never", "Daily", "Weekly", "Monthly"]),
          field("photo", "Photo", "photo"),
        ],
        statuses: steps("To do", "Doing", "Done.", "Cancelled."),
      },
    ],
  },
};
