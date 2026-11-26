/**
 * The guest and rider modules' dependencies for one request (build step 3):
 * CRM, Menus, Food Ordering, Delivery & Riders, Payments and the booking
 * modules (Rooms, Museum, Events, Pool, Shop). Modules meet only through
 * their contracts, wired here:
 *
 *   Food Ordering  -> MenuReader (Menus), DeliveryDesk (Delivery)
 *   Delivery       -> OrderTracker (Food Ordering)
 *   Payments       -> a Payable from each selling module
 *
 * A module the super admin switched off is left out of the others' view.
 */

import type { DeliveryDesk } from "@igongo/contracts/delivery-riders";
import type { Payable } from "@igongo/contracts/payments";
import type { ModuleSwitchReader, SecretReader } from "@igongo/contracts/super-admin";
import { bookingPayable, type BookingsDeps } from "@igongo/bookings-kit";
import { AppError, type ChangeContext, type Database } from "@igongo/core";
import { craftsBookshopDeps } from "@igongo/crafts-bookshop";
import { DrizzleProfileRepository, SettingsCrmStore, type CrmDeps } from "@igongo/crm-guests";
import { deliveryDesk, DrizzleJobRepository, DrizzleRiderRepository, SettingsDeliveryRulesStore, type DeliveryDeps } from "@igongo/delivery-riders";
import { eventsConferencesDeps } from "@igongo/events-conferences";
import { DrizzleOrderRepository, orderPayable, orderTracker, SettingsRulesStore, type OrderingDeps } from "@igongo/food-ordering";
import { DrizzleItemRepository, menuReader, SettingsMenuStore, type MenuDeps } from "@igongo/menu-catalogue";
import { museumDeps } from "@igongo/museum";
import { DrizzlePaymentRepository, paymentProviders, SettingsMethodStore, type PaymentsDeps } from "@igongo/payments";
import { poolDeps } from "@igongo/pool";
import { roomBookingsDeps } from "@igongo/room-bookings";
import { spaDeps } from "@igongo/spa";
import { tablesDineinDeps } from "@igongo/tables-dinein";
import { venuesEquipmentDeps } from "@igongo/venues-equipment";

/** The booking modules: module key, and how to build its deps. */
export const BOOKING_MODULES = {
  "room-bookings": roomBookingsDeps,
  museum: museumDeps,
  "events-conferences": eventsConferencesDeps,
  pool: poolDeps,
  "crafts-bookshop": craftsBookshopDeps,
  spa: spaDeps,
  "venues-equipment": venuesEquipmentDeps,
  "tables-dinein": tablesDineinDeps,
} as const;
export type BookingModuleKey = keyof typeof BOOKING_MODULES;

export class GuestServices {
  constructor(
    private readonly db: Database,
    private readonly change: ChangeContext,
    private readonly modules: ModuleSwitchReader,
    private readonly secrets: SecretReader,
    /** The API's and the web portal's public addresses, for payment callbacks and returns. */
    private readonly urls: { api: string; web: string },
  ) {}

  /** True when the super admin has [key] on and not in maintenance. */
  private async isOn(key: string): Promise<boolean> {
    const s = await this.modules.stateOf(key);
    return s.enabled && !s.maintenance;
  }

  crm(): CrmDeps {
    return { profiles: new DrizzleProfileRepository(this.db), settings: new SettingsCrmStore(this.db), change: this.change };
  }

  menu(): MenuDeps {
    return { items: new DrizzleItemRepository(this.db), settings: new SettingsMenuStore(this.db), change: this.change };
  }

  ordering(): OrderingDeps {
    const m = this.menu();
    return { orders: new DrizzleOrderRepository(this.db), rules: new SettingsRulesStore(this.db), menu: menuReader(m.items, m.settings, this.change.now), delivery: this.deliveryDesk(), change: this.change };
  }

  delivery(): DeliveryDeps {
    return { jobs: new DrizzleJobRepository(this.db), riders: new DrizzleRiderRepository(this.db), rules: new SettingsDeliveryRulesStore(this.db), orders: orderTracker(this.ordering()), change: this.change };
  }

  /** Delivery & Riders as Food Ordering sees it: refuses while the module is off. */
  private deliveryDesk(): DeliveryDesk {
    const desk = () => deliveryDesk(this.delivery());
    const on = async () => {
      if (!(await this.isOn("delivery-riders"))) throw new AppError("module_disabled", "Delivery is switched off for now.");
    };
    return {
      quote: async (zone) => (await on(), desk().quote(zone)),
      open: async (order) => {
        // A ready order still counts when delivery is off; staff hand it over by hand.
        if (await this.isOn("delivery-riders")) await desk().open(order);
      },
    };
  }

  /** One booking module's deps. */
  booking(key: BookingModuleKey): BookingsDeps {
    return BOOKING_MODULES[key](this.db, this.change);
  }

  payments(): PaymentsDeps {
    const settings = new SettingsMethodStore(this.db);
    const payables: Record<string, Payable> = { "food-ordering": orderPayable(this.ordering()) };
    for (const key of Object.keys(BOOKING_MODULES) as BookingModuleKey[]) payables[key] = bookingPayable(this.booking(key));
    return {
      payments: new DrizzlePaymentRepository(this.db),
      settings,
      providers: paymentProviders(this.secrets, async () => (await settings.read()).environment),
      payables,
      change: this.change,
      apiBase: this.urls.api,
      webBase: this.urls.web,
    };
  }
}
