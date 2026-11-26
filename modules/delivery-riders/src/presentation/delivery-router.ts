/**
 * Delivery & Riders HTTP routes, mounted by the gateway at `/api/delivery`.
 *
 *   GET   /delivery/zones                 zones and fees, for the cart (S62-07)
 *   GET|PUT /delivery/rules               the delivery rules (S66-02)
 *   GET   /delivery/board                 dispatch board (S66-01)
 *   GET   /delivery/riders                riders and their status (S66-11)
 *   POST  /delivery/jobs/:id/assign       a dispatcher assigns a job
 *   POST  /delivery/riders/:id/cash       the dispatcher receives a rider's cash (S66-08)
 *   GET   /delivery/rider/me              my shift: jobs, trips, earnings, cash (S66-03, S66-09)
 *   POST  /delivery/rider/online          go online or offline
 *   POST  /delivery/rider/location        live location ping
 *   POST  /delivery/jobs/:id/accept|decline|pickup|deliver|fail   the rider's steps (S66-04 to S66-07)
 *   GET   /delivery/track/:orderId        the guest follows their delivery (S66-10)
 */

import { zValidator } from "@hono/zod-validator";
import { actorOf, AppError, omitKey, recordChange, requireSignIn, requireStaffPermission, scopeOf, type ActorEnv } from "@igongo/core";
import { Hono, type Context } from "hono";
import type { DeliveryDeps } from "../application/delivery-deps";
import { assignJob } from "../application/use-cases/assign-job";
import { acceptJob, declineJob, deliverJob, failJob, pickUpJob } from "../application/use-cases/rider-actions";
import { myShift, pingLocation, receiveCash, setOnline } from "../application/use-cases/rider-shift";
import { ACTIVE_JOB_STATUSES, type DeliveryJob } from "../domain/delivery-job";
import { DELIVERY_PERMISSIONS as P } from "./permissions";
import { assignBody, deliverBody, failBody, locationBody, onlineBody, rulesBody } from "./request-schemas";

/** @throws AppError unless the caller dispatches (scope `all`) */
function dispatcher(c: Context<ActorEnv>) {
  if (scopeOf(actorOf(c), P.edit) !== "all") throw new AppError("permission_denied", "Only dispatchers can do this.");
}

/** The signed-in rider's user ID. @throws AppError when the caller has no rider permission */
function rider(c: Context<ActorEnv>): string {
  const actor = actorOf(c);
  if (!scopeOf(actor, P.edit)) throw new AppError("permission_denied", `You need the permission ${P.edit}.`);
  return actor.userId;
}

/** A job without the guest's code (riders must ask the guest for it). */
const forStaff = (job: DeliveryJob) => omitKey(job, "code");

export function deliveryRouter(deps: (c: Context<ActorEnv>) => DeliveryDeps) {
  return new Hono<ActorEnv>()
    .get("/zones", async (c) => c.json({ items: (await deps(c).rules.read()).zones }))
    .get("/rules", requireSignIn, async (c) => c.json(await deps(c).rules.read()))
    .put("/rules", requireStaffPermission(P.rules), zValidator("json", rulesBody), async (c) => {
      const d = deps(c);
      const rules = c.req.valid("json");
      await d.rules.write(rules, d.change.actorId, d.change.now);
      await recordChange(d.change, { module: "delivery-riders", action: "delivery.rules_changed", recordType: "settings", recordId: "rules", summary: `Delivery: ${rules.zones.length} zones, ${rules.assignment} assignment, proof ${rules.proof}` });
      return c.json(rules);
    })
    .get("/board", requireSignIn, async (c) => {
      dispatcher(c);
      const d = deps(c);
      const since = new Date(d.change.now.getTime() - 12 * 3_600_000);
      const jobs = await d.jobs.list({ since, limit: 300 });
      return c.json({
        waiting: jobs.filter((j) => j.status === "waiting").map(forStaff),
        active: jobs.filter((j) => ACTIVE_JOB_STATUSES.includes(j.status)).map(forStaff),
        done: jobs.filter((j) => j.status === "delivered" || j.status === "failed").map(forStaff),
        riders: (await d.riders.all()).filter((r) => r.online),
      });
    })
    .get("/riders", requireSignIn, async (c) => {
      dispatcher(c);
      return c.json({ items: await deps(c).riders.all() });
    })
    .post("/jobs/:id/assign", zValidator("json", assignBody), async (c) => {
      dispatcher(c);
      return c.json(forStaff(await assignJob(deps(c), c.req.param("id"), c.req.valid("json").riderUserId)));
    })
    .post("/riders/:id/cash", async (c) => {
      dispatcher(c);
      return c.json(await receiveCash(deps(c), c.req.param("id")));
    })
    .get("/rider/me", requireSignIn, async (c) => {
      const shift = await myShift(deps(c), rider(c));
      return c.json({ ...shift, current: shift.current.map(forStaff), history: shift.history.map(forStaff) });
    })
    .post("/rider/online", zValidator("json", onlineBody), async (c) => {
      rider(c);
      return c.json(await setOnline(deps(c), actorOf(c), c.req.valid("json").online));
    })
    .post("/rider/location", zValidator("json", locationBody), async (c) => {
      const { lat, lng } = c.req.valid("json");
      await pingLocation(deps(c), rider(c), lat, lng);
      return c.body(null, 204);
    })
    .post("/jobs/:id/accept", async (c) => c.json(forStaff(await acceptJob(deps(c), c.req.param("id"), rider(c)))))
    .post("/jobs/:id/decline", async (c) => c.json(forStaff(await declineJob(deps(c), c.req.param("id"), rider(c)))))
    .post("/jobs/:id/pickup", async (c) => c.json(forStaff(await pickUpJob(deps(c), c.req.param("id"), rider(c)))))
    .post("/jobs/:id/deliver", zValidator("json", deliverBody), async (c) => c.json(forStaff(await deliverJob(deps(c), c.req.param("id"), rider(c), c.req.valid("json")))))
    .post("/jobs/:id/fail", zValidator("json", failBody), async (c) => c.json(forStaff(await failJob(deps(c), c.req.param("id"), rider(c), c.req.valid("json").reason))))
    .get("/track/:orderId", requireSignIn, async (c) => {
      const d = deps(c);
      const job = await d.jobs.byOrder(c.req.param("orderId"));
      if (!job || job.customerUserId !== actorOf(c).userId) throw new AppError("not_found", "No delivery for this order yet.");
      const where = job.riderUserId ? await d.riders.byUserId(job.riderUserId) : null;
      // The guest sees their own code, to give the rider at the door.
      return c.json({
        status: job.status, code: job.code, riderName: job.riderName, minutes: job.minutes, cashToCollect: job.cashToCollect,
        rider: where && job.status === "picked_up" ? { lat: where.lat, lng: where.lng, at: where.locationAt } : null,
      });
    });
}
