/**
 * Public contract of Points rewards (guests): what a selling module such as
 * Food Ordering may ask of the points programme. Selling modules use only
 * this; they never read the points tables.
 *
 * Every call does nothing harmful while the programme is off: spending
 * refuses with "switched off", earning gives 0, and reversing still returns
 * any points an order already took, so no guest loses points by switching off.
 */

/** What a selling module may ask of Points rewards. Built by the gateway. */
export interface PointsDesk {
  /** Shillings that [points] are worth to this guest, after checking that points can be spent here (refuses when off or under the minimum). */
  valueOf(points: number): Promise<number>;
  /** Spends [points] of the guest on the order [orderRef], once per order. Returns the shillings taken off. */
  spend(guestId: string, points: number, orderRef: string): Promise<number>;
  /** Adds the points earned on an order paid in full ([amountUgx] is what it cost). Once per order. Returns the points added. */
  earn(guestId: string, amountUgx: number, orderRef: string): Promise<number>;
  /** Puts back what an order took: spent points are returned, earned points are taken back. Once per order. */
  reverse(guestId: string, orderRef: string): Promise<void>;
}
