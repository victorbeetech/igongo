/** Where pay profiles, pay runs and payslips are kept. */

import type { PayProfile } from "../../domain/pay-profile";
import type { PayRun } from "../../domain/pay-run";
import type { Payslip } from "../../domain/payslip";

export interface PayrollRepository {
  profile(staffId: string): Promise<PayProfile | null>;
  profiles(): Promise<PayProfile[]>;
  saveProfile(profile: PayProfile): Promise<void>;
  run(id: string): Promise<PayRun | null>;
  runs(limit: number): Promise<PayRun[]>;
  /** The run of [period] that is not cancelled, if any. */
  liveRunFor(period: string): Promise<PayRun | null>;
  saveRun(run: PayRun): Promise<void>;
  payslip(id: string): Promise<Payslip | null>;
  payslips(runId: string): Promise<Payslip[]>;
  /** Replaces every payslip of [runId] with [payslips]. */
  replacePayslips(runId: string, payslips: Payslip[]): Promise<void>;
  savePayslip(payslip: Payslip): Promise<void>;
  /** [staffId]'s payslips in approved or paid runs, newest month first, with their run's status and paid time. */
  history(staffId: string): Promise<(Payslip & { status: string; paidAt: Date | null })[]>;
}
