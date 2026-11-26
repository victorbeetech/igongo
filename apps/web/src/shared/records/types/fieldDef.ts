// One field of a record type, as the API's records kit defines it
// (packages/records-kit/src/domain/field-def.ts). The super admin edits them.

export const FIELD_KINDS = ["text", "longtext", "number", "money", "date", "time", "select", "yesno", "staff", "photo", "phone"] as const;
export type FieldKind = (typeof FIELD_KINDS)[number];

export interface FieldDef {
  key: string;
  label: string;
  kind: FieldKind;
  required?: boolean;
  options?: string[];
  inList?: boolean;
}

/** A saved value: text, a number or yes/no. Photos and staff are IDs. */
export type FieldValue = string | number | boolean | null;
