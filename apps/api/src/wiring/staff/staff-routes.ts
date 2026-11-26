/**
 * Mounts the staff modules (build step 2). Each sits behind its own module
 * switch, so the super admin can turn one off (or put it in maintenance)
 * without touching the others.
 *
 *   /api/hr/*             staff directory and profiles        module 22
 *   /api/cards/*          staff cards, NFC and QR              module 16
 *   /api/wristbands/*     event wristbands                     module 17
 *   /api/attendance/*     clock-in and out, boards             module 25
 *   /api/daily-reports/*  daily reports and sign-off           module 38
 *   /api/staff-meals/*    canteen meals                        module 32
 *   /api/notices/*        notice board                         module 49
 */

import { attendanceRouter } from "@igongo/attendance";
import type { ActorEnv } from "@igongo/core";
import { reportsRouter } from "@igongo/daily-reports";
import { hrRouter } from "@igongo/hr-records";
import { noticesRouter } from "@igongo/notice-board";
import { cardsRouter } from "@igongo/staff-cards";
import { mealsRouter } from "@igongo/staff-meals";
import { wristbandsRouter } from "@igongo/wristbands";
import type { Context, Hono } from "hono";
import type { ApiEnv } from "../../shell/api-env";
import { mountModule as mount } from "../mount-module";

/** The shell's services and the caller's change context, from a module router's context. */
function services(c: Context<ActorEnv>) {
  const s = (c as unknown as Context<ApiEnv>).var.services;
  return { staff: s.staffModules(), change: s.changeContext(c.var.actor), roles: s.access() };
}

export function mountStaffRoutes(app: Hono<ApiEnv>) {
  mount(app, "hr", "hr-records", hrRouter((c) => ({ staff: services(c).staff.staff(), roles: services(c).roles, change: services(c).change })));
  mount(app, "cards", "staff-cards", cardsRouter((c) => ({ cards: services(c).staff.cards(), staff: services(c).staff.staff(), change: services(c).change })));
  mount(app, "wristbands", "wristbands", wristbandsRouter((c) => ({ bands: services(c).staff.bands(), change: services(c).change })));
  mount(app, "attendance", "attendance", attendanceRouter((c) => services(c).staff.attendance(services(c).change)));
  mount(app, "daily-reports", "daily-reports", reportsRouter((c) => services(c).staff.reports(services(c).change)));
  mount(app, "staff-meals", "staff-meals", mealsRouter((c) => services(c).staff.meals(services(c).change)));
  mount(app, "notices", "notice-board", noticesRouter((c) => services(c).staff.notices(services(c).change)));
}
