/**
 * Data jobs (module 13) as a records module: its code prefix and the
 * set-up a new hotel starts with. The super admin changes the record
 * types, fields and statuses on the module's settings screen; this file
 * is only the starting point. Everything else comes from @igongo/records-kit.
 * Spec: docs/modules/13-data-import-export.md
 */

import { choice, field, steps, type RecordModule } from "@igongo/records-kit";

export const dataImportExportModule: RecordModule = {
  key: "data-import-export",
  /** Codes look like DJ-0042. */
  prefix: "DJ",
  noun: "job",
  defaults: {
    comments: true,
    notice: "",
    types: [
      {
        key: "import",
        name: "Import",
        active: true,
        fields: [
          choice("what", "What to import", ["Staff", "Guests", "Menu items", "Stock items", "Assets", "Wristbands", "Other"], { required: true, inList: true }),
          field("file", "Spreadsheet", "photo"),
          field("notes", "Notes", "longtext"),
        ],
        statuses: steps("Requested", "Checked", "Imported.", "Rejected."),
      },
      {
        key: "export",
        name: "Export",
        active: true,
        fields: [
          field("what", "What to export", "text", { required: true, inList: true }),
          field("from", "From", "date"),
          field("to", "To", "date"),
        ],
        statuses: steps("Requested", "Ready.", "Rejected."),
      },
      {
        key: "restore",
        name: "Restore",
        active: true,
        fields: [
          field("what", "Record to restore", "text", { required: true, inList: true }),
          field("reason", "Reason", "longtext", { required: true }),
        ],
        statuses: steps("Requested", "Approved!", "Restored.", "Rejected."),
      },
    ],
  },
};
