/**
 * One record in a records-kit module: a found item, a task, a leave
 * request, a visitor, a cash-up. Kept for ever; closing only changes its
 * status, so it stays searchable years later.
 */

import type { FieldValue } from "./field-def";

export interface WorkRecord {
  id: string;
  /** The running number people quote and the QR carries, such as `LF-0042`. */
  code: string;
  /** The record type key. */
  type: string;
  /** A one-line summary, such as "Black wallet, pool deck". */
  title: string;
  /** The status key. */
  status: string;
  /** The type's field values by field key. */
  fields: Record<string, FieldValue>;
  /** Who the record is for or was raised by (a user ID), for "my" lists. */
  ownerId: string | null;
  ownerName: string;
  /** The staff member working on it, if any. */
  assigneeId: string | null;
  assigneeName: string | null;
  /** The day it is due or happens, such as a leave start or a meeting day. */
  dueOn: string | null;
  /** Where, in words, such as "Room 210" or "Main gate". */
  location: string | null;
  createdBy: string | null;
  createdAt: Date;
  updatedAt: Date;
  /** When it reached a done status, or null while open. */
  closedAt: Date | null;
}
