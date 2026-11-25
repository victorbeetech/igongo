/** Where the super admin's attendance rules are kept. */

import type { AttendanceRules } from "../../domain/attendance-rules";

export interface RulesStore {
  read(): Promise<AttendanceRules>;
  write(rules: AttendanceRules, by: string | null, now: Date): Promise<void>;
}
