/** Where a booking module's offerings are kept. */

import type { Offering } from "../../domain/offering";

export interface OfferingRepository {
  byId(id: string): Promise<Offering | null>;
  list(): Promise<Offering[]>;
  save(offering: Offering): Promise<void>;
  /**
   * Changes the stock of a `stock` offering by [delta], never below zero.
   * @returns false when there was not enough stock
   */
  moveStock(id: string, delta: number): Promise<boolean>;
}
