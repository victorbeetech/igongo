/** One meal served to one staff member. At most one of each meal per person per day. */

/** nfc: card tapped; qr: card QR scanned; manual: the attendant picked the name. */
export const CLAIM_METHODS = ["nfc", "qr", "manual"] as const;
export type ClaimMethod = (typeof CLAIM_METHODS)[number];

export interface MealClaim {
  id: string;
  staffId: string;
  department: string | null;
  workDate: string;
  mealKey: string;
  method: ClaimMethod;
  /** The canteen attendant (a user ID). */
  servedBy: string | null;
  at: Date;
}
