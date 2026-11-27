/**
 * The guest Alerts inbox (S00-28), end to end on PGlite through the real
 * gateway. A notification the API sends a guest lands in that guest's inbox,
 * and only that guest can read or mark it. Signed-out callers are refused.
 */

import { describe, expect, it } from "vitest";
import { userNotifier } from "../src/wiring/user-notifier";
import { testApi, testEnv } from "./helpers";

/** The log is not what these tests check, so it is a quiet stand-in. */
const quietLogger = { log: () => {}, child: () => quietLogger };

describe("guest alerts inbox", () => {
  it("shows each guest only their own notifications, and only they can mark them", async () => {
    const t = await testApi();
    // Two guests sign up in the app, the way real guests do.
    const grace = t.phone();
    const bob = t.phone();
    expect((await grace("POST", "/api/auth/sign-up/email", { name: "Grace", email: "grace@example.com", password: "Grace pass 123" })).status).toBe(200);
    expect((await bob("POST", "/api/auth/sign-up/email", { name: "Bob", email: "bob@example.com", password: "Bob pass 1234" })).status).toBe(200);
    const graceId = String(((await grace("GET", "/api/users/me")).body["account"] as { id: string }).id);
    const bobId = String(((await bob("GET", "/api/users/me")).body["account"] as { id: string }).id);
    expect(graceId).not.toBe(bobId);

    // The API tells Grace her order is ready, through the same path the order module uses.
    const notify = userNotifier(t.db, testEnv, quietLogger);
    await notify([graceId], { title: "Order ready", body: "Your order F-0042 is ready", channel: "bookings", link: "/orders/F-0042" });
    await notify([bobId], { title: "Bob's booking", body: "Table for two", channel: "bookings" });

    // Grace sees only her item, unread, with the link it opens.
    const mine = await grace("GET", "/api/notifications/inbox");
    expect(mine.status).toBe(200);
    expect(mine.body).toMatchObject({ unreadCount: 1, nextBefore: null });
    const items = mine.body["items"] as { id: string; title: string; link: string | null; readAt: string | null; userId?: string }[];
    expect(items.map((i) => i.title)).toEqual(["Order ready"]);
    expect(items[0]).toMatchObject({ link: "/orders/F-0042", readAt: null });
    expect(items[0]).not.toHaveProperty("userId");

    // Bob's item is not visible to Grace, and she cannot mark it read.
    const bobItems = (await bob("GET", "/api/notifications/inbox")).body["items"] as { id: string }[];
    const bobItem = bobItems[0];
    if (!bobItem) throw new Error("Bob should have one alert");
    expect((await grace("POST", `/api/notifications/inbox/${bobItem.id}/read`)).status).toBe(404);
    expect((await bob("GET", "/api/notifications/inbox")).body).toMatchObject({ unreadCount: 1 });

    // Grace marks her own item read, and the badge drops to zero.
    const graceItem = items[0];
    if (!graceItem) throw new Error("Grace should have one alert");
    expect((await grace("POST", `/api/notifications/inbox/${graceItem.id}/read`)).status).toBe(204);
    expect((await grace("GET", "/api/notifications/inbox")).body).toMatchObject({ unreadCount: 0 });
    // Bob's item is still unread.
    expect((await bob("GET", "/api/notifications/inbox")).body).toMatchObject({ unreadCount: 1 });
  });

  it("refuses the inbox to a signed-out caller", async () => {
    const t = await testApi();
    const anon = t.phone();
    expect((await anon("GET", "/api/notifications/inbox")).status).toBe(401);
    expect((await anon("POST", "/api/notifications/inbox/read-all")).status).toBe(401);
  });
});
