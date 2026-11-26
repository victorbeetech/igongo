/** `FileRepository` on Postgres, with Drizzle. */

import type { Database } from "@igongo/core";
import { and, count, eq, gte, inArray, isNull } from "drizzle-orm";
import type { FileRepository } from "../../application/ports/file-repository";
import type { StoredFile } from "../../domain/stored-file";
import { files } from "./schema";

export class DrizzleFileRepository implements FileRepository {
  constructor(private readonly db: Database) {}

  async get(id: string): Promise<StoredFile | null> {
    const [row] = await this.db.select().from(files).where(eq(files.id, id));
    return row ?? null;
  }

  many(ids: string[]): Promise<StoredFile[]> {
    if (!ids.length) return Promise.resolve([]);
    return this.db.select().from(files).where(and(inArray(files.id, ids), isNull(files.removedAt)));
  }

  async add(file: StoredFile): Promise<void> {
    await this.db.insert(files).values(file);
  }

  async markRemoved(id: string, at: Date): Promise<void> {
    await this.db.update(files).set({ removedAt: at }).where(eq(files.id, id));
  }

  async countSince(userId: string, since: Date): Promise<number> {
    const [row] = await this.db.select({ n: count() }).from(files).where(and(eq(files.uploadedBy, userId), gte(files.createdAt, since)));
    return row?.n ?? 0;
  }
}
