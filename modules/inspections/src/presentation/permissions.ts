/**
 * Permission keys Inspections checks. Pre-made HODs hold them with a
 * `department` scope; the GM and quality roles with `all`.
 */

export const INSPECTION_PERMISSIONS = {
  /** See runs (and the checklists to do). */
  view: "inspections.runs.view",
  /** Do a checklist (and upload its photos). */
  create: "inspections.runs.create",
  /** Build and change checklists. */
  build: "inspections.checklists.edit",
  like: "inspections.runs.like",
  comment: "inspections.runs.comment",
  settings: "inspections.settings.edit",
} as const;
