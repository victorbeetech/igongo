/** One line of a checklist, such as "Fire exits clear". */

export interface ChecklistItem {
  key: string;
  label: string;
  /** A photo must be added when this check fails. */
  photoOnFail: boolean;
  /** A failed check raises a fault in Faults & Maintenance by itself. */
  raiseFault: boolean;
}
