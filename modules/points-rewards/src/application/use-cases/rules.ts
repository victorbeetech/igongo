/**
 * Reading and saving the points rules. The super admin saves them; the guest
 * app reads only the public part (and only while the programme is on).
 */

import { recordChange } from "@igongo/core";
import type { PointsRules } from "../../domain/rules";
import type { PointsDeps } from "../points-deps";

/** The saved rules, or the starting rules before anything is saved. */
export async function readRules(deps: PointsDeps): Promise<PointsRules> {
  return deps.store.readRules();
}

/**
 * Saves the whole rules set and records the change in the audit trail with
 * the key numbers, so the audit screen reads clearly.
 */
export async function saveRules(deps: PointsDeps, rules: PointsRules): Promise<PointsRules> {
  const { store, change } = deps;
  await store.writeRules(rules, change.actorId, change.now);
  await recordChange(change, {
    module: "points-rewards",
    action: "points_rules.saved",
    recordType: "points_rules",
    recordId: "points-rewards",
    summary: `Points rules saved: ${rules.enabled ? "on" : "off"}, ${rules.pointsPer1000Ugx} point(s) per 1,000 UGX, minimum ${rules.minimumToRedeem} to spend, ${rules.ugxPerPoint} UGX a point, expiry ${rules.expiryDays === 0 ? "never" : `${rules.expiryDays} days`}`,
  });
  return rules;
}
