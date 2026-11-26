/**
 * Security (module 45) as a records module: its code prefix and the
 * set-up a new hotel starts with. The super admin changes the record
 * types, fields and statuses on the module's settings screen; this file
 * is only the starting point. Everything else comes from @igongo/records-kit.
 * Spec: docs/modules/45-security-incidents.md
 */

import { choice, field, steps, type RecordModule } from "@igongo/records-kit";

export const securityIncidentsModule: RecordModule = {
  key: "security-incidents",
  /** Codes look like SC-0042. */
  prefix: "SC",
  noun: "incident",
  defaults: {
    comments: true,
    notice: "",
    types: [
      {
        key: "incident",
        name: "Incident",
        active: true,
      selfService: true,
        fields: [
          field("what", "What happened", "text", { required: true, inList: true }),
          choice("kind", "Kind", ["Theft", "Fight", "Injury", "Fire", "Trespass", "Damage", "Suspicious", "Other"], { inList: true }),
          field("details", "Details", "longtext"),
          field("people", "People involved", "text"),
          field("photo", "Photo", "photo"),
          field("police", "Police called", "yesno"),
        ],
        statuses: steps("Reported", "Investigating", "Closed."),
      },
      {
        key: "patrol",
        name: "Patrol round",
        active: true,
        fields: [
          field("route", "Route", "text", { required: true, inList: true }),
          field("checkpoints", "Checkpoints passed", "longtext"),
          field("issues", "Anything found", "longtext"),
        ],
        statuses: steps("Started", "Done."),
      },
      {
        key: "panic",
        name: "Panic alert",
        active: true,
      selfService: true,
        fields: [
          field("where", "Where", "text", { required: true, inList: true }),
          field("what", "What is wrong", "text"),
        ],
        statuses: steps("Raised", "Responding", "Resolved."),
      },
    ],
  },
};
