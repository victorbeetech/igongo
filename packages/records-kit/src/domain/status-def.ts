/**
 * One step in a record type's workflow, such as "Requested", "Approved" or
 * "Handed over". The list order is the normal order of work; the first
 * status is where every new record starts. Statuses are data the super
 * admin edits (Workflow & Approvals, module 9).
 */

export interface StatusDef {
  /** Stable key, such as `approved`. */
  key: string;
  /** The words people see. */
  label: string;
  /** Moving here closes the record (it leaves the open lists). */
  done?: boolean;
  /** Only holders of the module's approve permission may move a record here. */
  approval?: boolean;
}
