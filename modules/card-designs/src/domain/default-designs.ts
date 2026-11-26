/**
 * The designs the system starts with: the approved black portrait card
 * (the default for every role, approved 25 Nov 2026) and a red landscape
 * card, on the current CR80 NTAG213 cards and the recommended NTAG 424 DNA
 * cards (from packages/brand/cards). The super admin changes all of it.
 */

import type { CardElement } from "./card-element";
import type { CardDesigns } from "./card-designs";

/** An element with the usual look filled in. */
const el = (id: string, kind: CardElement["kind"], x: number, y: number, w: number, h: number, more: Partial<CardElement> = {}): CardElement => ({
  id, kind, x, y, w, h, colour: "white", size: 34, font: "body", bold: false, align: "middle", radius: 0, ...more,
});

export const DEFAULT_CARD_DESIGNS: CardDesigns = {
  defaultTemplate: "portrait-black",
  byRole: {},
  types: [
    { key: "cr80-ntag213", name: "CR80 card, NXP NTAG213 (current cards)", widthMm: 85.6, heightMm: 54, cornerMm: 3.18, chip: "NXP NTAG213", write: "NDEF URL with a secure card ID", passwordLock: true, originalityCheck: true, tapCounter: true, printPreset: "CR80 duplex, actual size", active: true },
    { key: "cr80-ntag424dna", name: "CR80 card, NXP NTAG 424 DNA (copy-proof)", widthMm: 85.6, heightMm: 54, cornerMm: 3.18, chip: "NXP NTAG 424 DNA", write: "SUN URL with a secure card ID", passwordLock: true, originalityCheck: true, tapCounter: true, printPreset: "CR80 duplex, actual size", active: false },
  ],
  templates: [
    {
      key: "portrait-black",
      name: "Black (default)",
      orientation: "portrait",
      cardType: "cr80-ntag213",
      active: true,
      front: {
        background: "night",
        elements: [
          el("logo", "logo", 170, 40, 200, 200, { logo: "spiral", colour: "red" }),
          el("photo", "photo", 145, 270, 250, 300, { radius: 24 }),
          el("name", "field", 30, 620, 480, 60, { field: "full_name", size: 44, font: "brand", bold: true }),
          el("role", "field", 30, 690, 480, 40, { field: "role", colour: "red", size: 30, bold: true }),
          el("staffno", "field", 30, 750, 480, 40, { field: "staff_no", colour: "cream", size: 26 }),
          el("bar", "shape", 0, 826, 540, 30, { colour: "red" }),
        ],
      },
      back: {
        background: "night",
        elements: [
          el("qr", "qr", 120, 120, 300, 300, { colour: "black" }),
          el("label", "field", 30, 460, 480, 40, { field: "card_label", colour: "cream", size: 28, bold: true }),
          el("expiry", "field", 30, 520, 480, 36, { field: "expiry_date", colour: "cream", size: 24 }),
          el("phone", "field", 30, 580, 480, 36, { field: "hotel_phone", colour: "cream", size: 24 }),
          el("words", "text", 30, 660, 480, 80, { text: "If found, please return to Igongo Country Hotel & Cultural Centre, Mbarara.", colour: "cream", size: 22 }),
          el("mark", "logo", 220, 760, 100, 70, { logo: "mark", colour: "red" }),
        ],
      },
    },
    {
      key: "landscape-red",
      name: "Red landscape",
      orientation: "landscape",
      cardType: "cr80-ntag213",
      active: true,
      front: {
        background: "red",
        elements: [
          el("logo", "logo", 40, 40, 300, 110, { logo: "horizontal", colour: "white" }),
          el("photo", "photo", 600, 170, 210, 260, { radius: 20 }),
          el("name", "field", 40, 220, 520, 60, { field: "full_name", size: 44, font: "brand", bold: true, align: "start" }),
          el("role", "field", 40, 290, 520, 40, { field: "role", colour: "cream", size: 30, align: "start" }),
          el("staffno", "field", 40, 350, 520, 40, { field: "staff_no", colour: "cream", size: 26, align: "start" }),
        ],
      },
      back: {
        background: "cream",
        elements: [
          el("qr", "qr", 40, 120, 300, 300, { colour: "black" }),
          el("label", "field", 380, 140, 440, 40, { field: "card_label", colour: "black", size: 28, bold: true, align: "start" }),
          el("expiry", "field", 380, 200, 440, 36, { field: "expiry_date", colour: "black", size: 24, align: "start" }),
          el("phone", "field", 380, 260, 440, 36, { field: "hotel_phone", colour: "black", size: 24, align: "start" }),
        ],
      },
    },
  ],
};
