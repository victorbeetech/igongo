/**
 * Corporate accounts (module 55) as a records module: its code prefix and the
 * set-up a new hotel starts with. The super admin changes the record
 * types, fields and statuses on the module's settings screen; this file
 * is only the starting point. Everything else comes from @igongo/records-kit.
 * Spec: docs/modules/55-corporate-accounts.md
 */

import { choice, field, steps, type RecordModule } from "@igongo/records-kit";

export const corporateAccountsModule: RecordModule = {
  key: "corporate-accounts",
  /** Codes look like CA-0042. */
  prefix: "CA",
  noun: "account",
  defaults: {
    comments: true,
    notice: "",
    types: [
      {
        key: "company",
        name: "Company",
        active: true,
        fields: [
          field("name", "Company", "text", { required: true, inList: true }),
          choice("kind", "Kind", ["Company", "NGO", "Government", "School", "Other"], { inList: true }),
          field("contact", "Contact person", "text", { inList: true }),
          field("phone", "Phone", "phone"),
          field("email", "Email", "text"),
          field("tin", "TIN", "text"),
          field("credit_limit", "Credit limit (UGX)", "money", { inList: true }),
          field("rate", "Agreed discount (%)", "number"),
        ],
        statuses: steps("Applied", "Approved!", "On hold", "Closed."),
      },
      {
        key: "statement",
        name: "Account statement note",
        active: true,
        fields: [
          field("company", "Company", "text", { required: true, inList: true }),
          field("amount", "Amount owed (UGX)", "money", { inList: true }),
          field("due", "Due", "date", { inList: true }),
          field("notes", "Notes", "longtext"),
        ],
        statuses: steps("Open", "Paid.", "Written off."),
      },
    ],
  },
};
