/**
 * One field on a record type, such as "Item found" on a lost item or
 * "Days" on a leave request. Fields are data: the super admin adds, renames,
 * reorders and removes them on the module's settings screen (Custom Fields,
 * module 7), and every screen draws its form and list from them.
 */

/** The kinds of field a form can show. */
export const FIELD_KINDS = ["text", "longtext", "number", "money", "date", "time", "select", "yesno", "staff", "photo", "phone"] as const;
export type FieldKind = (typeof FIELD_KINDS)[number];

export interface FieldDef {
  /** Stable key used in the saved data, such as `found_at`. Never changes once records use it. */
  key: string;
  /** The label people see, such as "Where it was found". */
  label: string;
  kind: FieldKind;
  /** The record cannot be saved without it. */
  required?: boolean;
  /** The choices of a `select` field. */
  options?: string[];
  /** Shown as a column in lists. */
  inList?: boolean;
}

/** A saved field value: text, a number or yes/no (photos and staff are saved as IDs). */
export type FieldValue = string | number | boolean | null;
