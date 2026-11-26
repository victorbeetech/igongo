/** Zod schema for the design set (`PUT /cards/designs`). */

import { z } from "zod";
import { CARD_COLOURS, CARD_FIELDS, ELEMENT_KINDS, LOGO_KINDS } from "../domain/card-element";

const key = z.string().trim().regex(/^[a-z0-9-]{2,40}$/);
const unit = z.number().min(-2000).max(2000);
const colour = z.enum(CARD_COLOURS);

const element = z.object({
  id: z.string().trim().min(1).max(40),
  kind: z.enum(ELEMENT_KINDS),
  x: unit,
  y: unit,
  w: unit,
  h: unit,
  field: z.enum(CARD_FIELDS).optional(),
  text: z.string().max(200).optional(),
  logo: z.enum(LOGO_KINDS).optional(),
  colour,
  size: z.number().min(10).max(200),
  font: z.enum(["brand", "body"]),
  bold: z.boolean(),
  align: z.enum(["start", "middle", "end"]),
  radius: z.number().min(0).max(200),
});

const side = z.object({ background: colour, elements: z.array(element).max(40) });

export const designsBody = z.object({
  templates: z.array(z.object({ key, name: z.string().trim().min(1).max(60), orientation: z.enum(["portrait", "landscape"]), cardType: key, front: side, back: side, active: z.boolean() })).min(1).max(40),
  types: z.array(z.object({
    key, name: z.string().trim().min(1).max(80), widthMm: z.number().min(20).max(200), heightMm: z.number().min(20).max(200), cornerMm: z.number().min(0).max(10),
    chip: z.string().trim().max(60), write: z.string().trim().max(120), passwordLock: z.boolean(), originalityCheck: z.boolean(), tapCounter: z.boolean(), printPreset: z.string().trim().max(80), active: z.boolean(),
  })).min(1).max(20),
  defaultTemplate: key,
  byRole: z.record(z.string().max(80), key),
});
