/** One line in a record's history: created, a status change, a comment, an assignment or an edit. */

export const RECORD_EVENT_KINDS = ["created", "status", "comment", "assigned", "edited"] as const;
export type RecordEventKind = (typeof RECORD_EVENT_KINDS)[number];

export interface RecordEvent {
  id: string;
  recordId: string;
  kind: RecordEventKind;
  /** The comment, the move ("Requested to Approved") or what changed. */
  text: string;
  /** The status after a move. */
  status: string | null;
  byId: string | null;
  byName: string;
  at: Date;
}
