/** Where a module's records and their history are kept (its own schema). */

import type { RecordEvent } from "../../domain/record-event";
import type { WorkRecord } from "../../domain/work-record";

/** Filters for a records list. Every filter is optional. */
export interface RecordFilter {
  type?: string;
  status?: string;
  /** true: only open records; false: only closed ones. */
  open?: boolean;
  /** Only records owned or created by this user, or assigned to their staff record. */
  involving?: { userId: string; staffId: string | null };
  /** Only records assigned to this staff member. */
  assigneeId?: string;
  /** Words in the title or code. */
  words?: string;
  /** Due on or after / before these days. */
  dueFrom?: string;
  dueTo?: string;
  limit: number;
}

/** Counts of records by type and status, for dashboards. */
export interface RecordCount {
  type: string;
  status: string;
  n: number;
}

export interface RecordRepository {
  byId(id: string): Promise<WorkRecord | null>;
  byCode(code: string): Promise<WorkRecord | null>;
  list(filter: RecordFilter): Promise<WorkRecord[]>;
  /** The next running code, such as `LF-0043`. */
  nextCode(prefix: string): Promise<string>;
  /** Saves a new or changed record. */
  save(record: WorkRecord): Promise<void>;
  addEvent(event: RecordEvent): Promise<void>;
  events(recordId: string): Promise<RecordEvent[]>;
  counts(): Promise<RecordCount[]>;
}
