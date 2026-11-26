/** `PayrollRepository` on Postgres, with Drizzle. */

import { omitKey, omitKeys, type Database } from "@igongo/core";
import { and, desc, eq, inArray, ne } from "drizzle-orm";
import type { PayrollRepository } from "../../application/ports/payroll-repository";
import type { PayMethod, PayProfile } from "../../domain/pay-profile";
import type { PayRun, RunStatus } from "../../domain/pay-run";
import type { Payslip } from "../../domain/payslip";
import { payProfiles, payRuns, payslips } from "./schema";

const toProfile = (r: typeof payProfiles.$inferSelect): PayProfile => ({ ...r, payMethod: r.payMethod as PayMethod });
const toRun = (r: typeof payRuns.$inferSelect): PayRun => ({ ...r, status: r.status as RunStatus });

export class DrizzlePayrollRepository implements PayrollRepository {
  constructor(private readonly db: Database) {}

  async profile(staffId: string): Promise<PayProfile | null> {
    const [row] = await this.db.select().from(payProfiles).where(eq(payProfiles.staffId, staffId));
    return row ? toProfile(row) : null;
  }

  async profiles(): Promise<PayProfile[]> {
    return (await this.db.select().from(payProfiles)).map(toProfile);
  }

  async saveProfile(p: PayProfile): Promise<void> {
    await this.db.insert(payProfiles).values(p).onConflictDoUpdate({ target: payProfiles.staffId, set: omitKey(p, "staffId") });
  }

  async run(id: string): Promise<PayRun | null> {
    const [row] = await this.db.select().from(payRuns).where(eq(payRuns.id, id));
    return row ? toRun(row) : null;
  }

  async runs(limit: number): Promise<PayRun[]> {
    return (await this.db.select().from(payRuns).orderBy(desc(payRuns.period), desc(payRuns.createdAt)).limit(limit)).map(toRun);
  }

  async liveRunFor(period: string): Promise<PayRun | null> {
    const [row] = await this.db.select().from(payRuns).where(and(eq(payRuns.period, period), ne(payRuns.status, "cancelled")));
    return row ? toRun(row) : null;
  }

  async saveRun(run: PayRun): Promise<void> {
    await this.db.insert(payRuns).values(run).onConflictDoUpdate({ target: payRuns.id, set: omitKeys(run, "id", "createdAt") });
  }

  async payslip(id: string): Promise<Payslip | null> {
    const [row] = await this.db.select().from(payslips).where(eq(payslips.id, id));
    return row ?? null;
  }

  payslips(runId: string): Promise<Payslip[]> {
    return this.db.select().from(payslips).where(eq(payslips.runId, runId)).orderBy(payslips.staffName);
  }

  async replacePayslips(runId: string, items: Payslip[]): Promise<void> {
    await this.db.delete(payslips).where(eq(payslips.runId, runId));
    if (items.length) await this.db.insert(payslips).values(items);
  }

  async savePayslip(p: Payslip): Promise<void> {
    await this.db.update(payslips).set(omitKey(p, "id")).where(eq(payslips.id, p.id));
  }

  async history(staffId: string) {
    const rows = await this.db
      .select({ slip: payslips, status: payRuns.status, paidAt: payRuns.paidAt })
      .from(payslips)
      .innerJoin(payRuns, eq(payRuns.id, payslips.runId))
      .where(and(eq(payslips.staffId, staffId), inArray(payRuns.status, ["approved", "paid"])))
      .orderBy(desc(payslips.period));
    return rows.map((r) => ({ ...r.slip, status: r.status, paidAt: r.paidAt }));
  }
}
