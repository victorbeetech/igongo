/**
 * Promotions and vouchers (module 59) of the Igongo API. The gateway imports only
 * this file. See modules/promotions-vouchers/README.md.
 */

import type { StaffDirectory } from "@igongo/contracts/hr-records";
import type { ChangeContext, Database } from "@igongo/core";
import { recordKpis, recordsDeps, recordsRouter, type RecordsDeps } from "@igongo/records-kit";
import { promotionsVouchersModule } from "./domain/promotions-vouchers-module";
import { promotionsVouchersTables } from "./infrastructure/db/schema";

export { promotionsVouchersModule };

/** This module's dependencies for one request. [staff] is null while HR Records is off. */
export const promotionsVouchersDeps = (db: Database, change: ChangeContext, staff: StaffDirectory | null): RecordsDeps => recordsDeps(promotionsVouchersModule, promotionsVouchersTables, db, change, staff);

/** The routes, mounted at `/api/promotions`. */
export const promotionsVouchersRouter = (deps: Parameters<typeof recordsRouter>[1]) => recordsRouter(promotionsVouchersModule.key, deps);

/** This module's numbers for the management dashboard. */
export const promotionsVouchersKpis = (db: Database) => recordKpis(promotionsVouchersModule, promotionsVouchersTables, db, "Promotions and vouchers");

/** The `PromoDesk` contract (promo and voucher codes at checkouts), for the gateway to hand to selling modules. */
export { promoDesk } from "./infrastructure/promo-desk";
