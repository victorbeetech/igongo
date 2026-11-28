/** `AccountStore` on Postgres: accounts, linked sign-in methods and sessions. */

import { and, count, desc, eq, ilike, inArray, ne, or, type SQL } from "drizzle-orm";
import type { Database } from "@igongo/core";
import type { AccountStore } from "../../application/ports/account-store";
import type { AccountStatus } from "../../domain/account-status";
import type { AccountSummary, SessionSummary } from "../../domain/account-summary";
import { formatDisplayNumber } from "../../domain/display-number";
import { account, session, user } from "./schema";

export class DrizzleAccountStore implements AccountStore {
  constructor(private readonly db: Database) {}

  async search(q: { text?: string; status?: AccountStatus; kind?: "staff" | "client"; limit: number; offset: number }) {
    const where: SQL[] = [];
    if (q.text) {
      const like = `%${q.text.replace(/[%_]/g, "")}%`;
      where.push(or(ilike(user.name, like), ilike(user.email, like), ilike(user.phoneNumber, like)) as SQL);
    }
    if (q.status) where.push(eq(user.status, q.status));
    if (q.kind) where.push(eq(user.kind, q.kind));
    const filter = where.length ? and(...where) : undefined;
    const rows = await this.db.select().from(user).where(filter).orderBy(desc(user.createdAt)).limit(q.limit).offset(q.offset);
    const [total] = await this.db.select({ n: count() }).from(user).where(filter);
    return { items: await this.withProviders(rows), total: total?.n ?? 0 };
  }

  async get(userId: string): Promise<AccountSummary | null> {
    return (await this.withProviders(await this.db.select().from(user).where(eq(user.id, userId))))[0] ?? null;
  }

  async setStatus(userId: string, status: AccountStatus): Promise<void> {
    await this.db.update(user).set({ status, updatedAt: new Date() }).where(eq(user.id, userId));
  }

  async setKind(userId: string, kind: "staff" | "client"): Promise<void> {
    await this.db.update(user).set({ kind, updatedAt: new Date() }).where(eq(user.id, userId));
  }

  async setImage(userId: string, image: string | null): Promise<void> {
    await this.db.update(user).set({ image, updatedAt: new Date() }).where(eq(user.id, userId));
  }

  async sessionsOf(userId: string): Promise<SessionSummary[]> {
    return this.db
      .select({ id: session.id, createdAt: session.createdAt, expiresAt: session.expiresAt, ipAddress: session.ipAddress, userAgent: session.userAgent })
      .from(session)
      .where(eq(session.userId, userId))
      .orderBy(desc(session.createdAt));
  }

  async deleteSession(userId: string, sessionId: string): Promise<boolean> {
    const gone = await this.db.delete(session).where(and(eq(session.id, sessionId), eq(session.userId, userId))).returning({ id: session.id });
    return gone.length > 0;
  }

  async deleteSessions(userId: string | null, keepSessionId?: string): Promise<number> {
    const where: SQL[] = [];
    if (userId) where.push(eq(session.userId, userId));
    if (keepSessionId) where.push(ne(session.id, keepSessionId));
    const gone = await this.db.delete(session).where(where.length ? and(...where) : undefined).returning({ id: session.id });
    return gone.length;
  }

  /** Adds each account's linked sign-in providers, in one query. */
  private async withProviders(rows: (typeof user.$inferSelect)[]): Promise<AccountSummary[]> {
    if (rows.length === 0) return [];
    const links = await this.db.select({ userId: account.userId, providerId: account.providerId }).from(account).where(inArray(account.userId, rows.map((r) => r.id)));
    return rows.map((r) => ({
      id: r.id,
      displayId: formatDisplayNumber(r.displayNumber),
      name: r.name,
      email: r.email,
      emailVerified: r.emailVerified,
      phoneNumber: r.phoneNumber,
      image: r.image,
      status: r.status as AccountStatus,
      kind: r.kind === "staff" ? "staff" : "client",
      twoFactorEnabled: r.twoFactorEnabled ?? false,
      createdAt: r.createdAt,
      providers: links.filter((l) => l.userId === r.id).map((l) => l.providerId),
    }));
  }
}
