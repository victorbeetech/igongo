/**
 * Onboarding and exit (module 24) as a records module: its code prefix and the
 * set-up a new hotel starts with. The super admin changes the record
 * types, fields and statuses on the module's settings screen; this file
 * is only the starting point. Everything else comes from @igongo/records-kit.
 * Spec: docs/modules/24-onboarding-exit.md
 */

import { choice, field, steps, type RecordModule } from "@igongo/records-kit";

export const onboardingExitModule: RecordModule = {
  key: "onboarding-exit",
  /** Codes look like OB-0042. */
  prefix: "OB",
  noun: "checklist",
  defaults: {
    comments: true,
    notice: "",
    types: [
      {
        key: "onboarding",
        name: "Onboarding",
        active: true,
        fields: [
          field("person", "New staff member", "staff", { required: true, inList: true }),
          field("start", "Start date", "date", { inList: true }),
          field("card", "Card issued", "yesno"),
          field("uniform", "Uniform given", "yesno"),
          field("training", "Induction done", "yesno"),
          field("account", "App account made", "yesno"),
          field("notes", "Notes", "longtext"),
        ],
        statuses: steps("Started", "Ready.", "Cancelled."),
      },
      {
        key: "exit",
        name: "Exit",
        active: true,
        fields: [
          field("person", "Leaving staff member", "staff", { required: true, inList: true }),
          field("last_day", "Last day", "date", { inList: true }),
          choice("reason", "Reason", ["Resigned", "Contract ended", "Dismissed", "Retired", "Other"], { inList: true }),
          field("card", "Card returned", "yesno"),
          field("keys", "Keys returned", "yesno"),
          field("uniform", "Uniform returned", "yesno"),
          field("final_pay", "Final pay checked", "yesno"),
          field("interview", "Exit interview notes", "longtext"),
        ],
        statuses: steps("Started", "Cleared!", "Left.", "Cancelled."),
      },
    ],
  },
};
