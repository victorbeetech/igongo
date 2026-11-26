/**
 * Promotions & Vouchers' `PromoDesk` contract, for selling modules. Steps
 * for a code:
 *   1. a voucher code (PV-0042) is looked up by its record code,
 *   2. anything else is matched against the live promotions' Promo code,
 *   3. the rules in promo-rules.ts decide if it works here and how much.
 * Redeeming a voucher moves it to Redeemed with a history line; a
 * cancelled order releases it back to Issued.
 */

import type { PromoDesk } from "@igongo/contracts/promotions-vouchers";
import { AppError, hotelDate, newId, recordChange } from "@igongo/core";
import type { RecordsDeps, WorkRecord } from "@igongo/records-kit";
import { normalCode, promotionQuote, PROMO_STATUS, voucherQuote } from "../domain/promo-rules";

/** Most live promotions read when matching a code. */
const LIVE_LIMIT = 500;

export function promoDesk(deps: RecordsDeps): PromoDesk {
  /** Steps 1 and 2: the voucher or live promotion behind [code], if any. */
  async function find(code: string): Promise<WorkRecord | null> {
    const wanted = normalCode(code);
    const voucher = await deps.records.byCode(wanted);
    if (voucher?.type === "voucher") return voucher;
    const live = await deps.records.list({ type: "promotion", status: PROMO_STATUS.live, limit: LIVE_LIMIT });
    return live.find((r) => normalCode(String(r.fields["code"] ?? "")) === wanted) ?? null;
  }

  /** Moves voucher [record] to [status], with a history line and an audit entry. */
  async function move(record: WorkRecord, status: string, text: string) {
    const now = deps.change.now;
    await deps.records.save({ ...record, status, updatedAt: now, closedAt: status === PROMO_STATUS.redeemed ? now : null });
    await deps.records.addEvent({ id: newId("rev"), recordId: record.id, kind: "status", text, status, byId: deps.change.actorId, byName: deps.change.actorName ?? "System", at: now });
    await recordChange(deps.change, { module: deps.module.key, action: "record.status", recordType: record.type, recordId: record.id, summary: `${record.code}: ${text}` });
  }

  return {
    async check(code, context) {
      const record = await find(code);
      if (!record) return null;
      // Step 3.
      const today = hotelDate(deps.change.now);
      return record.type === "voucher" ? voucherQuote(record, context, today) : promotionQuote(record, context, today);
    },
    async redeem(code, recordId) {
      const record = await find(code);
      if (record?.type !== "voucher") return; // Promotions stay live for the next guest.
      if (record.status !== PROMO_STATUS.issued) throw new AppError("conflict", "That voucher was just used.");
      await move(record, PROMO_STATUS.redeemed, `Used on ${recordId}`);
    },
    async release(code, recordId) {
      const record = await find(code);
      if (record?.type === "voucher" && record.status === PROMO_STATUS.redeemed) await move(record, PROMO_STATUS.issued, `Given back: ${recordId} was cancelled`);
    },
  };
}
