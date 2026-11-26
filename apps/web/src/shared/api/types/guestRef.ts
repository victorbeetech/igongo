// A guest as the CRM API lists them (packages/contracts/crm-guests), for
// any web module that links a record to a guest's account (such as a
// delivery the guest follows on their phone).

export interface GuestRef {
  id: string;
  /** The guest's app account; null for a walk-in with no app. */
  userId: string | null;
  name: string;
  phone: string | null;
}
