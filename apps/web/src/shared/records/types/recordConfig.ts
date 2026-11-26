// A module's record set-up: types with fields and statuses, and switches.
// The same shape as the API's records kit (RecordConfig).

import type { FieldDef } from "./fieldDef";

export interface StatusDef {
  key: string;
  label: string;
  /** Moving here closes the record. */
  done?: boolean;
  /** Only approvers may move a record here. */
  approval?: boolean;
}

export interface RecordType {
  key: string;
  name: string;
  active: boolean;
  /** Ordinary staff and guests may raise it for themselves. */
  selfService?: boolean;
  fields: FieldDef[];
  statuses: StatusDef[];
}

export interface RecordConfig {
  types: RecordType[];
  comments: boolean;
  notice: string;
}
