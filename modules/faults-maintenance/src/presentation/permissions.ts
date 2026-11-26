/**
 * Permission keys Faults & Maintenance checks. Pre-made roles hold them with
 * a data scope: staff see their department's faults, maintenance sees all.
 */

export const FAULT_PERMISSIONS = {
  view: "faults-maintenance.faults.view",
  /** Report a fault (and upload its photos). */
  create: "faults-maintenance.faults.create",
  /** Assign, and move any fault along. Assignees may always move their own. */
  edit: "faults-maintenance.faults.edit",
  /** Close a fixed fault. */
  approve: "faults-maintenance.faults.approve",
  like: "faults-maintenance.faults.like",
  comment: "faults-maintenance.faults.comment",
  settings: "faults-maintenance.settings.edit",
} as const;
