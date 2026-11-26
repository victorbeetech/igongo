/**
 * Approvals (module 9) as a records module: its code prefix and the
 * set-up a new hotel starts with. The super admin changes the record
 * types, fields and statuses on the module's settings screen; this file
 * is only the starting point. Everything else comes from @igongo/records-kit.
 * Spec: docs/modules/09-workflow-approvals.md
 */

import { field, steps, type RecordModule } from "@igongo/records-kit";

export const workflowApprovalsModule: RecordModule = {
  key: "workflow-approvals",
  /** Codes look like AP-0042. */
  prefix: "AP",
  noun: "request",
  defaults: {
    comments: true,
    notice: "",
    types: [
      {
        key: "approval",
        name: "Approval request",
        active: true,
      selfService: true,
        fields: [
          field("subject", "What needs approving", "text", { required: true, inList: true }),
          field("amount", "Amount (UGX)", "money", { inList: true }),
          field("details", "Details", "longtext"),
        ],
        statuses: steps("Requested", "Checked", "Approved!", "Done.", "Rejected."),
      },
      {
        key: "delegation",
        name: "Delegation",
        active: true,
      selfService: true,
        fields: [
          field("delegate", "Acting for me", "staff", { required: true, inList: true }),
          field("from", "From", "date", { required: true, inList: true }),
          field("to", "To", "date", { required: true, inList: true }),
          field("reason", "Reason", "text"),
        ],
        statuses: steps("Requested", "Active!", "Ended."),
      },
    ],
  },
};
