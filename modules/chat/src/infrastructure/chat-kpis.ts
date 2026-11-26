/** Chat's numbers for the management dashboard: guest conversations (CRM). */

import type { KpiSource } from "@igongo/contracts/reports-analytics";
import type { Database } from "@igongo/core";
import { and, count, eq, gte, lt } from "drizzle-orm";
import { conversations, messages } from "./db/schema";

export function chatKpis(db: Database): KpiSource {
  return {
    module: "chat",
    title: "Chat",
    async read({ from, to }) {
      const [guests] = await db.select({ n: count() }).from(conversations).where(and(eq(conversations.kind, "desk"), gte(conversations.createdAt, from), lt(conversations.createdAt, to)));
      const [sent] = await db.select({ n: count() }).from(messages).where(and(gte(messages.at, from), lt(messages.at, to)));
      return [
        { key: "chat.guest_chats", label: "New guest chats", value: Number(guests?.n ?? 0), unit: "count" },
        { key: "chat.messages", label: "Messages", value: Number(sent?.n ?? 0), unit: "count" },
      ];
    },
  };
}
