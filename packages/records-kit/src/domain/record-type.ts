/**
 * A kind of record inside one module, such as "Found item" and "Lost item
 * report" in Lost & Found, or "Leave request" in Leave. Each type has its
 * own fields and workflow, all editable by the super admin.
 */

import type { FieldDef } from "./field-def";
import type { StatusDef } from "./status-def";

export interface RecordType {
  /** Stable key, such as `found`. */
  key: string;
  /** The name people see, such as "Found item". */
  name: string;
  /** The form's fields, in order. */
  fields: FieldDef[];
  /** The workflow, in order. The first status is the start. */
  statuses: StatusDef[];
  /**
   * People who hold the create permission only for their own records
   * (ordinary staff, guests) may raise this type, such as a leave request
   * or a guest's lost item report. Other types need a wider scope.
   */
  selfService?: boolean;
  /** Switched off types keep their records but take no new ones. */
  active: boolean;
}
