/**
 * One thing drawn on a card side: a holder field (name, role, staff number,
 * dates), fixed words, the logo, the photo, the QR code or a coloured shape.
 * Positions are in tenths of a millimetre on the card (a portrait CR80 card
 * is 540 by 856), so a design prints at the exact size.
 */

/** What an element shows. */
export const ELEMENT_KINDS = ["field", "text", "logo", "photo", "qr", "shape"] as const;
export type ElementKind = (typeof ELEMENT_KINDS)[number];

/** The holder details a `field` element can show. */
export const CARD_FIELDS = ["full_name", "role", "department", "staff_no", "card_no", "issue_date", "expiry_date", "hotel_phone", "card_label"] as const;
export type CardField = (typeof CARD_FIELDS)[number];

/** Brand colours only (packages/design-tokens): no free colour picking. */
export const CARD_COLOURS = ["red", "red-dark", "black", "night", "cream", "white"] as const;
export type CardColour = (typeof CARD_COLOURS)[number];

/** Brand logo files (packages/brand/logo). */
export const LOGO_KINDS = ["spiral", "mark", "stacked", "horizontal"] as const;

export interface CardElement {
  id: string;
  kind: ElementKind;
  x: number;
  y: number;
  w: number;
  h: number;
  /** For `field`. */
  field?: CardField;
  /** For `text`. */
  text?: string;
  /** For `logo`: which lockup. */
  logo?: (typeof LOGO_KINDS)[number];
  /** Text colour, shape fill or logo colour. */
  colour: CardColour;
  /** Text size in tenths of a millimetre (brand font sizes are picked by the editor). */
  size: number;
  /** Cinzel for brand moments, Lato for everything else. */
  font: "brand" | "body";
  bold: boolean;
  align: "start" | "middle" | "end";
  /** Shapes: rounded corners. */
  radius: number;
}
