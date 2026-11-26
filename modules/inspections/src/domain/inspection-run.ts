/** One done checklist (S39-02): who did it, when, every answer and the score. */

import type { CheckResult } from "./check-result";

export interface InspectionRun {
  id: string;
  checklistId: string;
  checklistName: string;
  department: string;
  /** The hotel day it counts for, `YYYY-MM-DD`. */
  workDate: string;
  inspectorUserId: string;
  inspectorStaffId: string | null;
  inspectorName: string;
  results: CheckResult[];
  /** 0 to 100. */
  score: number;
  faults: number;
  note: string | null;
  submittedAt: Date;
}
