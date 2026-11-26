/**
 * Surveys and polls (module 52) as a records module: its code prefix and the
 * set-up a new hotel starts with. The super admin changes the record
 * types, fields and statuses on the module's settings screen; this file
 * is only the starting point. Everything else comes from @igongo/records-kit.
 * Spec: docs/modules/52-surveys-polls.md
 */

import { choice, field, steps, type RecordModule } from "@igongo/records-kit";

export const surveysPollsModule: RecordModule = {
  key: "surveys-polls",
  /** Codes look like SV-0042. */
  prefix: "SV",
  noun: "answer",
  defaults: {
    comments: true,
    notice: "",
    types: [
      {
        key: "staff_survey",
        name: "Staff satisfaction survey",
        active: true,
      selfService: true,
        fields: [
          choice("happy", "How happy are you at work?", ["Very happy", "Happy", "Okay", "Unhappy"], { required: true, inList: true }),
          field("best", "What do you like most?", "longtext"),
          field("change", "What should we change?", "longtext"),
        ],
        statuses: steps("Answered."),
      },
    ],
  },
};
