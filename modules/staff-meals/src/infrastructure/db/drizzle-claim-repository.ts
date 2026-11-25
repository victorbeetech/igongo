/** `ClaimRepository` on Postgres, with Drizzle. */

import type { Database } from "@igongo/core";
import { and, asc, eq } from "drizzle-orm";
import type { ClaimRepository } from "../../application/ports/claim-repository";
import type { MealClaim } from "../../domain/meal-claim";
import { mealClaims } from "./schema";

export class DrizzleClaimRepository implements ClaimRepository {
  constructor(private readonly db: Database) {}

  async find(staffId: string, workDate: string, mealKey: string): Promise<MealClaim | null> {
    const [row] = await this.db
      .select()
      .from(mealClaims)
      .where(and(eq(mealClaims.staffId, staffId), eq(mealClaims.workDate, workDate), eq(mealClaims.mealKey, mealKey)));
    return row ?? null;
  }

  async add(claim: MealClaim): Promise<void> {
    await this.db.insert(mealClaims).values(claim);
  }

  list(filter: { workDate: string; staffId?: string; department?: string }): Promise<MealClaim[]> {
    const where = and(
      eq(mealClaims.workDate, filter.workDate),
      filter.staffId ? eq(mealClaims.staffId, filter.staffId) : undefined,
      filter.department ? eq(mealClaims.department, filter.department) : undefined,
    );
    return this.db.select().from(mealClaims).where(where).orderBy(asc(mealClaims.at));
  }
}
