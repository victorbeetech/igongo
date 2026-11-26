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
 *   POST  /delivery/jobs                  the dispatcher sends anything else (shop, laundry, parcel)
 *   GET   /delivery/mine                  the tracker: my deliveries of every kind (S66-10)
 *   GET   /delivery/track/job/:jobId      one delivery on the tracker
 *   GET   /delivery/track/:orderId        a food order's delivery on the tracker
 */

import { zValidator } from "@hono/zod-validator";
import { actorOf, AppError, omitKey, recordChange, requireSignIn, requireStaffPermission, scopeOf, type ActorEnv } from "@igongo/core";
import { Hono, type Context } from "hono";
import type { DeliveryDeps } from "../application/delivery-deps";
import { assignJob } from "../application/use-cases/assign-job";
import { openDelivery } from "../application/use-cases/open-job";
import { acceptJob, declineJob, deliverJob, failJob, pickUpJob } from "../application/use-cases/rider-actions";
import { myShift, pingLocation, receiveCash, setOnline } from "../application/use-cases/rider-shift";
import { ACTIVE_JOB_STATUSES, type DeliveryJob } from "../domain/delivery-job";
import { trackingOf } from "../domain/delivery-tracking";
import { DELIVERY_PERMISSIONS as P } from "./permissions";
import { assignBody, deliverBody, failBody, locationBody, manualJobBody, onlineBody, rulesBody } from "./request-schemas";

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

/** How far back the tracker lists finished deliveries. */
const TRACKER_DAYS = 30;

/**
 * The tracker view of [job] for the signed-in guest. Someone else's delivery
 * is refused with 403 (never shown, never hinted at beyond that).
 */
async function trackFor(c: Context<ActorEnv>, deps: DeliveryDeps, job: DeliveryJob | null) {
  if (!job) throw new AppError("not_found", "No delivery for this yet.");
  if (job.customerUserId !== actorOf(c).userId) throw new AppError("permission_denied", "This delivery is not yours.");
  return trackingOf(job, job.riderUserId ? await deps.riders.byUserId(job.riderUserId) : null);
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
    .post("/jobs", zValidator("json", manualJobBody), async (c) => {
      dispatcher(c);
      const { source, what, customer, place, cashToCollect } = c.req.valid("json");
      const job = await openDelivery(deps(c), {
        source, recordId: null, reference: null, what, place, cashToCollect,
        customer: { userId: customer.userId ?? null, name: customer.name, phone: customer.phone ?? null },
      });
      return c.json(forStaff(job), 201);
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
    .get("/mine", requireSignIn, async (c) => {
      const d = deps(c);
      const since = new Date(d.change.now.getTime() - TRACKER_DAYS * 86_400_000);
      const jobs = await d.jobs.list({ customerUserId: actorOf(c).userId, since, limit: 100 });
      // Rider positions only for deliveries on the road; one read per rider.
      const riders = new Map<string, Awaited<ReturnType<typeof d.riders.byUserId>>>();
      for (const j of jobs) if (j.status === "picked_up" && j.riderUserId && !riders.has(j.riderUserId)) riders.set(j.riderUserId, await d.riders.byUserId(j.riderUserId));
      const items = jobs.map((j) => trackingOf(j, j.riderUserId ? (riders.get(j.riderUserId) ?? null) : null));
      return c.json({ active: items.filter((t) => t.status !== "delivered" && t.status !== "failed"), done: items.filter((t) => t.status === "delivered" || t.status === "failed") });
    })
    .get("/track/job/:jobId", requireSignIn, async (c) => {
      const d = deps(c);
      return c.json(await trackFor(c, d, await d.jobs.byId(c.req.param("jobId"))));
    })
    .get("/track/:orderId", requireSignIn, async (c) => {
      const d = deps(c);
      return c.json(await trackFor(c, d, await d.jobs.bySource("food", c.req.param("orderId"))));
    });
}
