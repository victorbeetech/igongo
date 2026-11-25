/** The filters for searching the Audit Trail. Every filter is optional. */

export interface AuditSearch {
  actorId?: string;
  module?: string;
  action?: string;
  recordType?: string;
  recordId?: string;
  /** Inclusive start and exclusive end of the time range. */
  from?: Date;
  to?: Date;
  /** Words to find in the summary and the person's name. */
  text?: string;
  /** Only entries older than this `seq` (for the next page). */
  beforeSeq?: number;
  /** Page size, 1 to 200. */
  limit: number;
}

/** One page of results, newest first. */
export interface AuditPage<T> {
  items: T[];
  /** Pass as `beforeSeq` to get the next page; null on the last page. */
  nextBeforeSeq: number | null;
}
