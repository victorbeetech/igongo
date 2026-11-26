// One thing drawn on a card side, as the card designs API keeps it
// (modules/card-designs). Positions are tenths of a millimetre.

export type ElementKind = "field" | "text" | "logo" | "photo" | "qr" | "shape";
export type CardField = "full_name" | "role" | "department" | "staff_no" | "card_no" | "issue_date" | "expiry_date" | "hotel_phone" | "card_label";
export type CardColour = "red" | "red-dark" | "black" | "night" | "cream" | "white";
export type LogoKind = "spiral" | "mark" | "stacked" | "horizontal";

export interface CardElement {
  id: string;
  kind: ElementKind;
  x: number;
  y: number;
  w: number;
  h: number;
  field?: CardField;
  text?: string;
  logo?: LogoKind;
  colour: CardColour;
  size: number;
  font: "brand" | "body";
  bold: boolean;
  align: "start" | "middle" | "end";
  radius: number;
}

/** Each holder field in words, for the editor. */
export const FIELD_WORDS: Record<CardField, string> = {
  full_name: "Full name",
  role: "Role",
  department: "Department",
  staff_no: "Staff number",
  card_no: "Card number",
  issue_date: "Issue date",
  expiry_date: "Expiry date",
  hotel_phone: "Hotel phone",
  card_label: "Card label",
};

export const KIND_WORDS: Record<ElementKind, string> = { field: "Holder detail", text: "Words", logo: "Logo", photo: "Photo", qr: "QR code", shape: "Colour block" };

export const COLOURS: CardColour[] = ["red", "red-dark", "black", "night", "cream", "white"];
export const LOGOS: LogoKind[] = ["spiral", "mark", "stacked", "horizontal"];
