// One record and one history line, as the records kit's API sends them.

import type { FieldValue } from "./fieldDef";

export interface WorkRecord {
  id: string;
  code: string;
  type: string;
  title: string;
  status: string;
  fields: Record<string, FieldValue>;
  ownerId: string | null;
  ownerName: string;
  assigneeId: string | null;
  assigneeName: string | null;
  dueOn: string | null;
  location: string | null;
  createdAt: string;
  updatedAt: string;
  closedAt: string | null;
  /** The QR text, such as `IGG-REC:LF-0042`. */
  qr?: string;
}

export interface RecordEvent {
  id: string;
  kind: "created" | "status" | "comment" | "assigned" | "edited";
  text: string;
  byName: string;
  at: string;
}
