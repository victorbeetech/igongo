/**
 * Attendance HTTP routes, mounted by the gateway at `/api/attendance`.
 *
 *   GET   /attendance/status            am I in or out, and today so far (S25-01)
 *   POST  /attendance/clock             clock myself in or out from the app (S25-01, S25-02)
 *   POST  /attendance/station-clock     gate or reception: a card tap or QR scan (S25-01, S25-02)
 *   GET   /attendance/mine?from&to      my days (S25-03)
 *   GET   /attendance/board?date        everyone in my scope that day (S25-04, S25-05)
 *   GET   /attendance/on-site           who is on site now (S25-06)
 *   GET   /attendance/events?from&to    raw events in my scope (S25-07, S25-10)
 *   POST  /attendance/corrections       add a missed clock with a reason (S25-08)
 *   GET   /attendance/rules             the rules (S25-11)
 *   PUT   /attendance/rules             change the rules (S25-11)
 */

import { zValidator } from "@hono/zod-validator";
import type { StaffRef } from "@igongo/contracts/hr-records";
import { actorOf, AppError, hotelDate, recordChange, requirePermission, scopeOf, scopeReaches, staffScope, type ActorEnv } from "@igongo/core";
import { Hono, type Context } from "hono";
import type { AttendanceDeps } from "../application/attendance-deps";
import { addCorrection } from "../application/use-cases/add-correction";
import { clockAtStation } from "../application/use-cases/clock-at-station";
import { clockSelf } from "../application/use-cases/clock-self";
import { dayBoard } from "../application/use-cases/day-board";
import { summarizeAll, summarizeDay } from "../domain/day-summary";
import { ATTENDANCE_PERMISSIONS as P } from "./permissions";
import { boardQuery, correctionBody, rangeQuery, rulesBody, stationBody } from "./request-schemas";

export function attendanceRouter(deps: (c: Context<ActorEnv>) => AttendanceDeps) {
  /** The caller's own staff record. @throws AppError `not_found` for accounts with none */
  async function self(c: Context<ActorEnv>): Promise<StaffRef> {
    const me = await deps(c).staff.byUserId(actorOf(c).userId);
    if (!me) throw new AppError("not_found", "Your account is not linked to a staff record yet. Ask HR.");
    return me;
  }

  /** Whose records the caller reaches with [permission]. @throws AppError `permission_denied` */
  async function scopeFor(c: Context<ActorEnv>, permission: string) {
    const actor = actorOf(c);
    const scope = staffScope(actor, permission, await deps(c).staff.byUserId(actor.userId));
    if (!scope) throw new AppError("permission_denied", `You need the permission ${permission}.`);
    return scope;
  }

  return (
    new Hono<ActorEnv>()
      .get("/status", async (c) => {
        const d = deps(c);
        const me = await self(c);
        const today = hotelDate(d.change.now);
        const events = await d.events.list({ from: today, to: today, staffId: me.staffId });
        const last = await d.events.latestFor(me.staffId);
        return c.json({ staff: me, clockedIn: last?.kind === "in", last, today: summarizeDay(events, d.change.now), rules: await d.rules.read() });
      })
      .post("/clock", requirePermission(P.clockSelf), async (c) => {
        const me = await self(c);
        return c.json({ event: await clockSelf(deps(c), me), staff: me }, 201);
      })
      .post("/station-clock", requirePermission(P.station), zValidator("json", stationBody), async (c) => {
        // A station clocks other people, so an "own" grant is not enough.
        const scope = scopeOf(actorOf(c), P.station);
        if (scope !== "all" && scope !== "location") throw new AppError("permission_denied", "This account cannot run a gate or reception station.");
        const { station, ...scan } = c.req.valid("json");
        return c.json(await clockAtStation(deps(c), { scan, station }), 201);
      })
      .get("/mine", zValidator("query", rangeQuery), async (c) => {
        const d = deps(c);
        const me = await self(c);
        const { from, to } = c.req.valid("query");
        const events = await d.events.list({ from, to, staffId: me.staffId });
        return c.json({ days: summarizeAll(events, d.change.now), events });
      })
      .get("/board", zValidator("query", boardQuery), async (c) => {
        const d = deps(c);
        const scope = await scopeFor(c, P.view);
        const date = c.req.valid("query").date ?? hotelDate(d.change.now);
        return c.json({ date, rows: await dayBoard(d, scope, date) });
      })
      .get("/on-site", async (c) => {
        const d = deps(c);
        const rows = await dayBoard(d, await scopeFor(c, P.view), hotelDate(d.change.now));
        return c.json({ rows: rows.filter((r) => r.onSite) });
      })
      .get("/events", zValidator("query", rangeQuery), async (c) => {
        const scope = await scopeFor(c, P.view);
        const { from, to, staffId } = c.req.valid("query");
        const events = await deps(c).events.list({
          from,
          to,
          ...(scope.kind === "own" ? { staffId: scope.staffId } : staffId ? { staffId } : {}),
          ...(scope.kind === "department" ? { department: scope.department } : {}),
        });
        return c.json({ events });
      })
      .post("/corrections", zValidator("json", correctionBody), async (c) => {
        const d = deps(c);
        const body = c.req.valid("json");
        const scope = await scopeFor(c, P.edit);
        const staff = await d.staff.byId(body.staffId);
        if (!staff || !scopeReaches(scope, staff)) throw new AppError("not_found", "Staff member not found.");
        // Nobody corrects their own attendance unless they reach everyone.
        if (scope.kind !== "all" && staff.userId === actorOf(c).userId) throw new AppError("permission_denied", "Ask your supervisor or HR to correct your own attendance.");
        return c.json(await addCorrection(d, staff, { kind: body.kind, at: new Date(body.at), reason: body.reason }), 201);
      })
      .get("/rules", async (c) => c.json(await deps(c).rules.read()))
      .put("/rules", requirePermission(P.rules), zValidator("json", rulesBody), async (c) => {
        const d = deps(c);
        const rules = c.req.valid("json");
        await d.rules.write(rules, d.change.actorId, d.change.now);
        await recordChange(d.change, { module: "attendance", action: "attendance.rules_changed", recordType: "settings", recordId: "rules", summary: `Changed attendance rules: day starts ${rules.dayStartsAt}, ${rules.graceMinutes} minutes grace` });
        return c.json(rules);
      })
  );
}

