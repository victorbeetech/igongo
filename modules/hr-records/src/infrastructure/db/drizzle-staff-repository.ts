/** `StaffRepository` (and the StaffDirectory contract) on Postgres, with Drizzle. */

import type { StaffRef } from "@igongo/contracts/hr-records";
import type { Database } from "@igongo/core";
import { and, asc, eq, ilike, inArray, or, sql, type SQL } from "drizzle-orm";
import type { StaffRepository } from "../../application/ports/staff-repository";
import type { StaffFilter } from "../../domain/staff-filter";
import type { StaffDraft, StaffMember } from "../../domain/staff-member";
import { staff } from "./schema";

/** The contract's smaller view of a row. */
function toRef(row: StaffMember): StaffRef {
  const { staffId, userId, staffNumber, name, department, jobTitle, photoUrl, status } = row;
  return { staffId, userId, staffNumber, name, department, jobTitle, photoUrl, status };
}

export class DrizzleStaffRepository implements StaffRepository {
  constructor(private readonly db: Database) {}

  // --- StaffDirectory (what other modules use) ---

  async byUserId(userId: string): Promise<StaffRef | null> {
    const [row] = await this.db.select().from(staff).where(eq(staff.userId, userId));
    return row ? toRef(row) : null;
  }

  async byId(staffId: string): Promise<StaffRef | null> {
    const row = await this.get(staffId);
    return row ? toRef(row) : null;
  }

  async byIds(staffIds: string[]): Promise<StaffRef[]> {
    if (staffIds.length === 0) return [];
    return (await this.db.select().from(staff).where(inArray(staff.staffId, staffIds))).map(toRef);
  }

  async active(department?: string): Promise<StaffRef[]> {
    const where = and(eq(staff.status, "active"), department ? eq(staff.department, department) : undefined);
    return (await this.db.select().from(staff).where(where).orderBy(asc(staff.name))).map(toRef);
  }

  // --- HR's own use ---

  async get(staffId: string): Promise<StaffMember | null> {
    const [row] = await this.db.select().from(staff).where(eq(staff.staffId, staffId));
    return row ?? null;
  }

  async byStaffNumber(staffNumber: string): Promise<StaffMember | null> {
    const [row] = await this.db.select().from(staff).where(eq(staff.staffNumber, staffNumber));
    return row ?? null;
  }

  async search(filter: StaffFilter): Promise<StaffMember[]> {
    // Build the conditions one by one; undefined ones are skipped by and().
    const conditions: (SQL | undefined)[] = [
      filter.department ? eq(staff.department, filter.department) : undefined,
      filter.status ? eq(staff.status, filter.status) : undefined,
      filter.staffId ? eq(staff.staffId, filter.staffId) : undefined,
    ];
    if (filter.q) {
      const like = `%${filter.q}%`;
      conditions.push(or(ilike(staff.name, like), ilike(staff.staffNumber, like), ilike(staff.jobTitle, like)));
    }
    return this.db.select().from(staff).where(and(...conditions)).orderBy(asc(staff.name)).limit(filter.limit).offset(filter.offset);
  }

  async highestStaffNumber(): Promise<number> {
    // Numbers look like IGG-0042; take the largest running part.
    const [row] = await this.db.select({ max: sql<number>`coalesce(max(substring(${staff.staffNumber} from '[0-9]+$')::int), 0)` }).from(staff);
    return Number(row?.max ?? 0);
  }

  async create(input: StaffDraft & { staffId: string; staffNumber: string; userId: string | null; now: Date }): Promise<void> {
    const { now, ...values } = input;
    await this.db.insert(staff).values({ ...values, createdAt: now, updatedAt: now });
  }

  async update(staffId: string, changes: Partial<StaffDraft> & { userId?: string | null }, now: Date): Promise<void> {
    await this.db.update(staff).set({ ...changes, updatedAt: now }).where(eq(staff.staffId, staffId));
  }
}
