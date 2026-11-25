// The shape of one way to pay, as the super admin switches it on and off.

/** One payment method. */
export interface PaymentMethod {
  /** Its name, such as "MTN Mobile Money". */
  name: string;
  /** How a guest or staff member uses it. */
  how: string;
  /** The provider on Connection settings that holds its keys, or null when it needs none (cash). */
  provider: string | null;
  /** Whether it is on in the sample (the hotel turns methods on as it agrees them). */
  on: boolean;
}
