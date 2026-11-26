// The details a card shows for its holder, from HR and the card record.

import type { CardField } from "./cardElement";

export type CardHolder = Partial<Record<CardField, string>> & {
  photoUrl?: string | null;
  qr: string;
};

/** A long-name sample for the fit check when no person is picked. */
export const SAMPLE_HOLDER: CardHolder = {
  full_name: "Bwambale Kansiime Tumusiime",
  role: "Senior Front Office Supervisor",
  department: "Front office",
  staff_no: "IGG-0042",
  card_no: "C-000042",
  issue_date: "26 Nov 2026",
  expiry_date: "Valid to Nov 2028",
  hotel_phone: "+256 000 000 000",
  card_label: "STAFF",
  qr: "IGG-CARD:sample",
};
