// The form values for one offering while staff type them. Numbers stay as text until
// they are sent, so the boxes never fight the typing. Converts both ways: an offering
// into form values (to change it), and form values into the body the API takes.

import type { Offering, OfferingKind } from "../../types/offering";

/** What the offering form holds while it is being typed. */
export interface OfferingDraft {
  /** How it is booked. Fixed once the offering exists. */
  kind: OfferingKind;
  name: string;
  description: string;
  /** Price in UGX, as typed. */
  price: string;
  /** Places, rooms or items in stock, as typed. */
  capacity: string;
  /** Times of day, separated by commas, such as `09:00, 11:00`. Empty means all day. */
  slots: string;
  /** The one date an event runs on, as `YYYY-MM-DD`. Empty means no fixed date. */
  onDate: string;
}

/** An empty form for a new offering of [kind]. */
export function blankDraft(kind: OfferingKind): OfferingDraft {
  return { kind, name: "", description: "", price: "", capacity: "", slots: "", onDate: "" };
}

/** The form values of an existing offering, ready to change. */
export function draftOf(o: Offering): OfferingDraft {
  return {
    kind: o.kind,
    name: o.name,
    description: o.description ?? "",
    price: String(o.price),
    capacity: String(o.capacity),
    slots: o.slots.join(", "),
    onDate: o.onDate ?? "",
  };
}

/**
 * The body the API takes, from the form values. Blank text becomes null (or zero for
 * numbers), and the times are split on commas with empty ones dropped.
 */
export function bodyOf(d: OfferingDraft): Partial<Offering> {
  return {
    kind: d.kind,
    name: d.name,
    description: d.description || null,
    price: Number(d.price) || 0,
    capacity: Number(d.capacity) || 0,
    slots: d.slots.split(",").map((s) => s.trim()).filter(Boolean),
    onDate: d.onDate || null,
  };
}
