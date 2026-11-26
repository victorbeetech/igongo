/**
 * Knowledge base (module 48) as a records module: its code prefix and the
 * set-up a new hotel starts with. The super admin changes the record
 * types, fields and statuses on the module's settings screen; this file
 * is only the starting point. Everything else comes from @igongo/records-kit.
 * Spec: docs/modules/48-knowledge-base.md
 */

import { choice, field, steps, type RecordModule } from "@igongo/records-kit";

export const knowledgeBaseModule: RecordModule = {
  key: "knowledge-base",
  /** Codes look like KB-0042. */
  prefix: "KB",
  noun: "article",
  defaults: {
    comments: true,
    notice: "",
    types: [
      {
        key: "article",
        name: "Article",
        active: true,
        fields: [
          field("title", "Title", "text", { required: true, inList: true }),
          choice("category", "Category", ["SOP", "Policy", "Manual", "How-to", "Safety", "Other"], { inList: true }),
          field("body", "Text", "longtext", { required: true }),
          field("must_read", "Must read", "yesno", { inList: true }),
          field("attachment", "Picture or document", "photo"),
        ],
        statuses: steps("Draft", "Published!", "Archived."),
      },
    ],
  },
};
