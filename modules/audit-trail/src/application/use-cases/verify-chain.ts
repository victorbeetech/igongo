/**
 * Use case: check the hash chain for tampering. Recomputes each row's hash
 * and checks it links to the row before. Done in pages so years of records
 * can be checked a piece at a time.
 */

import type { ChainCheck } from "../../domain/chain-check";
import type { AuditStore } from "../ports/audit-store";

/** Checks up to [limit] rows (at most 50,000) starting at [fromSeq]. */
export function verifyChain(store: AuditStore, fromSeq = 1, limit = 10_000): Promise<ChainCheck> {
  return store.verify(Math.max(fromSeq, 1), Math.min(Math.max(limit, 1), 50_000));
}
