/**
 * The Notifications module's HTTP routes, mounted by the API gateway at
 * `/notifications`. Thin: check the caller, validate, call a use case.
 *
 *   POST   /devices             save this phone's push token, get its topics
 *   DELETE /devices/:token      forget a token at sign-out
 *   POST   /push/test           send a test push to your own phones
 *   POST   /push/broadcast      send to people, roles or a topic
 */

import { zValidator } from "@hono/zod-validator";
import { Hono, type Context } from "hono";
import type { AudienceDirectory } from "../application/ports/audience-directory";
import type { DeviceTokenRepository } from "../application/ports/device-token-repository";
import type { PushSender } from "../application/ports/push-sender";
import { registerDevice } from "../application/use-cases/register-device";
import { removeDevice } from "../application/use-cases/remove-device";
import { sendPush } from "../application/use-cases/send-push";
import { PERMISSIONS, type NotificationsVariables, type RequestActor } from "./request-actor";
import { broadcastBody, registerDeviceBody, testPushBody } from "./request-schemas";

/** What the routes need, given by the gateway for each request. */
export interface NotificationsDeps {
  repo: DeviceTokenRepository;
  sender: PushSender;
  directory: AudienceDirectory;
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
    const payload = { notificationId: d.newId(), title, body, channel, ...(link ? { link } : {}) };
    return c.json({ results: await sendPush(d, target, payload) }, 200);
  });

  return app;
}

/** The caller, already checked by the middleware above. */
function actorOf(c: Context<Env>): RequestActor {
  return c.get("actor") as RequestActor;
}
