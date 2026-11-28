/**
 * The Notifications module's HTTP routes, mounted by the API gateway at
 * `/notifications`. Thin: check the caller, validate, call a use case.
 *
 *   POST   /devices             save this phone's push token, get its topics
 *   DELETE /devices/:token      forget a token at sign-out
 *   POST   /push/test           send a test push to your own phones
 *   POST   /push/broadcast      send to people, roles or a topic
 *   GET    /inbox               your Alerts inbox, newest first, with the unread count
 *   POST   /inbox/read-all      mark all your items read
 *   POST   /inbox/:id/read      mark one of your items read (404 for anyone else's)
 */

import { zValidator } from "@hono/zod-validator";
import { Hono, type Context } from "hono";
import type { AudienceDirectory } from "../application/ports/audience-directory";
import type { DeviceTokenRepository } from "../application/ports/device-token-repository";
import type { InboxRepository } from "../application/ports/inbox-repository";
import type { PushSender } from "../application/ports/push-sender";
import { listInbox } from "../application/use-cases/list-inbox";
import { markAllInboxRead, markInboxItemRead } from "../application/use-cases/mark-inbox-read";
import { notifyPeople } from "../application/use-cases/notify-people";
import { registerDevice } from "../application/use-cases/register-device";
import { removeDevice } from "../application/use-cases/remove-device";
import { sendPush } from "../application/use-cases/send-push";
import { PERMISSIONS, type NotificationsVariables, type RequestActor } from "./request-actor";
import { broadcastBody, inboxQuery, registerDeviceBody, testPushBody } from "./request-schemas";
import { toInboxItemView } from "./inbox-view";

/** What the routes need, given by the gateway for each request. */
export interface NotificationsDeps {
  repo: DeviceTokenRepository;
  sender: PushSender;
  directory: AudienceDirectory;
  inbox: InboxRepository;
  now: () => Date;
  newId: () => string;
}

type Env = { Variables: NotificationsVariables };

/** Builds the router. [deps] is called per request, so each gets its own DB connection. */
export function notificationsRouter(deps: (c: Context<Env>) => NotificationsDeps) {
  const app = new Hono<Env>();

  // Every route needs a signed-in caller.
  app.use(async (c, next) => {
    if (!c.get("actor")) return c.json({ error: "sign_in_required" }, 401);
    await next();
  });

  // Save this phone's token. Calling again just refreshes it.
  app.post("/devices", zValidator("json", registerDeviceBody), async (c) => {
    const response = await registerDevice(deps(c), actorOf(c), c.req.valid("json"));
    return c.json(response, 200);
  });

  // Forget a token, only if it belongs to the caller.
  app.delete("/devices/:token", async (c) => {
    await removeDevice(deps(c).repo, actorOf(c).userId, c.req.param("token"));
    // Always 204: whether a token exists is nobody else's business.
    return c.body(null, 204);
  });

  // A test push to your own phones, to check the Firebase key works.
  app.post("/push/test", zValidator("json", testPushBody), async (c) => {
    const actor = actorOf(c);
    if (!actor.permissions.includes(PERMISSIONS.testPush)) return c.json({ error: "permission_denied" }, 403);
    const d = deps(c);
    const { title, body } = c.req.valid("json");
    const results = await sendPush(d, { kind: "users", userIds: [actor.userId] }, {
      notificationId: d.newId(),
      title,
      body,
      channel: "general",
    });
    return c.json({ results }, 200);
  });

  // A broadcast written by hand, such as a notice to all staff.
  app.post("/push/broadcast", zValidator("json", broadcastBody), async (c) => {
    if (!actorOf(c).permissions.includes(PERMISSIONS.broadcast)) return c.json({ error: "permission_denied" }, 403);
    const d = deps(c);
    const { target, title, body, channel, link } = c.req.valid("json");
    // The same path as every other notification: the inbox item, then the phones.
    const payload = { notificationId: d.newId(), title, body, channel, ...(link ? { link } : {}) };
    return c.json({ results: await notifyPeople(d, target, payload) }, 200);
  });

  // The caller's own Alerts inbox: one page, newest first, with the badge count.
  app.get("/inbox", zValidator("query", inboxQuery), async (c) => {
    const { limit, before } = c.req.valid("query");
    const page = await listInbox(deps(c).inbox, actorOf(c).userId, limit, before);
    return c.json(
      {
        items: page.items.map(toInboxItemView),
        unreadCount: page.unreadCount,
        nextBefore: page.nextBefore ? page.nextBefore.toISOString() : null,
      },
      200,
    );
  });

  // Mark every unread item of the caller read.
  app.post("/inbox/read-all", async (c) => {
    const d = deps(c);
    const marked = await markAllInboxRead(d.inbox, d.now, actorOf(c).userId);
    return c.json({ marked }, 200);
  });

  // Mark one item read. Someone else's item answers 404, the same as a missing one.
  app.post("/inbox/:id/read", async (c) => {
    const d = deps(c);
    const found = await markInboxItemRead(d.inbox, d.now, actorOf(c).userId, c.req.param("id"));
    return found ? c.body(null, 204) : c.json({ error: "not_found" }, 404);
  });

  return app;
}

/** The caller, already checked by the middleware above. */
function actorOf(c: Context<Env>): RequestActor {
  return c.get("actor") as RequestActor;
}
