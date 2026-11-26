/** Zod schemas for Payments request bodies and queries. */

import { PAYMENT_METHODS } from "@igongo/contracts/payments";
import { recordOf } from "@igongo/core";
import { z } from "zod";

const ref = { module: z.string().regex(/^[a-z0-9-]{2,40}$/), recordId: z.string().min(3).max(80) };
const amount = z.number().int().min(1).max(1_000_000_000);
const method = z.enum(PAYMENT_METHODS);

/** `GET /payments/methods`. */
export const methodsQuery = z.object({ module: ref.module, outlet: z.string().max(40).optional() });

/** `POST /payments/pay`. */
export const payBody = z.object({ ...ref, method, amount: amount.optional(), phone: z.string().trim().max(20).optional() });

/** `POST /payments/record`. */
export const recordBody = z.object({ ...ref, method, amount: amount.optional(), reference: z.string().trim().max(80).optional() });

/** `GET /payments`. */
export const listQuery = z.object({ status: z.enum(["pending", "succeeded", "failed", "refunded"]).optional(), module: ref.module.optional(), mine: z.enum(["1"]).optional() });

/** `POST /payments/:id/refund`. */
export const refundBody = z.object({ amount, reason: z.string().trim().min(3).max(300) });

const methodSwitch = z.object({ enabled: z.boolean(), outlets: z.array(z.string().max(40)).max(30), modules: z.array(ref.module).max(30) });

/** `PUT /payments/settings`. */
export const settingsBody = z.object({
  methods: z.object(recordOf(PAYMENT_METHODS, () => methodSwitch)),
  allowManual: z.boolean(),
  environment: z.enum(["sandbox", "live"]),
});
