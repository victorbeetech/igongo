/** The stock ledger: movements (append-only) and balances summed from them. */

import type { Movement, MovementKind } from "../../domain/movement";

/** One item's quantity in one store. */
export interface Balance {
  itemId: string;
  storeId: string;
  qty: number;
}

export interface MovementFilter {
  itemId?: string;
  storeId?: string;
  kind?: MovementKind;
  from?: Date;
  to?: Date;
  limit: number;
}

export interface MovementRepository {
  add(movement: Movement): Promise<void>;
  nextNumber(): Promise<string>;
  list(filter: MovementFilter): Promise<Movement[]>;
  /** Every non-zero balance, optionally of one item or one store. */
  balances(filter: { itemId?: string; storeId?: string }): Promise<Balance[]>;
}
