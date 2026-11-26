/**
 * Mounts Stock & Inventory (module 84) behind its module switch: the
 * ledger at `/api/stock` and its desk (requisitions, purchasing, suppliers,
 * counts, recipes) at `/api/stock/desk`.
 */

import type { ActorEnv } from "@igongo/core";
import { stockDeskRouter, stockRouter } from "@igongo/stock-inventory";
import type { Context, Hono } from "hono";
import type { ApiEnv } from "../../shell/api-env";
import { mountModule as mount } from "../mount-module";

/** The request's services. */
const services = (c: Context<ActorEnv>) => (c as unknown as Context<ApiEnv>).var.services;

export function mountStockRoutes(app: Hono<ApiEnv>) {
  // The desk first, so `/api/stock/desk/*` reaches the records kit's router.
  mount(app, "stock/desk", "stock-inventory", stockDeskRouter((c) => services(c).stockDesk(c.var.actor)));
  mount(app, "stock", "stock-inventory", stockRouter((c) => services(c).stock(c.var.actor)));
}
