/** Where faults, their history, likes and comments are kept. */

import type { Fault } from "../../domain/fault";
import type { FaultComment } from "../../domain/fault-comment";
import type { FaultEvent } from "../../domain/fault-event";
import type { FaultStatus } from "../../domain/fault-status";

/** Filters for the fault list. */
export interface FaultFilter {
  status?: FaultStatus;
  /** Only open ones (not fixed, closed or cancelled). */
  openOnly?: boolean;
  department?: string;
  /** Faults this person reported or is assigned to are always included in a department filter. */
  alsoPerson?: string;
  assignedStaffId?: string;
  /** Only faults this person reported or is assigned to (an `own` scope). */
  onlyPerson?: string;
  limit: number;
  offset: number;
}

/** A fault with its counts, for lists. */
export type FaultListItem = Fault & { likes: number; comments: number; likedByMe: boolean };

export interface FaultRepository {
  get(id: string): Promise<Fault | null>;
  list(filter: FaultFilter, viewerId: string): Promise<FaultListItem[]>;
  /** The next number, such as `FLT-0042`. */
  nextNumber(): Promise<string>;
  save(fault: Fault): Promise<void>;
  addEvent(event: FaultEvent): Promise<void>;
  events(faultId: string): Promise<FaultEvent[]>;
  /** Adds or removes the like; true when it is now liked. */
  toggleLike(faultId: string, userId: string, now: Date): Promise<boolean>;
  likeCount(faultId: string): Promise<number>;
  addComment(comment: FaultComment): Promise<void>;
  comments(faultId: string): Promise<FaultComment[]>;
  /** Counts by status, for the summary and the dashboard. */
  countByStatus(department?: string): Promise<Record<string, number>>;
}
