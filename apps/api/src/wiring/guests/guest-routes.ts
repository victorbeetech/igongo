/**
 * Mounts the guest and rider modules (build step 3). Each sits behind its
 * own module switch, so the super admin can turn one off (or put it in
 * maintenance) without touching the others.
 *
 *   /api/crm/*        guest profiles, my account            module 54
 *   /api/content/*    guest app content (banners, stories)  module 61
 *   /api/points/*     points rewards (rules, wallet, admin) module 57
 *   /api/menu/*       outlets and menus                      module 61
 *   /api/orders/*     food orders                            module 62
 *   /api/delivery/*   delivery and the rider screens         module 66
 *   /api/payments/*   payments and provider callbacks        module 77
 *   /api/rooms/*      room bookings                          module 67
 *   /api/museum/*     museum tickets and tours               module 68
 *   /api/events/*     events and enquiries                   module 69
 *   /api/pool/*       pool passes and lessons                module 71
 *   /api/shop/*       crafts and bookshop                    module 73
 *   /api/spa/*        spa treatments (Humura)                module 72
 *   /api/venues/*     venues and equipment hire              module 70
 *   /api/tables/*     table reservations                     module 64
 */

import { guestContentRouter } from "@igongo/guest-content";
import { craftsBookshopRouter } from "@igongo/crafts-bookshop";
import type { ActorEnv } from "@igongo/core";
import { crmRouter } from "@igongo/crm-guests";
import { deliveryRouter } from "@igongo/delivery-riders";
import { eventsConferencesRouter } from "@igongo/events-conferences";
import { ordersRouter } from "@igongo/food-ordering";
import { menuRouter } from "@igongo/menu-catalogue";
import { museumRouter } from "@igongo/museum";
import { paymentsRouter } from "@igongo/payments";
import { pointsRouter } from "@igongo/points-rewards";
import { poolRouter } from "@igongo/pool";
import { roomBookingsRouter } from "@igongo/room-bookings";
import { spaRouter } from "@igongo/spa";
import { tablesDineinRouter } from "@igongo/tables-dinein";
import { venuesEquipmentRouter } from "@igongo/venues-equipment";
import type { Context, Hono } from "hono";
import type { ApiEnv } from "../../shell/api-env";
import { mountModule as mount } from "../mount-module";
import type { BookingModuleKey } from "./guest-services";

/** The guest services for this request. */
const guests = (c: Context<ActorEnv>) => (c as unknown as Context<ApiEnv>).var.services.guestModules(c.var.actor);

/** A booking module's deps getter. */
const booking = (key: BookingModuleKey) => (c: Context<ActorEnv>) => guests(c).booking(key);

export function mountGuestRoutes(app: Hono<ApiEnv>) {
  mount(app, "crm", "crm-guests", crmRouter((c) => guests(c).crm()));
  mount(app, "content", "guest-content", guestContentRouter((c) => guests(c).content()));
  mount(app, "points", "points-rewards", pointsRouter((c) => guests(c).points()));
  mount(app, "menu", "menu-catalogue", menuRouter((c) => guests(c).menu()));
  mount(app, "orders", "food-ordering", ordersRouter((c) => guests(c).ordering()));
  mount(app, "delivery", "delivery-riders", deliveryRouter((c) => guests(c).delivery()));
  mount(app, "payments", "payments", paymentsRouter((c) => guests(c).payments()));
  mount(app, "rooms", "room-bookings", roomBookingsRouter(booking("room-bookings")));
  mount(app, "museum", "museum", museumRouter(booking("museum")));
  mount(app, "events", "events-conferences", eventsConferencesRouter(booking("events-conferences")));
  mount(app, "pool", "pool", poolRouter(booking("pool")));
  mount(app, "shop", "crafts-bookshop", craftsBookshopRouter(booking("crafts-bookshop")));
  mount(app, "spa", "spa", spaRouter(booking("spa")));
  mount(app, "venues", "venues-equipment", venuesEquipmentRouter(booking("venues-equipment")));
  mount(app, "tables", "tables-dinein", tablesDineinRouter(booking("tables-dinein")));
}
