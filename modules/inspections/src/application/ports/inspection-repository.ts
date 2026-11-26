/** Where checklists, runs, likes and comments are kept. */

import type { Checklist } from "../../domain/checklist";
import type { InspectionRun } from "../../domain/inspection-run";
import type { RunComment } from "../../domain/run-comment";

export interface RunFilter {
  department?: string;
  /** Only runs this person did (an `own` scope). */
  inspectorUserId?: string;
  from?: string;
  to?: string;
  checklistId?: string;
  limit: number;
}

export interface InspectionRepository {
  checklist(id: string): Promise<Checklist | null>;
  checklists(filter: { department?: string; activeOnly?: boolean }): Promise<Checklist[]>;
  saveChecklist(checklist: Checklist): Promise<void>;
  run(id: string): Promise<InspectionRun | null>;
  runs(filter: RunFilter, viewerId: string): Promise<(InspectionRun & { likes: number; comments: number; likedByMe: boolean })[]>;
  addRun(run: InspectionRun): Promise<void>;
  /** The latest run of [checklistId] on or after [sinceDate]. */
  latestRun(checklistId: string, sinceDate: string): Promise<InspectionRun | null>;
  toggleLike(runId: string, userId: string, now: Date): Promise<boolean>;
  likeCount(runId: string): Promise<number>;
  addComment(comment: RunComment): Promise<void>;
  comments(runId: string): Promise<RunComment[]>;
}
